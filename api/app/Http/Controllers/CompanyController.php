<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function update(Request $request, Company $company)
    {
        // Verifica se o usuário tem permissão para atualizar esta empresa
        if ($request->user()->company_id !== $company->id) {
            return response()->json([
                'message' => 'Você não tem permissão para atualizar esta empresa'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'document' => [
                'required',
                'string',
                'max:255',
                'unique:companies,document,' . $company->id
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                'unique:companies,email,' . $company->id
            ],
            'phone' => 'nullable|string|max:255',
        ]);

        $company->update($validated);

        return response()->json([
            'message' => 'Empresa atualizada com sucesso',
            'company' => $company
        ]);
    }

    public function getTheme(Request $request)
    {
        // Pega o domínio da requisição
        $host = $request->getHost();
        
        // Busca a empresa pelo domínio
        $company = Company::where('domain', $host)->first();
        
        // Tema padrão
        $defaultTheme = [
            'primaryColor' => '#4F46E5',
            'primaryColorHover' => '#4338CA',
            'primaryColorLight' => '#818CF8',
            'primaryColorDark' => '#3730A3',
        ];

        // Se não encontrar a empresa pelo domínio, tenta pegar a primeira empresa
        if (!$company) {
            $company = Company::first();
        }

        // Se ainda não tiver empresa, retorna o tema padrão
        if (!$company) {
            return response()->json([
                'theme' => $defaultTheme,
                'branding' => [
                    'logo' => null,
                    'icon' => null,
                    'favicon' => null,
                    'name' => env('APP_NAME', 'Sistema')
                ]
            ]);
        }

        // Função helper para gerar URL completa
        $getFullUrl = function($path) {
            if (!$path) return null;
            if (str_starts_with($path, 'http')) return $path;
            return asset('storage/' . $path);
        };

        return response()->json([
            'theme' => $company->settings['theme'] ?? $defaultTheme,
            'branding' => [
                'logo' => $getFullUrl($company->logo),
                'icon' => $getFullUrl($company->icon),
                'favicon' => $getFullUrl($company->favicon),
                'name' => $company->name
            ]
        ]);
    }
} 