<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SettingsController;

// Rotas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/settings/user', [SettingsController::class, 'getUserSettings']);
    Route::put('/settings/user', [SettingsController::class, 'updateUserSettings']);
    Route::put('/settings/company', [SettingsController::class, 'updateCompanySettings']);
    Route::post('/settings/company/branding', [SettingsController::class, 'updateBranding']);
});
