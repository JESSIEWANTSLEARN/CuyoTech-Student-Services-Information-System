<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function profile(Request $request): JsonResponse
    {
        $student = $this->studentFor($request);

        $enrollment = Enrollment::query()
            ->with('course.department')
            ->where('student_id', $student->id)
            ->latest('id')
            ->first();

        return response()->json([
            'student' => $student->load('user'),
            'enrollment' => $enrollment,
        ]);
    }

    public function subjects(Request $request): JsonResponse
    {
        $student = $this->studentFor($request);

        $enrollment = Enrollment::query()
            ->with(['course', 'subjectEnrollments.subject'])
            ->where('student_id', $student->id)
            ->latest('id')
            ->first();

        return response()->json([
            'enrollment' => $enrollment,
            'subjects' => $enrollment?->subjectEnrollments ?? [],
        ]);
    }

    public function grades(Request $request): JsonResponse
    {
        $student = $this->studentFor($request);

        $enrollment = Enrollment::query()
            ->with([
                'course',
                'subjectEnrollments' => fn ($query) => $query
                    ->where('is_released', true)
                    ->with('subject'),
            ])
            ->where('student_id', $student->id)
            ->latest('id')
            ->first();

        return response()->json([
            'enrollment' => $enrollment,
            'grades' => $enrollment?->subjectEnrollments ?? [],
        ]);
    }

    private function studentFor(Request $request): Student
    {
        return Student::query()
            ->where('user_id', $request->user()->id)
            ->firstOrFail();
    }
}
