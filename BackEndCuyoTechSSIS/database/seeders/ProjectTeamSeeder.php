<?php

namespace Database\Seeders;

use App\Models\ProjectTeamMember;
use Illuminate\Database\Seeder;

class ProjectTeamSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            [
                'display_order' => 1,
                'name' => 'Palarao',
                'scrum_role' => 'Product Owner / Team Leader',
                'deliverables' => 'Requirement gathering, backlog prioritization, Ethical Analysis, coordination of project requirements, and Final Review.',
                'support_roles' => null,
            ],
            [
                'display_order' => 2,
                'name' => 'Laviña',
                'scrum_role' => 'Scrum Master',
                'deliverables' => 'SDLC Planning, Monitoring Sheet management, task coordination, project progress monitoring, and Presentation Lead.',
                'support_roles' => null,
            ],
            [
                'display_order' => 3,
                'name' => 'Vecina',
                'scrum_role' => 'Developer / System Designer',
                'deliverables' => 'System Modeling including Use Case/Activity Diagram, DFD, and Class Diagram; Database Design including 3NF and ERD; and Code Implementation.',
                'support_roles' => 'Palarao, Villasanta, Aicee',
            ],
            [
                'display_order' => 4,
                'name' => 'Villasanta',
                'scrum_role' => 'Developer / UI/UX Designer',
                'deliverables' => 'UI/UX Wireframe creation, Student Module development, Admin Module development, interface consistency, and front-end implementation.',
                'support_roles' => 'Palarao, Aicee',
            ],
            [
                'display_order' => 5,
                'name' => 'Zarate',
                'scrum_role' => 'QA / Software Tester',
                'deliverables' => 'Software Testing Plan execution, Security Testing, test documentation, Documentation Review, and Referencing.',
                'support_roles' => 'Villasanta, Aicee, Vecina',
            ],
            [
                'display_order' => 6,
                'name' => 'Aicee',
                'scrum_role' => 'Support / Secondary Role',
                'deliverables' => 'Provides secondary support for system design and code implementation, UI/front-end work, software testing, bug checking, and documentation as assigned by the primary role owners.',
                'support_roles' => 'Supports Vecina (Role 3), Villasanta (Role 4), and Zarate (Role 5).',
            ],
        ];

        foreach ($members as $member) {
            ProjectTeamMember::updateOrCreate(
                ['name' => $member['name']],
                $member
            );
        }
    }
}
