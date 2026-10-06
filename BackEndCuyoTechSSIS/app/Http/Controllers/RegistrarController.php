<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Clearance;
use App\Models\Course;
use App\Models\DocumentRequest;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\Student;
use App\Models\Subject;
use App\Models\SubjectEnrollment;
use App\Services\PortalNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class RegistrarController extends Controller
{
    public function students(): JsonResponse
    {
        return response()->json([
            'students' => Student::query()
                ->with([
                    'user:id,email,status',
                    'enrollments' => fn ($query) => $query
                        ->with(['course.department', 'subjectEnrollments.subject'])
                        ->latest('id'),
                ])
                ->orderBy('last_name')
                ->orderBy('first_name')
                ->get(),
            'courses' => Course::query()->with('department')->orderBy('code')->get(),
            'subjects' => Subject::query()->with('course')->orderBy('code')->get(),
        ]);
    }

    public function saveEnrollment(Request $request, Student $student): JsonResponse
    {
        $validated = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'academic_year' => ['required', 'string', 'max:20'],
            'semester' => ['required', Rule::in(['First Semester', 'Second Semester', 'Summer'])],
            'year_level' => ['required', 'integer', 'min:1', 'max:6'],
            'subject_ids' => ['required', 'array', 'min:1'],
            'subject_ids.*' => ['integer', 'exists:subjects,id'],
        ]);

        $course = Course::with('department')->findOrFail($validated['course_id']);

        $enrollment = DB::transaction(function () use ($validated, $student, $course): Enrollment {
            $enrollment = Enrollment::updateOrCreate(
                [
                    'student_id' => $student->id,
                    'academic_year' => $validated['academic_year'],
                    'semester' => $validated['semester'],
                ],
                [
                    'course_id' => $course->id,
                    'year_level' => $validated['year_level'],
                    'status' => 'enrolled',
                ]
            );

            $subjectIds = collect($validated['subject_ids'])->unique()->values();

            SubjectEnrollment::query()
                ->where('enrollment_id', $enrollment->id)
                ->whereNotIn('subject_id', $subjectIds)
                ->whereNull('grade')
                ->delete();

            foreach ($subjectIds as $subjectId) {
                SubjectEnrollment::firstOrCreate(
                    [
                        'enrollment_id' => $enrollment->id,
                        'subject_id' => $subjectId,
                    ],
                    [
                        'status' => 'enrolled',
                        'is_released' => false,
                    ]
                );
            }

            Clearance::updateOrCreate(
                [
                    'student_id' => $student->id,
                    'department_id' => $course->department_id,
                    'academic_year' => $validated['academic_year'],
                    'semester' => $validated['semester'],
                ],
                ['status' => 'pending']
            );

            return $enrollment;
        });

        AuditLog::create([
            'actor_user_id' => $request->user()->id,
            'target_user_id' => $student->user_id,
            'action' => 'enrollment_saved',
            'details' => "Saved {$validated['academic_year']} {$validated['semester']} enrollment for {$student->student_number}.",
            'ip_address' => $request->ip(),
        ]);

        PortalNotificationService::notifyUser(
            $student->user_id,
            'Enrollment updated',
            "Your {$validated['academic_year']} {$validated['semester']} enrollment is now available.",
            '/student/subjects',
            'academic'
        );

        return response()->json([
            'message' => 'Enrollment saved successfully.',
            'enrollment' => $enrollment->load(['course.department', 'subjectEnrollments.subject']),
        ]);
    }

    public function grades(): JsonResponse
    {
        return response()->json([
            'grade_records' => SubjectEnrollment::query()
                ->with(['subject', 'enrollment.course', 'enrollment.student.user:id,email'])
                ->whereHas('enrollment', fn ($query) => $query->where('status', 'enrolled'))
                ->orderByDesc('id')
                ->get(),
        ]);
    }

    public function updateGrade(Request $request, SubjectEnrollment $subjectEnrollment): JsonResponse
    {
        $validated = $request->validate([
            'grade' => ['nullable', 'numeric', 'min:1', 'max:5'],
            'is_released' => ['required', 'boolean'],
        ]);

        if ($validated['is_released'] && $validated['grade'] === null) {
            return response()->json([
                'message' => 'Enter a grade before releasing it to the student.',
            ], 422);
        }

        $wasReleased = $subjectEnrollment->is_released;

        $subjectEnrollment->update([
            'grade' => $validated['grade'],
            'is_released' => $validated['is_released'],
            'status' => $validated['grade'] === null ? 'enrolled' : 'completed',
        ]);

        $loaded = $subjectEnrollment->fresh()->load(['subject', 'enrollment.student']);
        $student = $loaded->enrollment->student;

        AuditLog::create([
            'actor_user_id' => $request->user()->id,
            'target_user_id' => $student->user_id,
            'action' => 'grade_updated',
            'details' => "Updated grade record #{$subjectEnrollment->id}.",
            'ip_address' => $request->ip(),
        ]);

        if (! $wasReleased && $validated['is_released']) {
            PortalNotificationService::notifyUser(
                $student->user_id,
                'Grade released',
                "Your {$loaded->subject->code} grade is now available.",
                '/student/grades',
                'academic'
            );
        }

        return response()->json([
            'message' => 'Grade updated successfully.',
            'grade_record' => $loaded,
        ]);
    }

    public function documentRequests(): JsonResponse
    {
        return response()->json([
            'requests' => DocumentRequest::query()
                ->with(['student.user:id,email', 'documentType', 'payment.receipt'])
                ->latest('id')
                ->get(),
        ]);
    }

    public function updateDocumentRequest(Request $request, DocumentRequest $documentRequest): JsonResponse
    {
        $validated = $request->validate([
            'action' => ['required', Rule::in(['approve', 'reject', 'mark_ready', 'release'])],
            'remarks' => ['nullable', 'string', 'max:1000'],
        ]);

        $action = $validated['action'];
        $remarks = $validated['remarks'] ?? null;

        DB::transaction(function () use ($documentRequest, $request, $action, $remarks): void {
            if ($action === 'approve') {
                if ($documentRequest->status !== 'pending') {
                    abort(422, 'Only pending requests can be approved.');
                }

                $documentRequest->reviewed_by = $request->user()->id;
                $documentRequest->registrar_notes = $remarks;

                if ((float) $documentRequest->fee_amount_snapshot > 0) {
                    $documentRequest->status = 'payment_pending';

                    Payment::updateOrCreate(
                        ['document_request_id' => $documentRequest->id],
                        [
                            'amount' => $documentRequest->fee_amount_snapshot,
                            'status' => 'pending',
                        ]
                    );
                } else {
                    $documentRequest->status = 'processing';
                }

                $documentRequest->save();

                return;
            }

            if ($action === 'reject') {
                if (! in_array($documentRequest->status, ['pending', 'payment_pending'], true)) {
                    abort(422, 'This request can no longer be rejected at this stage.');
                }

                $documentRequest->update([
                    'status' => 'rejected',
                    'reviewed_by' => $request->user()->id,
                    'registrar_notes' => $remarks,
                ]);

                $documentRequest->payment?->update(['status' => 'void']);

                return;
            }

            if ($action === 'mark_ready') {
                if ($documentRequest->status !== 'processing') {
                    abort(422, 'Only processing requests can be marked ready.');
                }

                $documentRequest->update([
                    'status' => 'ready',
                    'reviewed_by' => $request->user()->id,
                    'registrar_notes' => $remarks,
                ]);

                return;
            }

            if ($documentRequest->status !== 'ready') {
                abort(422, 'Only ready requests can be released.');
            }

            $documentRequest->update([
                'status' => 'released',
                'reviewed_by' => $request->user()->id,
                'registrar_notes' => $remarks,
                'released_at' => now(),
            ]);
        });

        $fresh = $documentRequest->fresh()->load(['student', 'documentType', 'payment.receipt']);

        $notification = match ($action) {
            'approve' => [
                'Request approved',
                (float) $fresh->fee_amount_snapshot > 0
                    ? "Your {$fresh->documentType->code} request was approved. Payment verification is required."
                    : "Your {$fresh->documentType->code} request was approved and is now processing.",
            ],
            'reject' => [
                'Request rejected',
                "Your {$fresh->documentType->code} request was rejected. ".($remarks ?: ''),
            ],
            'mark_ready' => [
                'Document ready',
                "Your {$fresh->documentType->code} request is ready for release.",
            ],
            'release' => [
                'Document released',
                "Your {$fresh->documentType->code} request has been released.",
            ],
        };

        PortalNotificationService::notifyUser(
            $fresh->student->user_id,
            $notification[0],
            trim($notification[1]),
            '/student/requests',
            'request'
        );

        AuditLog::create([
            'actor_user_id' => $request->user()->id,
            'target_user_id' => $fresh->student->user_id,
            'action' => 'document_request_updated',
            'details' => "Registrar action {$action} on request #{$fresh->id}.",
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Document request updated successfully.',
            'request' => $fresh->load(['student.user:id,email', 'documentType', 'payment.receipt']),
        ]);
    }
}
