<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\WizardController;

// Rota pública para o tema
Route::get('/company/theme', [CompanyController::class, 'getTheme']);

// Rotas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::put('/company/{company}', [CompanyController::class, 'update']);
});
