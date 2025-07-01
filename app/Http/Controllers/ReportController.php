<?php

namespace App\Http\Controllers;

use App\Exports\BooksExport;
use App\Exports\LoansExport;
use App\Exports\ReservationExport;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Book;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Loan;
use App\Models\Reservation;

class ReportController extends Controller
{
    public function exportBooksExcel()
    {
        return Excel::download(new BooksExport, 'libros.xlsx');
    }

    public function exportBooksPdf()
    {
        return Pdf::loadView('reports.books', [
            'books' => Book::with('authors', 'category', 'publisher', 'genre', 'inventory')->get()
        ])->download('libros.pdf');
    }

    public function exportBooksCSV()
    {
        return Excel::download(new BooksExport, 'libros.csv');
    }

    public function exportLoansExcel()
    {
        return Excel::download(new LoansExport, 'prestamos.xlsx');
    }

    public function exportLoansPdf()
    {
        return Pdf::loadView('reports.loans', [
            'loans' => Loan::with('book', 'user')->get()
        ])->download('prestamos.pdf');
    }

    public function exportLoansCSV()
    {
        return Excel::download(new LoansExport, 'prestamos.csv');
    }

    public function exportReservationsCSV()
    {
        return Excel::download(new ReservationExport, 'reservas.csv');
    }

    public function exportReservationsExcel()
    {
        return Excel::download(new ReservationExport, 'reservas.xlsx');
    }

    public function exportReservationsPdf()
    {
        return Pdf::loadView('reports.reservations', [
            'reservations' => Reservation::with('book', 'user')->get()
        ])->download('reservas.pdf');
    }
}
