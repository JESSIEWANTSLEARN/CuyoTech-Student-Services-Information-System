<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\ImportantDate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PortalContentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $role = $request->user()->role;

        $announcements = Announcement::query()
            ->whereIn('audience', ['all', $role])
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->where(function ($query): void {
                $query->whereNull('expires_at')->orWhere('expires_at', '>=', now());
            })
            ->orderByRaw("priority = 'important' DESC")
            ->orderByDesc('published_at')
            ->limit(8)
            ->get();

        $dates = ImportantDate::query()
            ->whereIn('audience', ['all', $role])
            ->whereDate('event_date', '>=', today())
            ->orderBy('event_date')
            ->limit(8)
            ->get();

        return response()->json([
            'announcements' => $announcements,
            'important_dates' => $dates,
        ]);
    }
}
