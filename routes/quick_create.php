<?php

use App\Http\Controllers\Librarian\QuickCreateController;
use Illuminate\Support\Facades\Route;

Route::post('/quick-create/category', [QuickCreateController::class, 'createCategory'])->name('librarian.quick-create.category');
Route::post('/quick-create/publisher', [QuickCreateController::class, 'createPublisher'])->name('librarian.quick-create.publisher');
Route::post('/quick-create/genre', [QuickCreateController::class, 'createGenre'])->name('librarian.quick-create.genre');
Route::post('/quick-create/author', [QuickCreateController::class, 'createAuthor'])->name('librarian.quick-create.author');
