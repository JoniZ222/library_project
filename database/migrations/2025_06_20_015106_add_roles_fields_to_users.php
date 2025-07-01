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
            $table->enum('role', ['admin', 'librarian', 'reader_public'])->nullable()->after('email');
            $table->boolean('status')->default(false)->after('role');
            $table->string('first_name')->nullable()->after('status');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('last_name_2')->nullable()->after('last_name');
            $table->string('matricula')->nullable()->after('last_name_2');
            
            $table->index('role');
            $table->index('status');
            $table->index('matricula');
            $table->index(['first_name', 'last_name']);
            $table->index(['role', 'status']);
            $table->fullText(['first_name', 'last_name', 'last_name_2']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
            $table->dropColumn('status');
            $table->dropColumn('first_name');
            $table->dropColumn('last_name');
            $table->dropColumn('last_name_2');
            $table->dropColumn('matricula');
        });
    }
};
