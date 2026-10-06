<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Clearance;
use App\Services\PortalNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DepartmentController extends Controller
{
    public function clearances(): JsonResponse
    {
        return response()->json([
            'clearances' => Clearance::query()
                ->with(['student.user:id,email', 'department'])
                ->latest('id')
                ->get(),
        ]);
    }

    public function updateClearance(Request $request, Clearance $clearance): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'cleared', 'hold'])],
            'remarks' => ['nullable', 'string', 'max:1000'],
        ]);

        $clearance->update([
            'status' => $validated['status'],
            'remarks' => $validated['remarks'] ?? null,
            'processed_by' => $request->user()->id,
            'processed_at' => $validated['status'] === 'pending' ? null : now(),
        ]);

        PortalNotificationService::notifyUser(
            $clearance->student->user_id,
            'Clearance updated',
            "Your {$clearance->department->code} clearance status is now {$clearance->status}.",
            '/student/dashboard',
            'clearance'
        );

        AuditLog::create([
            'actor_user_id' => $request->user()->id,
            'target_user_id' => $clearance->student->user_id,
            'action' => 'clearance_updated',
            'details' => "Updated clearance #{$clearance->id} to {$clearance->status}.",
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Clearance updated successfully.',
            'clearance' => $clearance->fresh()->load(['student.user:id,email', 'department']),
        ]);
    }
}
