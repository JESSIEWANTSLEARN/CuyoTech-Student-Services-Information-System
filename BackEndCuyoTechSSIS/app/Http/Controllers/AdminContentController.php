<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\AuditLog;
use App\Models\ImportantDate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminContentController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'announcements' => Announcement::query()->latest('id')->get(),
            'important_dates' => ImportantDate::query()->orderBy('event_date')->get(),
        ]);
    }

    public function storeAnnouncement(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:180'],
            'body' => ['required', 'string', 'max:3000'],
            'audience' => ['required', Rule::in($this->audiences())],
            'priority' => ['required', Rule::in(['normal', 'important'])],
            'expires_at' => ['nullable', 'date'],
        ]);

        $announcement = Announcement::create([
            ...$validated,
            'published_at' => now(),
            'created_by' => $request->user()->id,
        ]);

        $this->audit($request, 'announcement_created', "Created announcement {$announcement->title}.");

        return response()->json([
            'message' => 'Announcement published.',
            'announcement' => $announcement,
        ], 201);
    }

    public function destroyAnnouncement(Request $request, Announcement $announcement): JsonResponse
    {
        $title = $announcement->title;
        $announcement->delete();

        $this->audit($request, 'announcement_deleted', "Deleted announcement {$title}.");

        return response()->json(['message' => 'Announcement deleted.']);
    }

    public function storeDate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:180'],
            'description' => ['nullable', 'string', 'max:500'],
            'event_date' => ['required', 'date'],
            'audience' => ['required', Rule::in($this->audiences())],
        ]);

        $date = ImportantDate::create([
            ...$validated,
            'created_by' => $request->user()->id,
        ]);

        $this->audit($request, 'important_date_created', "Created important date {$date->title}.");

        return response()->json([
            'message' => 'Important date added.',
            'important_date' => $date,
        ], 201);
    }

    public function destroyDate(Request $request, ImportantDate $importantDate): JsonResponse
    {
        $title = $importantDate->title;
        $importantDate->delete();

        $this->audit($request, 'important_date_deleted', "Deleted important date {$title}.");

        return response()->json(['message' => 'Important date deleted.']);
    }

    private function audiences(): array
    {
        return ['all', 'student', 'registrar', 'cashier', 'department', 'admin'];
    }

    private function audit(Request $request, string $action, string $details): void
    {
        AuditLog::create([
            'actor_user_id' => $request->user()->id,
            'target_user_id' => $request->user()->id,
            'action' => $action,
            'details' => $details,
            'ip_address' => $request->ip(),
        ]);
    }
}
