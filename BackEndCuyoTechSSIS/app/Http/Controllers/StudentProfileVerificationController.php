<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentProfileVerificationController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $student = Student::query()
            ->with([
                'user:id,email',
                'enrollments' => fn ($query) => $query
                    ->with('course.department')
                    ->latest('id'),
            ])
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $enrollment = $student->enrollments->first();

        return response()->json([
            'verified' => $student->profile_verified_at !== null,
            'verified_at' => $student->profile_verified_at,
            'student' => [
                'student_number' => $student->student_number,
                'first_name' => $student->first_name,
                'last_name' => $student->last_name,
                'email' => $student->user?->email,
                'course_code' => $enrollment?->course?->code,
                'course_name' => $enrollment?->course?->name,
                'department' => $enrollment?->course?->department?->name,
                'year_level' => $enrollment?->year_level,
                'academic_year' => $enrollment?->academic_year,
                'semester' => $enrollment?->semester,
            ],
        ]);
    }

    public function confirm(Request $request): JsonResponse
    {
        $student = Student::query()
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($student->profile_verified_at === null) {
            $student->forceFill([
                'profile_verified_at' => now(),
            ])->save();

            AuditLog::create([
                'actor_user_id' => $request->user()->id,
                'target_user_id' => $request->user()->id,
                'action' => 'profile_verified',
                'details' => "Student {$student->student_number} confirmed profile information.",
                'ip_address' => $request->ip(),
            ]);
        }

        return response()->json([
            'message' => 'Profile information confirmed successfully.',
            'verified_at' => $student->fresh()->profile_verified_at,
        ]);
    }
}
