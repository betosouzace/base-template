<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WizardController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/wizard/status', [WizardController::class, 'checkWizardStatus']);
    Route::post('/wizard/step', [WizardController::class, 'saveWizardStep']);
});
