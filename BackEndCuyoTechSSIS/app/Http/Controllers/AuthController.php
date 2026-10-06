<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            AuditLog::create([
                'actor_user_id' => null,
                'target_user_id' => $user?->id,
                'action' => 'login_failed',
                'details' => 'Invalid email or password.',
                'ip_address' => $request->ip(),
            ]);

            return response()->json([
                'message' => 'Invalid email or password.',
            ], 401);
        }

        if ($user->status !== 'active') {
            AuditLog::create([
                'actor_user_id' => $user->id,
                'target_user_id' => $user->id,
                'action' => 'login_blocked',
                'details' => 'Login blocked because the account is not active.',
                'ip_address' => $request->ip(),
            ]);

            return response()->json([
                'message' => 'This account is not active.',
            ], 403);
        }

        $token = $user->createToken('web-login')->plainTextToken;

        AuditLog::create([
            'actor_user_id' => $user->id,
            'target_user_id' => $user->id,
            'action' => 'login_success',
            'details' => 'User signed in successfully.',
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Login successful.',
            'token' => $token,
            'user' => $user->only(['id', 'email', 'role', 'status']),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()->only(['id', 'email', 'role', 'status']),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        $user->currentAccessToken()?->delete();

        AuditLog::create([
            'actor_user_id' => $user->id,
            'target_user_id' => $user->id,
            'action' => 'logout',
            'details' => 'User signed out.',
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}
