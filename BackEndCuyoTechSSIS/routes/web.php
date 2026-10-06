<?php

use Illuminate\Support\Facades\Route;

Route::get('/{path?}', function () {
    $index = public_path('index.html');

    abort_unless(
        is_file($index),
        503,
        'The CuyoTech frontend build is not available.'
    );

    return response()->file($index);
})->where('path', '^(?!api(?:/|$)).*');