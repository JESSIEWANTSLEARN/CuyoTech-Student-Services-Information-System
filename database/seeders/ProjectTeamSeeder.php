<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProjectTeamMember;

class ProjectTeamSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            [
                'display_order' => 1,
                'name' => 'John Jessie R. Palarao',
                'scrum_role' => 'Product Owner / Team Leader',
                'deliverables' => 'Requirement gathering, backlog prioritization, Ethical Analysis, coordination of project requirements, and Final Review',
                'support_roles' => null,
            ],
            [
                'display_order' => 2,
                'name' => 'Laviña',
                'scrum_role' => 'Scrum Master',
                'deliverables' => 'SDLC Planning, Monitoring Sheet management, task coordination, project progress monitoring, and Presentation Lead',
                'support_roles' => null,
            ],
            [
                'display_order' => 3,
                'name' => 'Vecina',
                'scrum_role' => 'Developer / System Designer',
                'deliverables' => 'System Modeling (Use Case/Activity Diagram, DFD, Class Diagram); Database Design (3NF, ERD); Code Implementation',
                'support_roles' => 'Palarao, Villasanta, Aicee',
            ],
            [
                'display_order' => 4,
                'name' => 'Villasanta',
                'scrum_role' => 'Developer / UI/UX Designer',
                'deliverables' => 'UI/UX Wireframe creation, Student Module development, Admin Module development, interface consistency, and front-end implementation',
                'support_roles' => 'Palarao, Aicee',
            ],
            [
                'display_order' => 5,
                'name' => 'Zarate',
                'scrum_role' => 'QA / Software Tester',
                'deliverables' => 'Software Testing Plan execution, Security Testing, test documentation, Documentation Review, and Referencing',
                'support_roles' => 'Villasanta, Aicee, Vecina',
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