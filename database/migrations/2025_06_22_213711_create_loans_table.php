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
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->foreignId('librarian_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('reservation_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('status', ['active', 'returned', 'overdue', 'lost'])->default('active');
            $table->timestamp('borrowed_at')->useCurrent();
            $table->date('due_date');
            $table->timestamp('returned_at')->nullable();
            $table->decimal('fine_amount', 8, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['book_id', 'status']);
            $table->index(['due_date']);
            $table->index(['librarian_id', 'status', 'borrowed_at']);
            $table->index(['status', 'due_date']);
            $table->index('fine_amount');
            $table->index(['user_id', 'book_id', 'status']);
            $table->index('returned_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loans'); // Elimina la tabla de préstamos
    }
};
