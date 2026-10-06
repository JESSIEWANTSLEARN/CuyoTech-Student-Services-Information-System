<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\DocumentRequest;
use App\Models\DocumentType;
use App\Models\Student;
use App\Services\PortalNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentDocumentRequestController extends Controller
{
    public function documentTypes(): JsonResponse
    {
        return response()->json([
            'document_types' => DocumentType::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $student = $this->studentFor($request);

        return response()->json([
            'requests' => DocumentRequest::query()
                ->with(['documentType', 'payment.receipt'])
                ->where('student_id', $student->id)
                ->latest('id')
                ->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $student = $this->studentFor($request);

        $validated = $request->validate([
            'document_type_id' => [
                'required',
                Rule::exists('document_types', 'id')->where('is_active', true),
            ],
            'purpose' => ['required', 'string', 'max:1000'],
        ]);

        $documentType = DocumentType::findOrFail($validated['document_type_id']);

        $documentRequest = DocumentRequest::create([
            'student_id' => $student->id,
            'document_type_id' => $documentType->id,
            'purpose' => $validated['purpose'],
            'status' => 'pending',
            'fee_amount_snapshot' => $documentType->fee_amount,
            'submitted_at' => now(),
        ]);

        AuditLog::create([
            'actor_user_id' => $request->user()->id,
            'target_user_id' => $request->user()->id,
            'action' => 'document_request_submitted',
            'details' => "Submitted {$documentType->code} request #{$documentRequest->id}.",
            'ip_address' => $request->ip(),
        ]);

        PortalNotificationService::notifyRole(
            'registrar',
            'New document request',
            "{$student->student_number} submitted {$documentType->code} request #{$documentRequest->id}.",
            '/registrar/document-requests',
            'request'
        );

        return response()->json([
            'message' => 'Document request submitted successfully.',
            'request' => $documentRequest->load('documentType'),
        ], 201);
    }

    private function studentFor(Request $request): Student
    {
        return Student::query()
            ->where('user_id', $request->user()->id)
            ->firstOrFail();
    }
}
