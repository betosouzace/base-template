<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\CompanyController;

// Rotas públicas
Route::post('register', [RegisteredUserController::class, 'store']);
Route::post('login', [AuthenticatedSessionController::class, 'store']);

// Rotas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (Request $request) {
        return $request->user();
    });

    // Rotas de configurações
    Route::prefix('/settings')->group(function () {
        Route::get('/', [SettingsController::class, 'getUserSettings']);
        Route::put('/user', [SettingsController::class, 'updateUserSettings']);
        Route::put('/company', [SettingsController::class, 'updateCompanySettings']);
    });

    // Rotas de empresa
    Route::put('companies/{company}', [CompanyController::class, 'update']);
});
