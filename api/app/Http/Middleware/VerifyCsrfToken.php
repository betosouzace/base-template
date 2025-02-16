<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    protected $except = [
        // Temporariamente, para debug
        'sanctum/csrf-cookie',
        'login',
        'register'
    ];

    protected function getTokenFromRequest($request)
    {
        // Tenta obter o token do header X-XSRF-TOKEN
        $token = $request->header('X-XSRF-TOKEN');
        
        // Se não encontrar no header, tenta do cookie
        if (!$token && $request->hasCookie('XSRF-TOKEN')) {
            $token = $request->cookie('XSRF-TOKEN');
        }
        
        // Se ainda não encontrou, tenta outros headers comuns
        if (!$token) {
            $token = $request->header('X-CSRF-TOKEN');
        }

        return $token ? urldecode($token) : null;
    }
} 