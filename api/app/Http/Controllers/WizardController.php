<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Company;
use App\Models\User;

class WizardController extends Controller
{
    public function checkWizardStatus(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'needs_wizard' => !$user->company_id,
            'current_step' => $user->wizard_step ?? 1,
            'total_steps' => 4
        ]);
    }

    public function saveWizardStep(Request $request)
    {
        $user = $request->user();
        $step = $request->step;

        switch ($step) {
            case 1: // Informações básicas da empresa
                $request->validate([
                    'name' => 'required|string|max:255',
                    'document' => 'required|string|max:20',
                    'email' => 'required|email|max:255',
                    'phone' => 'required|string|max:20'
                ]);

                $company = Company::create([
                    'name' => $request->name,
                    'document' => $request->document,
                    'email' => $request->email,
                    'phone' => $request->phone
                ]);

                $user->company_id = $company->id;
                $user->wizard_step = 2;
                $user->save();

                break;

            case 2: // Métodos de pagamento
                $request->validate([
                    'paymentMethods' => 'required|array',
                    'currency' => 'required|string|size:3'
                ]);

                $company = $user->company;
                $company->settings = array_merge($company->settings ?? [], [
                    'paymentMethods' => $request->paymentMethods,
                    'currency' => $request->currency
                ]);
                $company->save();

                $user->wizard_step = 3;
                $user->save();

                break;

            case 3: // Configurações de comunicação
                $request->validate([
                    'smtpServer' => 'nullable|string',
                    'senderEmail' => 'nullable|email',
                    'whatsappKey' => 'nullable|string',
                    'telegramToken' => 'nullable|string'
                ]);

                $company = $user->company;
                $company->settings = array_merge($company->settings ?? [], [
                    'smtpServer' => $request->smtpServer,
                    'senderEmail' => $request->senderEmail,
                    'whatsappKey' => $request->whatsappKey,
                    'telegramToken' => $request->telegramToken
                ]);
                $company->save();

                $user->wizard_step = 4;
                $user->save();

                break;

            case 4: // Preferências de interface
                $request->validate([
                    'theme' => 'required|string|in:light,semi-dark,dark',
                    'density' => 'required|string|in:compact,normal,comfortable',
                    'fontSize' => 'required|string|in:small,medium,large'
                ]);

                $user->settings = [
                    'theme' => $request->theme,
                    'density' => $request->density,
                    'fontSize' => $request->fontSize,
                    'highContrast' => $request->highContrast ?? false
                ];
                $user->wizard_completed = true;
                $user->wizard_step = null;
                $user->save();

                break;
        }

        return response()->json([
            'message' => 'Etapa salva com sucesso',
            'current_step' => $user->wizard_step
        ]);
    }
} 