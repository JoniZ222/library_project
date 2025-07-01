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
        Schema::create('books', function (Blueprint $table) {
            // Columns
            $table->id();
            $table->string('title');
            $table->string('isbn')->unique();
            $table->integer('publication_year')->nullable();
            $table->string('cover_image')->nullable();
            $table->text('description')->nullable();

            $table->unsignedBigInteger('category_id')->nullable();
            $table->unsignedBigInteger('publisher_id')->nullable();
            $table->unsignedBigInteger('genre_id')->nullable();

            $table->timestamps();

            // Agregar las restricciones de clave foránea
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
            $table->foreign('publisher_id')->references('id')->on('publishers')->onDelete('set null');
            $table->foreign('genre_id')->references('id')->on('genres')->onDelete('set null');

            // Índice compuesto para búsquedas por título y año de publicación
            $table->index(['title', 'publication_year']);

            // Índice compuesto para filtros por categoría, género y estado activo
            $table->index(['category_id', 'genre_id']);

            $table->index('publication_year');


            $table->fullText(['title', 'description']);

            $table->fullText('isbn');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
