<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::query()
            ->with('student')
            ->withCount('tokens')
            ->orderBy('role')
            ->orderBy('email')
            ->get(['id', 'email', 'role', 'status', 'created_at']);

        return response()->json([
            'users' => $users,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:100'],
            'role' => ['required', Rule::in(['student', 'registrar', 'cashier', 'department'])],
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended'])],
            'student_number' => ['nullable', 'required_if:role,student', 'string', 'max:50', 'unique:students,student_number'],
            'first_name' => ['nullable', 'required_if:role,student', 'string', 'max:100'],
            'last_name' => ['nullable', 'required_if:role,student', 'string', 'max:100'],
        ]);

        $temporaryPassword = $validated['password'];

        $user = DB::transaction(function () use ($validated): User {
            $user = User::create([
                'email' => $validated['email'],
                'password' => $validated['password'],
                'role' => $validated['role'],
                'status' => $validated['status'],
            ]);

            if ($validated['role'] === 'student') {
                Student::create([
                    'user_id' => $user->id,
                    'student_number' => $validated['student_number'],
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                ]);
            }

            return $user;
        });

        AuditLog::create([
            'actor_user_id' => $request->user()->id,
            'target_user_id' => $user->id,
            'action' => 'account_created',
            'details' => "Created {$user->role} account {$user->email}.",
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Account created successfully.',
            'temporary_password' => $temporaryPassword,
            'user' => $user->load('student'),
        ], 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['student', 'registrar', 'cashier', 'department', 'admin'])],
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended'])],
        ]);

        if ($user->id === $request->user()->id &&
            ($validated['role'] !== $user->role || $validated['status'] !== $user->status)) {
            return response()->json([
                'message' => 'You cannot change your own role or account status.',
            ], 422);
        }

        if ($validated['role'] === 'admin' && $user->role !== 'admin') {
            return response()->json([
                'message' => 'Admin accounts cannot be created by changing another user role.',
            ], 422);
        }

        if (($user->role === 'student') !== ($validated['role'] === 'student')) {
            return response()->json([
                'message' => 'Student accounts cannot be converted to staff accounts, or vice versa.',
            ], 422);
        }

        $oldRole = $user->role;
        $oldStatus = $user->status;

        $user->update($validated);

        if ($oldStatus === 'active' && $user->status !== 'active') {
            $user->tokens()->delete();
        }

        AuditLog::create([
            'actor_user_id' => $request->user()->id,
            'target_user_id' => $user->id,
            'action' => 'account_updated',
            'details' => "Role {$oldRole} -> {$user->role}; status {$oldStatus} -> {$user->status}.",
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Account updated successfully.',
            'user' => $user->load('student')->loadCount('tokens'),
        ]);
    }

    public function resetPassword(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'password' => ['nullable', 'string', 'min:8', 'max:100'],
        ]);

        $temporaryPassword = $validated['password'] ?? 'Temp'.random_int(100000, 999999).'!';

        $user->password = $temporaryPassword;
        $user->save();
        $user->tokens()->delete();

        AuditLog::create([
            'actor_user_id' => $request->user()->id,
            'target_user_id' => $user->id,
            'action' => 'password_reset',
            'details' => 'Admin reset the account password and revoked existing sessions.',
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Password reset successfully.',
            'temporary_password' => $temporaryPassword,
        ]);
    }

    public function revokeTokens(Request $request, User $user): JsonResponse
    {
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'Use the normal logout button for your own account.',
            ], 422);
        }

        $revoked = $user->tokens()->count();
        $user->tokens()->delete();

        AuditLog::create([
            'actor_user_id' => $request->user()->id,
            'target_user_id' => $user->id,
            'action' => 'sessions_revoked',
            'details' => "Revoked {$revoked} active token(s).",
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'User sessions revoked successfully.',
            'revoked' => $revoked,
        ]);
    }
}
