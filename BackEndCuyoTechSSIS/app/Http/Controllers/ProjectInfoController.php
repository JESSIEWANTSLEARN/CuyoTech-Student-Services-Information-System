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
                    'has_photo' => filled($member->photo_data),
                    'updated_at' => $member->updated_at,
                ];
            });

        return response()->json([
            'group_name' => 'SixGrams',
            'project_name' => 'CuyoTech College of Science and Technology Student Services Information System',
            'members' => $members,
        ]);
    }

    public function photo(ProjectTeamMember $projectTeamMember): Response
    {
        $dataUrl = $projectTeamMember->photo_data;

        if (! $dataUrl) {
            abort(404);
        }

        if (! preg_match(
            '/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+\/=\r\n]+)$/',
            $dataUrl,
            $matches
        )) {
            abort(404);
        }

        $mime = $matches[1];
        $base64 = preg_replace('/\s+/', '', $matches[2]);
        $binary = base64_decode($base64, true);

        if ($binary === false) {
            abort(404);
        }

        return response($binary, 200, [
            'Content-Type' => $mime,
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }
}
