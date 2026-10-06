<?php

namespace App\Http\Controllers;

use App\Models\ProjectTeamMember;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ProjectInfoController extends Controller
{
    public function index(): JsonResponse
    {
        $members = ProjectTeamMember::query()
            ->orderBy('display_order')
            ->get()
            ->map(function (ProjectTeamMember $member): array {
                return [
                    'id' => $member->id,
                    'display_order' => $member->display_order,
                    'name' => $member->name,
                    'scrum_role' => $member->scrum_role,
                    'deliverables' => $member->deliverables,
                    'support_roles' => $member->support_roles,
                    'has_photo' => filled($member->photo_data) && filled($member->photo_mime),
                    'updated_at' => $member->updated_at,
                ];
            });

        return response()->json([
            'group_name' => 'SixGrams',
            'project_name' => 'CuyoTech University Student Services Information System',
            'members' => $members,
        ]);
    }

    public function photo(ProjectTeamMember $projectTeamMember): Response
    {
        if (! $projectTeamMember->photo_data || ! $projectTeamMember->photo_mime) {
            abort(404);
        }

        $binary = base64_decode($projectTeamMember->photo_data, true);

        if ($binary === false) {
            abort(404);
        }

        return response($binary, 200, [
            'Content-Type' => $projectTeamMember->photo_mime,
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }
}
