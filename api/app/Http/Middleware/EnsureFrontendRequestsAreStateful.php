<?php

namespace App\Http\Middleware;

use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful as BaseMiddleware;

class EnsureFrontendRequestsAreStateful extends BaseMiddleware
{
    // Herda toda a funcionalidade do middleware base do Sanctum
} 