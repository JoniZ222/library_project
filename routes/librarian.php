<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Librarian\BooksController;
use App\Http\Controllers\Librarian\CategoriesController;
use App\Http\Controllers\Librarian\PublishersController;
use App\Http\Controllers\Librarian\GenresController;
use App\Http\Controllers\Librarian\AuthorsController;
use App\Http\Controllers\Librarian\InventoryController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\LoanController;

Route::middleware(['auth'])->group(function () {
    Route::get('/librarian/dashboard', function () {
        return Inertia::render('librarian/dashboard');
    })->name('librarian.dashboard');


    Route::match(['get', 'post'], '/books/list', [BooksController::class, 'index'])->name('librarian.books.list');
    Route::get('/books/create', [BooksController::class, 'create'])->name('librarian.books.create');
    Route::post('/books/store', [BooksController::class, 'store'])->name('librarian.books.store');
    Route::get('/books/{id}/edit', [BooksController::class, 'edit'])->name('librarian.books.edit');
    Route::match(['put', 'post'], '/books/{id}/update', [BooksController::class, 'update'])->name('librarian.books.update');
    Route::delete('/books/{id}/destroy', [BooksController::class, 'destroy'])->name('librarian.books.destroy');

    // Categories
    Route::match(['get', 'post'], '/categories', [CategoriesController::class, 'index'])->name('librarian.categories');
    Route::post('/categories/store', [CategoriesController::class, 'store'])->name('librarian.categories.store');
    Route::get('/categories/{id}/show', [CategoriesController::class, 'show'])->name('librarian.categories.show');
    Route::match(['put', 'post'], '/categories/{id}/update', [CategoriesController::class, 'update'])->name('librarian.categories.update');
    Route::delete('/categories/{id}/destroy', [CategoriesController::class, 'destroy'])->name('librarian.categories.destroy');

    // Publishers
    Route::match(['get', 'post'], '/publishers', [PublishersController::class, 'index'])->name('librarian.publishers');
    Route::post('/publishers/store', [PublishersController::class, 'store'])->name('librarian.publishers.store');
    Route::get('/publishers/{id}/show', [PublishersController::class, 'show'])->name('librarian.publishers.show');
    Route::match(['put', 'post'], '/publishers/{id}/update', [PublishersController::class, 'update'])->name('librarian.publishers.update');
    Route::delete('/publishers/{id}/destroy', [PublishersController::class, 'destroy'])->name('librarian.publishers.destroy');

    // Genres
    Route::match(['get', 'post'], '/genres', [GenresController::class, 'index'])->name('librarian.genres');
    Route::post('/genres/store', [GenresController::class, 'store'])->name('librarian.genres.store');
    Route::get('/genres/{id}/show', [GenresController::class, 'show'])->name('librarian.genres.show');
    Route::match(['put', 'post'], '/genres/{id}/update', [GenresController::class, 'update'])->name('librarian.genres.update');
    Route::delete('/genres/{id}/destroy', [GenresController::class, 'destroy'])->name('librarian.genres.destroy');

    // Authors
    Route::match(['get', 'post'], '/authors', [AuthorsController::class, 'index'])->name('librarian.authors');
    Route::post('/authors/store', [AuthorsController::class, 'store'])->name('librarian.authors.store');
    Route::get('/authors/{id}/show', [AuthorsController::class, 'show'])->name('librarian.authors.show');
    Route::match(['put', 'post'], '/authors/{id}/update', [AuthorsController::class, 'update'])->name('librarian.authors.update');
    Route::delete('/authors/{id}/destroy', [AuthorsController::class, 'destroy'])->name('librarian.authors.destroy');


    Route::match(['get', 'post'], '/inventory', [InventoryController::class, 'index'])->name('librarian.inventory');
    Route::get('/inventory/{id}/show', [InventoryController::class, 'show'])->name('librarian.inventory.show');
    Route::match(['put', 'post'], '/inventory/{id}/update', [InventoryController::class, 'update'])->name('librarian.inventory.update');

    Route::get('/books/loans', [LoanController::class, 'index'])->name('librarian.books.loans');
    Route::post('/books/loans/store', [LoanController::class, 'store'])->name('librarian.books.loans.store');

    Route::match(['get', 'post'], '/books/reservations', [ReservationController::class, 'index'])->name('librarian.books.reservations');
    Route::post('/books/reservations/{id}/mark-as-collected', [ReservationController::class, 'markAsCollected'])->name('librarian.books.reservations.mark-as-collected');
    Route::post('/books/reservations/{id}/mark-as-not-collected', [ReservationController::class, 'markAsNotCollected'])->name('librarian.books.reservations.mark-as-not-collected');
    Route::delete('/books/reservations/{id}/destroy', [ReservationController::class, 'destroy'])->name('librarian.books.reservations.destroy');



    Route::get('/books/reports', function () {
        return Inertia::render('librarian/sections/reports');
    })->name('librarian.books.reports');

    Route::get('/books/returns', function () {
        return Inertia::render('librarian/sections/returns');
    })->name('librarian.books.returns');



    Route::get('/books/history', function () {
        return Inertia::render('librarian/sections/history');
    })->name('librarian.books.history');
});
