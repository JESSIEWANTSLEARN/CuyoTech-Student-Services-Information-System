Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // ... your other admin routes are here ...

    // PASTE THESE HERE:
    Route::post('/project-team', [AdminProjectTeamController::class, 'store']);
    Route::put('/project-team/{projectTeamMember}', [AdminProjectTeamController::class, 'update']);
    Route::delete('/project-team/{projectTeamMember}', [AdminProjectTeamController::class, 'destroy']);
});


Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
    // ... your other student routes are here ...

    // PASTE THESE HERE:
    Route::get('/clearances', [StudentController::class, 'clearances']);
    Route::post('/payments', [StudentController::class, 'submitPayment']);
});