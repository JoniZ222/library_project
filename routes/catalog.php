<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\ReservationController;

// Catálogo público
Route::match(['get', 'post'], '/catalog', [CatalogController::class, 'index'])->name('public.catalog');
Route::get('/catalog/search', [CatalogController::class, 'search'])->name('public.catalog.search');
Route::get('/catalog/suggestions', [CatalogController::class, 'suggestions'])->name('public.catalog.suggestions');


Route::post('/reservations', [ReservationController::class, 'store'])->name('reservations.store');

Route::match(['get', 'post'], '/catalog/{book}', [CatalogController::class, 'show'])->name('public.catalog.show');
