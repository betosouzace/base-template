<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WizardController;

Route::middleware('auth:sanctum')->group(function () {
    // Rotas do wizard
    Route::get('/wizard/status', [WizardController::class, 'checkWizardStatus']);
    Route::post('/wizard/step', [WizardController::class, 'saveWizardStep']);
    Route::post('/wizard/finish', [WizardController::class, 'finish']);
});
