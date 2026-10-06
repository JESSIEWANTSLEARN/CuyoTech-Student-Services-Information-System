<?php

namespace App\Http\Controllers;

use App\Models\Clearance;
use App\Models\DocumentRequest;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\Student;
use App\Models\SubjectEnrollment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PortalSummaryController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        $metrics = match ($user->role) {
            'admin' => [
                ['label' => 'Total users', 'value' => User::count()],
                ['label' => 'Students', 'value' => User::where('role', 'student')->count()],
                ['label' => 'Pending requests', 'value' => DocumentRequest::where('status', 'pending')->count()],
                ['label' => 'Pending payments', 'value' => Payment::where('status', 'pending')->count()],
                ['label' => 'Pending clearances', 'value' => Clearance::where('status', 'pending')->count()],
            ],
            'registrar' => [
                ['label' => 'Active enrollments', 'value' => Enrollment::where('status', 'enrolled')->count()],
                ['label' => 'Pending requests', 'value' => DocumentRequest::where('status', 'pending')->count()],
                ['label' => 'Processing documents', 'value' => DocumentRequest::where('status', 'processing')->count()],
                ['label' => 'Unreleased grades', 'value' => SubjectEnrollment::whereNotNull('grade')->where('is_released', false)->count()],
            ],
            'cashier' => [
                ['label' => 'Pending payments', 'value' => Payment::where('status', 'pending')->count()],
                ['label' => 'Verified payments', 'value' => Payment::where('status', 'paid')->count()],
                ['label' => 'Payments today', 'value' => Payment::whereDate('verified_at', today())->count()],
            ],
            'department' => [
                ['label' => 'Pending clearance', 'value' => Clearance::where('status', 'pending')->count()],
                ['label' => 'Cleared', 'value' => Clearance::where('status', 'cleared')->count()],
                ['label' => 'On hold', 'value' => Clearance::where('status', 'hold')->count()],
            ],
            'student' => $this->studentMetrics($user->id),
            default => [],
        };

        return response()->json([
            'metrics' => $metrics,
        ]);
    }

    private function studentMetrics(int $userId): array
    {
        $student = Student::query()->where('user_id', $userId)->first();

        if (! $student) {
            return [];
        }

        $enrollment = Enrollment::query()
            ->where('student_id', $student->id)
            ->latest('id')
            ->first();

        return [
            [
                'label' => 'Current subjects',
                'value' => $enrollment
                    ? SubjectEnrollment::where('enrollment_id', $enrollment->id)->count()
                    : 0,
            ],
            [
                'label' => 'Released grades',
                'value' => $enrollment
                    ? SubjectEnrollment::where('enrollment_id', $enrollment->id)->where('is_released', true)->count()
                    : 0,
            ],
            [
                'label' => 'Active requests',
                'value' => DocumentRequest::where('student_id', $student->id)
                    ->whereNotIn('status', ['released', 'rejected', 'cancelled'])
                    ->count(),
            ],
            [
                'label' => 'Clearance pending',
                'value' => Clearance::where('student_id', $student->id)->where('status', 'pending')->count(),
            ],
        ];
    }
}
