<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;

class AuditLogController extends Controller
{
    public function index(): JsonResponse
    {
        $logs = AuditLog::query()
            ->with([
                'actor:id,email',
                'target:id,email',
            ])
            ->latest()
            ->limit(100)
            ->get();

        return response()->json([
            'logs' => $logs,
        ]);
    }
}
