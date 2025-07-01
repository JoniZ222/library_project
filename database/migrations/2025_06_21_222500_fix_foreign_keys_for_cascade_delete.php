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
        // Corregir foreign key en book_details
        Schema::table('book_details', function (Blueprint $table) {
            // Eliminar la foreign key existente
            $table->dropForeign(['book_id']);
            
            // Agregar la nueva foreign key con cascade delete (sin recrear la columna)
            $table->foreign('book_id')->references('id')->on('books')->onDelete('cascade');
        });

        // Corregir foreign key en inventories
        Schema::table('inventories', function (Blueprint $table) {
            // Eliminar la foreign key existente
            $table->dropForeign(['book_id']);
            
            // Agregar la nueva foreign key con cascade delete (sin recrear la columna)
            $table->foreign('book_id')->references('id')->on('books')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir book_details
        Schema::table('book_details', function (Blueprint $table) {
            $table->dropForeign(['book_id']);
            $table->foreign('book_id')->references('id')->on('books')->onDelete('set null');
        });

        // Revertir inventories
        Schema::table('inventories', function (Blueprint $table) {
            $table->dropForeign(['book_id']);
            $table->foreign('book_id')->references('id')->on('books')->onDelete('set null');
        });
    }
}; 