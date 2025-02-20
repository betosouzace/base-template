<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    public function store(LoginRequest $request)
    {
        try {
            if (!Auth::guard('web')->attempt($request->only('email', 'password'))) {
                return response()->json(['error' => 'Credenciais inválidas'], 401);
            }
            
            $user = Auth::guard('web')->user();
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => $user->only(['id', 'name', 'email'])
            ]);
        } catch (\Exception $e) {
            \Log::error('Erro de autenticação:', [
                'message' => $e->getMessage(),
                'email' => $request->email
            ]);
            return response()->json(['error' => 'Credenciais inválidas'], 401);
        }
    }

    public function destroy(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout realizado com sucesso']);
    }
}
