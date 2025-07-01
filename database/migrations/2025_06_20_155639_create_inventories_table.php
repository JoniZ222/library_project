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
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();

            // Foreign keys
            $table->foreignId('book_id')->nullable()->constrained()->onDelete('set null');

            // Columns
            $table->integer('quantity')->default(1);
            $table->enum('condition', ['nuevo', 'usado', 'deteriorado'])->nullable()->default('nuevo')->comment('Condición del libro (nuevo, usado, deteriorado, etc.)');
            $table->string('location')->nullable()->default('Biblioteca CECyTEM plantel Ixtlahuaca');
            $table->enum('status', ['disponible', 'prestado', 'reservado', 'perdido', 'danado'])->nullable()->default('disponible')->comment('Estado del libro (disponible, prestado, reservado, perdido, danado, etc.)');
            $table->string('notes')->nullable();
            $table->timestamps();

            $table->index(['book_id', 'status']);
            $table->index(['location', 'status']);
            $table->index('condition');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
