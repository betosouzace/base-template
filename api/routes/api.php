<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WizardController;

// Carrega todas as rotas da pasta api
foreach (glob(__DIR__ . '/api/*.php') as $filename) {
    require $filename;
}

Route::middleware('auth:sanctum')->group(function () {
    // ... outras rotas ...
    
    Route::get('/wizard/status', [WizardController::class, 'checkWizardStatus']);
    Route::post('/wizard/step', [WizardController::class, 'saveWizardStep']);
}); 