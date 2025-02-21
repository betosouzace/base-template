<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;

// Carrega todas as rotas da pasta api
foreach (glob(__DIR__ . '/api/*.php') as $filename) {
    require $filename;
}
