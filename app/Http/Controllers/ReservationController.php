<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Reservation;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search');

        $query = Reservation::with(['book', 'user']);

        if ($search) {
            $query->search($search);
        }

        $reservations = $query->paginate($perPage)->withQueryString();

        return Inertia::render('librarian/sections/reservations', [
            'reservations' => $reservations,
            'filters' => compact('search', 'perPage'),
            'pagination' => [
                'current_page' => $reservations->currentPage(),
                'last_page'    => $reservations->lastPage(),
                'per_page'     => $reservations->perPage(),
                'total'        => $reservations->total(),
                'from'         => $reservations->firstItem(),
                'to'           => $reservations->lastItem(),
                'links'        => $reservations->links(),
            ],
        ]);
    }

    public function myReservations()
    {
        $reservations = Reservation::with(['book', 'approvedBy'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('reader/my-reservations', [
            'reservations' => $reservations,
            'storageUrl' => config('filesystems.disks.public.url'),
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'book_id' => 'required|exists:books,id',
            'reason' => 'required|string|min:10|max:500',
            'planned_return_date' => 'required|date|after_or_equal:today',
        ], [
            'user_id.required' => 'El usuario es requerido.',
            'user_id.exists' => 'El usuario no existe.',
            'book_id.required' => 'El libro es requerido.',
            'book_id.exists' => 'El libro no existe.',
            'reason.required' => 'El motivo es requerido.',
            'reason.min' => 'El motivo debe tener al menos 10 caracteres.',
            'reason.max' => 'El motivo debe tener menos de 500 caracteres.',
            'planned_return_date.after_or_equal' => 'La fecha de devolución debe ser hoy o una fecha posterior.',
            'planned_return_date.required' => 'La fecha de devolución es requerida.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $book = Book::findOrFail($request->book_id);

        if (!$book->isAvailable()) {
            return response()->json(['error' => 'Este libro no está disponible para reservar.'], 400);
        }

        $existingPendingReservation = Reservation::where('user_id', Auth::id())
            ->where('book_id', $book->id)
            ->where('status', 'pending')
            ->exists();

        if ($existingPendingReservation) {
            return response()->json(['error' => 'Ya tienes una reserva pendiente para este libro.'], 400);
        }

        $existingActiveLoan = $book->loans()
            ->where('user_id', Auth::id())
            ->where('status', 'active')
            ->exists();

        if ($existingActiveLoan) {
            return response()->json(['error' => 'Ya tienes este libro en préstamo.'], 400);
        }

        $reservation = Reservation::create([
            'user_id' => $request->user_id,
            'book_id' => $book->id,
            'status' => 'pending',
            'reason' => $request->reason,
            'reserved_at' => now(),
            'expires_at' => now()->addDays(4),
            'planned_return_date' => $request->planned_return_date,
        ]);

        return response()->json(['message' => 'Reserva creada exitosamente. Espera la aprobación del bibliotecario.'], 200);
    }

    public function approve(Reservation $reservation)
    {
        if (!Auth::user()->isLibrarian()) {
            abort(403);
        }

        if ($reservation->approve(Auth::id())) {
            return back()->with('success', 'Reserva aprobada exitosamente.');
        }

        return back()->withErrors(['reservation' => 'No se pudo aprobar la reserva.']);
    }

    public function reject(Request $request, Reservation $reservation)
    {
        if (!Auth::user()->isLibrarian()) {
            abort(403);
        }

        $request->validate([
            'notes' => 'nullable|string|max:500',
        ]);

        $reservation->update([
            'status' => 'rejected',
            'notes' => $request->get('notes'),
        ]);

        return back()->with('success', 'Reserva rechazada exitosamente.');
    }

    public function cancel(Reservation $reservation)
    {
        if ($reservation->user_id !== Auth::id() && !Auth::user()->isLibrarian()) {
            abort(403);
        }

        if ($reservation->status === 'pending') {
            $reservation->update(['status' => 'cancelled']);
            return back()->with('success', 'Reserva cancelada exitosamente.');
        }

        return back()->withErrors(['reservation' => 'No se puede cancelar esta reserva.']);
    }


    public function show(Reservation $reservation)
    {
        if ($reservation->user_id !== Auth::id() && !Auth::user()->isLibrarian()) {
            abort(403);
        }

        $reservation->load(['user', 'book', 'approvedBy']);

        return Inertia::render('reservations/show', [
            'reservation' => $reservation
        ]);
    }

    public function stats()
    {
        $stats = [
            'total' => Reservation::count(),
            'pending' => Reservation::pending()->count(),
            'approved' => Reservation::approved()->count(),
            'rejected' => Reservation::where('status', 'rejected')->count(),
            'today' => Reservation::whereDate('created_at', today())->count(),
            'this_week' => Reservation::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
        ];

        return response()->json($stats);
    }
}
