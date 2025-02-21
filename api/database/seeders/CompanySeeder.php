<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;

class CompanySeeder extends Seeder
{
    public function run()
    {
        Company::create([
            'name' => 'Empresa Teste',
            'domain' => 'localhost',
            'settings' => [
                'theme' => [
                    'primaryColor' => '#4F46E5',
                    'primaryColorHover' => '#4338CA',
                    'primaryColorLight' => '#818CF8',
                    'primaryColorDark' => '#3730A3'
                ]
            ],
            'logo' => 'company/logos/default-logo.png',
            'icon' => 'company/icons/default-icon.png',
            'favicon' => 'company/favicons/default-favicon.ico'
        ]);
    }
} 