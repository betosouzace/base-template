<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;

// Rotas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('/company')->group(function () {
        Route::put('/{company}', [CompanyController::class, 'update']);
    });
});
