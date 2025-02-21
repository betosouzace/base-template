<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;

// Rotas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::put('/company/{company}', [CompanyController::class, 'update']);
    Route::get('/company/theme', [CompanyController::class, 'getTheme']);
});
