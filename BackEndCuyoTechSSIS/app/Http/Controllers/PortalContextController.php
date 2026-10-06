<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PortalContextController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        $context = [
            'role' => $user->role,
            'email' => $user->email,
            'display_name' => ucfirst($user->role),
            'secondary' => $user->email,
            'academic_year' => config('ssis.academic_year'),
            'semester' => config('ssis.semester'),
        ];

        if ($user->role === 'student') {
            $student = Student::query()
                ->with([
                    'enrollments' => fn ($query) => $query
                        ->with('course')
                        ->latest('id'),
                ])
                ->where('user_id', $user->id)
                ->first();

            if ($student) {
                $enrollment = $student->enrollments->first();

                $context['display_name'] = trim("{$student->first_name} {$student->last_name}");
                $context['secondary'] = $student->student_number;

                if ($enrollment) {
                    $context['academic_year'] = $enrollment->academic_year;
                    $context['semester'] = $enrollment->semester;
                    $context['course'] = $enrollment->course?->code;
                    $context['year_level'] = $enrollment->year_level;
                }
            }
        }

        return response()->json([
            'context' => $context,
        ]);
    }
}
