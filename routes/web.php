<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/catalog.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/librarian.php';
require __DIR__ . '/reader-public.php';
require __DIR__ . '/quick_create.php';
require __DIR__ . '/reports.php';
