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
} 