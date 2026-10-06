<?php

use App\Http\Controllers\AdminContentController;
use App\Http\Controllers\AdminProjectTeamController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CashierController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\PortalContentController;
use App\Http\Controllers\PortalContextController;
use App\Http\Controllers\PortalNotificationController;
use App\Http\Controllers\PortalSummaryController;
use App\Http\Controllers\ProjectInfoController;
use App\Http\Controllers\RegistrarController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentDocumentRequestController;
use App\Http\Controllers\StudentProfileVerificationController;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'message' => 'CuyoTech SSIS API is working',
    ]);
});

Route::get('/project-info', [ProjectInfoController::class, 'index']);
Route::get('/project-team/{projectTeamMember}/photo', [ProjectInfoController::class, 'photo']);

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/portal/context', [PortalContextController::class, 'show']);
    Route::get('/portal/content', [PortalContentController::class, 'index']);
    Route::get('/portal/summary', [PortalSummaryController::class, 'show']);

    Route::get('/notifications', [PortalNotificationController::class, 'index']);
    Route::put('/notifications/read-all', [PortalNotificationController::class, 'markAllRead']);
    Route::put('/notifications/{portalNotification}/read', [PortalNotificationController::class, 'markRead']);

    Route::prefix('student')->middleware('role:student')->group(function () {
        Route::get('/profile-verification', [StudentProfileVerificationController::class, 'show']);
        Route::post('/profile-verification/confirm', [StudentProfileVerificationController::class, 'confirm']);

        Route::get('/profile', [StudentController::class, 'profile']);
        Route::get('/subjects', [StudentController::class, 'subjects']);
        Route::get('/grades', [StudentController::class, 'grades']);
        Route::get('/document-types', [StudentDocumentRequestController::class, 'documentTypes']);
        Route::get('/document-requests', [StudentDocumentRequestController::class, 'index']);
        Route::post('/document-requests', [StudentDocumentRequestController::class, 'store']);
    });

    Route::prefix('registrar')->middleware('role:registrar')->group(function () {
        Route::get('/students', [RegistrarController::class, 'students']);
        Route::post('/students/{student}/enrollment', [RegistrarController::class, 'saveEnrollment']);
        Route::get('/grades', [RegistrarController::class, 'grades']);
        Route::put('/grades/{subjectEnrollment}', [RegistrarController::class, 'updateGrade']);
        Route::get('/document-requests', [RegistrarController::class, 'documentRequests']);
        Route::put('/document-requests/{documentRequest}', [RegistrarController::class, 'updateDocumentRequest']);
    });

    Route::prefix('cashier')->middleware('role:cashier')->group(function () {
        Route::get('/payments', [CashierController::class, 'payments']);
        Route::put('/payments/{payment}/verify', [CashierController::class, 'verify']);
        Route::get('/receipts', [CashierController::class, 'receipts']);
    });

    Route::prefix('department')->middleware('role:department')->group(function () {
        Route::get('/clearances', [DepartmentController::class, 'clearances']);
        Route::put('/clearances/{clearance}', [DepartmentController::class, 'updateClearance']);
    });

    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::post('/users', [AdminUserController::class, 'store']);
        Route::put('/users/{user}', [AdminUserController::class, 'update']);
        Route::post('/users/{user}/reset-password', [AdminUserController::class, 'resetPassword']);
        Route::post('/users/{user}/revoke-tokens', [AdminUserController::class, 'revokeTokens']);
        Route::get('/audit-logs', [AuditLogController::class, 'index']);

        Route::get('/content', [AdminContentController::class, 'index']);
        Route::post('/announcements', [AdminContentController::class, 'storeAnnouncement']);
        Route::delete('/announcements/{announcement}', [AdminContentController::class, 'destroyAnnouncement']);
        Route::post('/important-dates', [AdminContentController::class, 'storeDate']);
        Route::delete('/important-dates/{importantDate}', [AdminContentController::class, 'destroyDate']);

        Route::post('/project-team/{projectTeamMember}/photo', [AdminProjectTeamController::class, 'updatePhoto']);
        Route::delete('/project-team/{projectTeamMember}/photo', [AdminProjectTeamController::class, 'removePhoto']);
    });
});
