<?php

namespace App\Http\Controllers;

use App\Models\PortalNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PortalNotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = PortalNotification::query()
            ->where('user_id', $request->user()->id)
            ->latest('id');

        return response()->json([
            'unread_count' => (clone $query)->whereNull('read_at')->count(),
            'notifications' => $query->limit(20)->get(),
        ]);
    }

    public function markRead(Request $request, PortalNotification $portalNotification): JsonResponse
    {
        if ($portalNotification->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not authorized.'], 403);
        }

        $portalNotification->update([
            'read_at' => $portalNotification->read_at ?? now(),
        ]);

        return response()->json([
            'message' => 'Notification marked as read.',
        ]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        PortalNotification::query()
            ->where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'message' => 'All notifications marked as read.',
        ]);
    }
}
