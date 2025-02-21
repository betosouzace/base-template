<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Company;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    public function getUserSettings(Request $request)
    {
        try {
            $user = $request->user();
            $company = $user->company;
            
            // Função helper para gerar URL completa
            $getFullUrl = function($path) {
                if (!$path) return null;
                // Verifica se já é uma URL completa
                if (str_starts_with($path, 'http')) return $path;
                return url('storage/' . $path);
            };
            
            return response()->json([
                'user_settings' => $user->settings ?? [
                    'theme' => 'light',
                    'density' => 'normal',
                    'highContrast' => false,
                    'fontSize' => 'medium'
                ],
                'company_settings' => $company?->settings ?? [
                    'paymentMethods' => [],
                    'currency' => 'BRL',
                    'smtpServer' => '',
                    'senderEmail' => '',
                    'whatsappKey' => '',
                    'telegramToken' => '',
                    'theme' => [
                        'primaryColor' => '#4F46E5',
                        'primaryColorHover' => '#4338CA',
                        'primaryColorLight' => '#818CF8',
                        'primaryColorDark' => '#3730A3',
                    ]
                ],
                'company' => $company ? [
                    'name' => $company->name,
                    'document' => $company->document,
                    'email' => $company->email,
                    'phone' => $company->phone,
                    'logo' => $getFullUrl($company->logo),
                    'icon' => $getFullUrl($company->icon),
                    'favicon' => $getFullUrl($company->favicon),
                ] : null
            ]);
        } catch (\Exception $e) {
            \Log::error('Erro ao carregar configurações: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao carregar configurações',
                'error' => $e->getMessage()
            ], 500);
        }
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
            'settings' => 'required|json',
            'name' => 'required|string|max:255',
            'document' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'icon' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:1024',
            'favicon' => 'nullable|image|mimes:ico,png|max:100'
        ]);

        $user = $request->user();
        $company = $user->company;

        if (!$company) {
            return response()->json([
                'message' => 'Empresa não encontrada'
            ], 404);
        }

        // Decodifica as configurações do JSON
        $settings = json_decode($request->settings, true);

        // Processa e salva os arquivos
        $paths = [];
        foreach (['logo', 'icon', 'favicon'] as $type) {
            if ($request->hasFile($type)) {
                if ($company->$type) {
                    Storage::disk('public')->delete($company->$type);
                }
                $path = $request->file($type)->store('company/' . $company->id, 'public');
                $paths[$type] = $path;
            }
        }

        // Atualiza os dados da empresa
        $company->update([
            'name' => $request->name,
            'document' => $request->document,
            'email' => $request->email,
            'phone' => $request->phone,
            'settings' => $settings,
            ...$paths // Adiciona os caminhos dos arquivos se existirem
        ]);

        return response()->json([
            'message' => 'Configurações da empresa atualizadas com sucesso',
            'company' => [
                'name' => $company->name,
                'document' => $company->document,
                'email' => $company->email,
                'phone' => $company->phone,
                'settings' => $company->settings,
                'logo' => $company->logo,
                'icon' => $company->icon,
                'favicon' => $company->favicon
            ]
        ]);
    }

    public function updateBranding(Request $request)
    {
        $request->validate([
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',    // 10MB
            'icon' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',    // 10MB
            'favicon' => 'nullable|image|mimes:ico,png|max:10240'           // 10MB
        ]);

        $user = $request->user();
        $company = $user->company;

        if (!$company) {
            return response()->json([
                'message' => 'Usuário não está vinculado a uma empresa'
            ], 403);
        }

        $paths = [];

        if ($request->hasFile('logo')) {
            $paths['logo'] = $request->file('logo')->store('company/logos', 'public');
        }

        if ($request->hasFile('icon')) {
            $paths['icon'] = $request->file('icon')->store('company/icons', 'public');
        }

        if ($request->hasFile('favicon')) {
            $paths['favicon'] = $request->file('favicon')->store('company/favicons', 'public');
        }

        foreach ($paths as $key => $path) {
            $company->$key = $path;
        }

        $company->save();

        return response()->json([
            'message' => 'Imagens da empresa atualizadas com sucesso',
            ...$paths
        ]);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $company = $user->company;

        // Função helper para gerar URL completa
        $getFullUrl = function($path) {
            if (!$path) return null;
            // Verifica se já é uma URL completa
            if (str_starts_with($path, 'http')) return $path;
            return url('storage/' . $path);
        };

        return response()->json([
            'user_settings' => $user->settings,
            'company_settings' => $company ? $company->settings : null,
            'company' => $company ? [
                'name' => $company->name,
                'document' => $company->document,
                'email' => $company->email,
                'phone' => $company->phone,
                'logo' => $getFullUrl($company->logo),
                'icon' => $getFullUrl($company->icon),
                'favicon' => $getFullUrl($company->favicon),
            ] : null
        ]);
    }
} 