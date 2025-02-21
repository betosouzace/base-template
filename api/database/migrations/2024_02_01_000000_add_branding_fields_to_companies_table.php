<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::table('companies', function (Blueprint $table) {
            // Adiciona campos para armazenar os caminhos das imagens
            $table->string('logo')->nullable()->after('phone');
            $table->string('icon')->nullable()->after('logo');
            $table->string('favicon')->nullable()->after('icon');

            // Garante que o campo settings existe como JSON
            if (!Schema::hasColumn('companies', 'settings')) {
                $table->json('settings')->nullable();
            }
        });

        // Atualiza as configurações existentes para incluir o tema padrão
        DB::table('companies')->whereNotNull('id')->update([
            'settings' => DB::raw("JSON_MERGE_PATCH(
                COALESCE(settings, '{}'),
                '{
                    \"theme\": {
                        \"primaryColor\": \"#4F46E5\",
                        \"primaryColorHover\": \"#4338CA\",
                        \"primaryColorLight\": \"#818CF8\",
                        \"primaryColorDark\": \"#3730A3\"
                    }
                }'
            )")
        ]);
    }

    public function down()
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['logo', 'icon', 'favicon']);

            // Remove o tema das configurações existentes
            DB::table('companies')->whereNotNull('id')->update([
                'settings' => DB::raw("JSON_REMOVE(
                    COALESCE(settings, '{}'),
                    '$.theme'
                )")
            ]);
        });
    }
}; 