<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\ProjectTeamMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminProjectTeamController extends Controller
{
    public function update(
        Request $request,
        ProjectTeamMember $projectTeamMember
    ): JsonResponse {
        $validated = $request->validate([
            'display_order' => ['required', 'integer', 'min:1', 'max:99'],
            'name' => ['required', 'string', 'max:150'],
            'scrum_role' => ['nullable', 'string', 'max:100'],
            'deliverables' => ['nullable', 'string', 'max:4000'],
            'support_roles' => ['nullable', 'string', 'max:2000'],
        ]);

        $projectTeamMember->update($validated);

        AuditLog::create([
            'actor_user_id' => $request->user()->id,
            'target_user_id' => $request->user()->id,
            'action' => 'project_team_member_updated',
            'details' => "Updated project team details for {$projectTeamMember->name}.",
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => "Updated {$projectTeamMember->name}.",
            'member' => $projectTeamMember->fresh(),
        ]);
    }

    public function updatePhoto(
        Request $request,
        ProjectTeamMember $projectTeamMember
    ): JsonResponse {
        $validated = $request->validate([
            'image_data_url' => ['required', 'string'],
        ]);

        $dataUrl = $validated['image_data_url'];

        if (! preg_match(
            '/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+\/=\r\n]+)$/',
            $dataUrl,
            $matches
        )) {
            return response()->json([
                'message' => 'Use a JPG, PNG, or WEBP image.',
            ], 422);
        }

        $base64 = preg_replace('/\s+/', '', $matches[2]);
        $binary = base64_decode($base64, true);

        if ($binary === false) {
            return response()->json([
                'message' => 'The uploaded image could not be read.',
            ], 422);
        }

        if (strlen($binary) > 1_500_000) {
            return response()->json([
                'message' => 'Image must be 1.5 MB or smaller.',
            ], 422);
        }

        $projectTeamMember->update([
            'photo_data' => $dataUrl,
        ]);

        AuditLog::create([
            'actor_user_id' => $request->user()->id,
            'target_user_id' => $request->user()->id,
            'action' => 'project_team_photo_updated',
            'details' => "Updated project photo for {$projectTeamMember->name}.",
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => "Photo updated for {$projectTeamMember->name}.",
        ]);
    }

    public function removePhoto(
        Request $request,
        ProjectTeamMember $projectTeamMember
    ): JsonResponse {
        $projectTeamMember->update([
            'photo_data' => null,
        ]);

        AuditLog::create([
            'actor_user_id' => $request->user()->id,
            'target_user_id' => $request->user()->id,
            'action' => 'project_team_photo_removed',
            'details' => "Removed project photo for {$projectTeamMember->name}.",
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => "Photo removed for {$projectTeamMember->name}.",
        ]);
    }
}
