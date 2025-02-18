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
            'user_settings' => $user->settings,
            'company_settings' => $user->company?->settings
        ]);
    }

    public function updateUserSettings(Request $request)
    {
        $user = $request->user();
        $user->settings = array_merge($user->settings ?? [], $request->settings);
        $user->save();

        return response()->json(['message' => 'Configurações atualizadas com sucesso']);
    }

    public function updateCompanySettings(Request $request)
    {
        $user = $request->user();
        $company = $user->company;

        if (!$company) {
            return response()->json(['message' => 'Usuário não está vinculado a uma empresa'], 403);
        }

        $company->settings = array_merge($company->settings ?? [], $request->settings);
        $company->save();

        return response()->json(['message' => 'Configurações da empresa atualizadas com sucesso']);
    }
} 