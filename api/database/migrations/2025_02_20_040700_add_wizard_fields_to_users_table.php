<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedTinyInteger('wizard_step')->nullable();
            $table->boolean('wizard_completed')->default(false);
            $table->json('settings')->nullable();
        });

        Schema::table('companies', function (Blueprint $table) {
            if (!Schema::hasColumn('companies', 'settings')) {
                $table->json('settings')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['wizard_step', 'wizard_completed', 'settings']);
        });

        Schema::table('companies', function (Blueprint $table) {
            if (Schema::hasColumn('companies', 'settings')) {
                $table->dropColumn('settings');
            }
        });
    }
}; 