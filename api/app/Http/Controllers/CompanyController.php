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
        
        // Debug para verificar o host recebido
        \Log::info('Host da requisição:', ['host' => $host]);
        
        // Busca a empresa pelo domínio
        $company = Company::where('domain', $host)->first();
        
        // Debug para verificar a empresa encontrada
        \Log::info('Empresa encontrada:', ['company' => $company]);

        // Tema padrão
        $defaultTheme = [
            'primaryColor' => '#4F46E5',
            'primaryColorHover' => '#4338CA',
            'primaryColorLight' => '#818CF8',
            'primaryColorDark' => '#3730A3',
        ];

        // Se não encontrar a empresa, tenta pegar a primeira empresa do banco
        if (!$company) {
            $company = Company::first();
            \Log::info('Usando primeira empresa:', ['company' => $company]);
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

        return response()->json([
            'theme' => $company->settings['theme'] ?? $defaultTheme,
            'branding' => [
                'logo' => $company->logo,
                'icon' => $company->icon,
                'favicon' => $company->favicon,
                'name' => $company->name
            ]
        ]);
    }
} 