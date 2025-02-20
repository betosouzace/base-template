<?php

use Illuminate\Support\Facades\Route;

// Carrega todas as rotas da pasta api
foreach (glob(__DIR__ . '/api/*.php') as $filename) {
    require $filename;
} 