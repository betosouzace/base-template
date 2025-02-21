<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\DB;

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

    public function complete(Request $request)
    {
        $user = $request->user();
        
        // Atualiza o status de primeiro acesso
        $user->first_access = false;
        $user->save();

        return response()->json([
            'message' => 'Configuração inicial concluída com sucesso',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'first_access' => false,
                'company_id' => $user->company_id
            ]
        ]);
    }

    public function finish(Request $request)
    {
        try {
            DB::beginTransaction();

            $user = $request->user();
            
            // Valida os dados da empresa
            $data = $request->validate([
                'company' => 'required|array',
                'company.name' => 'required|string|max:255',
                'company.document' => 'required|string|max:255',
                'company.email' => 'required|email|max:255',
                'company.phone' => 'nullable|string|max:255',
                'company.settings' => 'required|array',
                'user' => 'required|array',
                'user.settings' => 'required|array'
            ]);

            // Verifica se já existe uma empresa com este e-mail
            $company = Company::where('email', $data['company']['email'])->first();

            if ($company) {
                // Atualiza a empresa existente
                $company->update([
                    'name' => $data['company']['name'],
                    'document' => $data['company']['document'],
                    'phone' => $data['company']['phone'] ?? null,
                    'settings' => array_merge($company->settings ?? [], $data['company']['settings'])
                ]);
            } else {
                // Cria uma nova empresa
                $company = Company::create([
                    'name' => $data['company']['name'],
                    'document' => $data['company']['document'],
                    'email' => $data['company']['email'],
                    'phone' => $data['company']['phone'] ?? null,
                    'settings' => $data['company']['settings']
                ]);
            }

            // Atualiza o usuário
            $user->company_id = $company->id;
            $user->settings = $data['user']['settings'];
            $user->wizard_completed = true;
            $user->wizard_step = null;
            $user->first_access = false;
            $user->save();

            DB::commit();

            // Retorna os dados atualizados
            return response()->json([
                'message' => 'Wizard concluído com sucesso',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'first_access' => false,
                    'company_id' => $company->id,
                    'settings' => $user->settings,
                    'company' => [
                        'id' => $company->id,
                        'name' => $company->name,
                        'document' => $company->document,
                        'email' => $company->email,
                        'phone' => $company->phone,
                        'settings' => $company->settings
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erro ao finalizar wizard: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao finalizar wizard',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
