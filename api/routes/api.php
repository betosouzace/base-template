<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\CompanyController;

// Rotas públicas
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);

// Rotas autenticadas
Route::group(['middleware' => ['auth:sanctum']], function () {
    // Rota de usuário autenticado
    Route::get('/me', function (Request $request) {
        return $request->user();
    });

    // Rotas de configurações
    Route::controller(SettingsController::class)->group(function () {
        Route::get('/settings', 'getUserSettings');
        Route::put('/settings/user', 'updateUserSettings');
        Route::put('/settings/company', 'updateCompanySettings');
    });
    
    // Rotas de empresa
    Route::controller(CompanyController::class)->group(function () {
        Route::put('/companies/{company}', 'update');
    });
});
