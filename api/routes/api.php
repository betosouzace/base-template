<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\CompanyController;

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (Request $request) {
        return $request->user();
    });
    Route::get('/settings', [SettingsController::class, 'getUserSettings']);
    Route::put('/settings/user', [SettingsController::class, 'updateUserSettings']);
    Route::put('/settings/company', [SettingsController::class, 'updateCompanySettings']);
    Route::put('/companies/{company}', [CompanyController::class, 'update']);
    // ... outras rotas autenticadas
});
