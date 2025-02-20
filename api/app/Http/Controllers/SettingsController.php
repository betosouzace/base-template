<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Company;

class SettingsController extends Controller
{
    public function getUserSettings(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'user_settings' => $user->settings ?? [
                'theme' => 'light',
                'density' => 'normal',
                'highContrast' => false,
                'fontSize' => 'medium'
            ],
            'company_settings' => $user->company?->settings ?? [
                'paymentMethods' => [],
                'currency' => 'BRL',
                'smtpServer' => '',
                'senderEmail' => '',
                'whatsappKey' => '',
                'telegramToken' => '',
            ]
        ]);
    }

    public function updateUserSettings(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
            'settings.theme' => 'required|string|in:light,semi-dark,dark',
            'settings.density' => 'required|string|in:compact,normal,comfortable',
            'settings.highContrast' => 'required|boolean',
            'settings.fontSize' => 'required|string|in:small,medium,large'
        ]);

        $user = $request->user();
        $user->settings = $request->settings;
        $user->save();

        return response()->json([
            'message' => 'Configurações do usuário atualizadas com sucesso',
            'settings' => $user->settings
        ]);
    }

    public function updateCompanySettings(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
            'settings.paymentMethods' => 'nullable|array',
            'settings.paymentMethods.*' => 'string',
            'settings.currency' => 'nullable|string|size:3',
            'settings.smtpServer' => 'nullable|string',
            'settings.senderEmail' => 'nullable|email',
            'settings.whatsappKey' => 'nullable|string',
            'settings.telegramToken' => 'nullable|string',
            'name' => 'sometimes|required|string|max:255',
            'document' => 'sometimes|required|string|max:20',
            'email' => 'sometimes|required|email|max:255',
            'phone' => 'sometimes|required|string|max:20'
        ]);

        $user = $request->user();
        $company = $user->company;

        if (!$company) {
            return response()->json([
                'message' => 'Usuário não está vinculado a uma empresa'
            ], 403);
        }

        // Atualiza configurações
        $company->settings = array_merge($company->settings ?? [], $request->settings);
        
        // Atualiza campos básicos se fornecidos
        if ($request->has('name')) $company->name = $request->name;
        if ($request->has('document')) $company->document = $request->document;
        if ($request->has('email')) $company->email = $request->email;
        if ($request->has('phone')) $company->phone = $request->phone;
        
        $company->save();

        return response()->json([
            'message' => 'Configurações da empresa atualizadas com sucesso',
            'company' => $company
        ]);
    }
} 