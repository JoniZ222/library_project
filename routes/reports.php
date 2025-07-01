<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReportController;

Route::prefix('reports')->group(function () {
    // Libros
    Route::get('books/pdf', [ReportController::class, 'exportBooksPdf'])->name('reports.books.pdf');
    Route::get('books/csv', [ReportController::class, 'exportBooksCSV'])->name('reports.books.csv');
    Route::get('books/excel', [ReportController::class, 'exportBooksExcel'])->name('reports.books.excel');  
    // Prestamos
    Route::get('loans/pdf', [ReportController::class, 'exportLoansPdf'])->name('reports.loans.pdf');
    Route::get('loans/csv', [ReportController::class, 'exportLoansCSV'])->name('reports.loans.csv');
    Route::get('loans/excel', [ReportController::class, 'exportLoansExcel'])->name('reports.loans.excel');
    // Reservas
    Route::get('reservations/pdf', [ReportController::class, 'exportReservationsPdf'])->name('reports.reservations.pdf');
    Route::get('reservations/csv', [ReportController::class, 'exportReservationsCSV'])->name('reports.reservations.csv');
    Route::get('reservations/excel', [ReportController::class, 'exportReservationsExcel'])->name('reports.reservations.excel');
});
