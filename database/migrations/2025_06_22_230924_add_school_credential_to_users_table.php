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
            $table->string('school_credential_path')->nullable()->after('email');
            $table->timestamp('credential_verified_at')->nullable()->after('school_credential_path');
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null')->after('credential_verified_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['verified_by']);
            $table->dropColumn(['school_credential_path', 'credential_verified_at', 'verified_by']);
        });
    }
};
