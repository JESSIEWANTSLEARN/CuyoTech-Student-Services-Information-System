<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Payment;
use App\Models\Receipt;
use App\Services\PortalNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CashierController extends Controller
{
    public function payments(): JsonResponse
    {
        return response()->json([
            'payments' => Payment::query()
                ->with(['documentRequest.student.user:id,email', 'documentRequest.documentType', 'receipt'])
                ->latest('id')
                ->get(),
        ]);
    }

    public function verify(Request $request, Payment $payment): JsonResponse
    {
        if ($payment->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending payments can be verified.',
            ], 422);
        }

        $validated = $request->validate([
            'reference_number' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('payments', 'reference_number')->ignore($payment->id),
            ],
        ]);

        DB::transaction(function () use ($payment, $request, $validated): void {
            $reference = $validated['reference_number']
                ?: 'PAY-'.now()->format('YmdHis').'-'.$payment->id;

            $payment->update([
                'status' => 'paid',
                'reference_number' => $reference,
                'verified_by' => $request->user()->id,
                'verified_at' => now(),
            ]);

            $payment->documentRequest()->update(['status' => 'processing']);

            Receipt::firstOrCreate(
                ['payment_id' => $payment->id],
                [
                    'receipt_number' => 'OR-'.now()->format('Ymd').'-'.str_pad((string) $payment->id, 5, '0', STR_PAD_LEFT),
                    'issued_by' => $request->user()->id,
                    'issued_at' => now(),
                ]
            );
        });

        $documentRequest = $payment->documentRequest()->with(['student', 'documentType'])->firstOrFail();

        PortalNotificationService::notifyUser(
            $documentRequest->student->user_id,
            'Payment verified',
            "Payment for {$documentRequest->documentType->code} request #{$documentRequest->id} was verified.",
            '/student/requests',
            'payment'
        );

        PortalNotificationService::notifyRole(
            'registrar',
            'Payment verified',
            "{$documentRequest->student->student_number}'s {$documentRequest->documentType->code} request is ready for processing.",
            '/registrar/document-requests',
            'payment'
        );

        AuditLog::create([
            'actor_user_id' => $request->user()->id,
            'target_user_id' => $documentRequest->student->user_id,
            'action' => 'payment_verified',
            'details' => "Verified payment #{$payment->id} for document request #{$documentRequest->id}.",
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Payment verified and receipt issued.',
            'payment' => $payment->fresh()->load([
                'documentRequest.student.user:id,email',
                'documentRequest.documentType',
                'receipt',
            ]),
        ]);
    }

    public function receipts(): JsonResponse
    {
        return response()->json([
            'receipts' => Receipt::query()
                ->with(['payment.documentRequest.student.user:id,email', 'payment.documentRequest.documentType'])
                ->latest('id')
                ->get(),
        ]);
    }
}
