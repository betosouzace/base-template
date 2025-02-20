<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\CompanyController;

// Rotas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('/settings')->group(function () {
        Route::get('[/]', [SettingsController::class, 'getUserSettings']);
        Route::put('/user', [SettingsController::class, 'updateUserSettings']);
        Route::put('/company', [SettingsController::class, 'updateCompanySettings']);
    });
});
