<?php

use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\LoanController;

Route::get('/settings/profile/reader', function(){
    return Inertia::render('settings/profile-reader');
})->name('settings.profile.reader');

Route::get('/my-reservations', [ReservationController::class, 'myReservations'])->name('reader.my-reservations');

Route::get('/my-loans', [LoanController::class, 'myLoans'])->name('reader.my-loans');

