<?php

namespace Database\Seeders;

use App\Models\Clearance;
use App\Models\Course;
use App\Models\Department;
use App\Models\Enrollment;
use App\Models\Student;
use App\Models\Subject;
use App\Models\SubjectEnrollment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@cuyotech.com'],
            ['password' => 'Admin123', 'role' => 'admin', 'status' => 'active']
        );

        $studentUser = User::updateOrCreate(
            ['email' => 'student@cuyotech.com'],
            ['password' => 'Student123', 'role' => 'student', 'status' => 'active']
        );

        User::updateOrCreate(
            ['email' => 'registrar@cuyotech.com'],
            ['password' => 'Registrar123', 'role' => 'registrar', 'status' => 'active']
        );

        User::updateOrCreate(
            ['email' => 'cashier@cuyotech.com'],
            ['password' => 'Cashier123', 'role' => 'cashier', 'status' => 'active']
        );

        User::updateOrCreate(
            ['email' => 'department@cuyotech.com'],
            ['password' => 'Department123', 'role' => 'department', 'status' => 'active']
        );

        $student = Student::updateOrCreate(
            ['user_id' => $studentUser->id],
            [
                'student_number' => '2026-00001',
                'first_name' => 'Demo',
                'last_name' => 'Student',
            ]
        );

        $department = Department::updateOrCreate(
            ['code' => 'CCS'],
            ['name' => 'College of Computing Studies']
        );

        $course = Course::updateOrCreate(
            ['code' => 'BSCS'],
            [
                'department_id' => $department->id,
                'name' => 'Bachelor of Science in Computer Science',
            ]
        );

        $subjectData = [
            ['code' => 'CCS112', 'name' => 'Application Development and Emerging Technologies', 'units' => 3],
            ['code' => 'CSP105', 'name' => 'Algorithms and Complexity', 'units' => 3],
            ['code' => 'CSP108', 'name' => 'Programming Languages', 'units' => 3],
        ];

        $subjects = collect();

        foreach ($subjectData as $item) {
            $subjects->push(Subject::updateOrCreate(
                ['code' => $item['code']],
                [
                    'course_id' => $course->id,
                    'name' => $item['name'],
                    'units' => $item['units'],
                ]
            ));
        }

        $enrollment = Enrollment::updateOrCreate(
            [
                'student_id' => $student->id,
                'academic_year' => '2026-2027',
                'semester' => 'First Semester',
            ],
            [
                'course_id' => $course->id,
                'year_level' => 3,
                'status' => 'enrolled',
            ]
        );

        foreach ($subjects as $index => $subject) {
            SubjectEnrollment::updateOrCreate(
                [
                    'enrollment_id' => $enrollment->id,
                    'subject_id' => $subject->id,
                ],
                [
                    'grade' => $index < 2 ? (1.50 + ($index * 0.25)) : null,
                    'is_released' => $index < 2,
                    'status' => $index < 2 ? 'completed' : 'enrolled',
                ]
            );
        }

        Clearance::updateOrCreate(
            [
                'student_id' => $student->id,
                'department_id' => $department->id,
                'academic_year' => '2026-2027',
                'semester' => 'First Semester',
            ],
            [
                'status' => 'pending',
                'remarks' => null,
            ]
        );

        $documentTypes = [
            ['code' => 'TOR', 'name' => 'Transcript of Records', 'fee_amount' => 150],
            ['code' => 'COR', 'name' => 'Certificate of Registration', 'fee_amount' => 50],
            ['code' => 'CERT', 'name' => 'Certification', 'fee_amount' => 100],
        ];

        foreach ($documentTypes as $type) {
            DB::table('document_types')->updateOrInsert(
                ['code' => $type['code']],
                [
                    'name' => $type['name'],
                    'fee_amount' => $type['fee_amount'],
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        $this->command?->info('Demo accounts are ready.');
        $this->command?->info('Admin: admin@cuyotech.com / Admin123');
        $this->command?->info('Student: student@cuyotech.com / Student123');
        $this->command?->info('Registrar: registrar@cuyotech.com / Registrar123');
        $this->command?->info('Cashier: cashier@cuyotech.com / Cashier123');
        $this->command?->info('Department: department@cuyotech.com / Department123');
    }
}
