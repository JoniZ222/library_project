<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Loan;
use Illuminate\Support\Facades\Auth;
use App\Models\Reservation;
use App\Models\Book;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class LoanController extends Controller
{
    /**
     * Muestra la lista de préstamos para el bibliotecario
     * 
     * @param Request $request - Solicitud HTTP con filtros opcionales
     * @return \Inertia\Response - Vista de Inertia con los préstamos paginados
     */
    public function index(Request $request)
    {
        $loans = Loan::with(['user', 'book'])
            ->select('id', 'user_id', 'book_id', 'status', 'borrowed_at', 'due_date', 'returned_at')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('librarian/sections/loans', [
            'loans' => $loans,
            'filters' => [
                'status' => $request->get('status', ''),
                'search' => $request->get('search', ''),
            ]
        ]);
    }

    public function myLoans()
    {
        $loans = Loan::with(['book', 'librarian'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('reader/my-loans', ['loans' => $loans]);
    }

    public function createFromReservation(Reservation $reservation)
    {
        if (!Auth::user()->isLibrarian()) {
            abort(403);
        }

        if ($reservation->status !== 'approved') {
            return back()->withErrors(['reservation' => 'Solo se pueden crear préstamos desde reservas aprobadas.']);
        }

        if (!$reservation->book->isAvailable()) {
            return back()->withErrors(['book' => 'El libro no está disponible para préstamo.']);
        }

        $loan = Loan::create([
            'user_id' => $reservation->user_id,
            'book_id' => $reservation->book_id,
            'librarian_id' => Auth::id(),
            'reservation_id' => $reservation->id,
            'status' => 'active',
            'borrowed_at' => now(),
            'due_date' => now()->addDays(14), // 14 días de préstamo
        ]);

        $reservation->update(['status' => 'completed']);

        return back()->with('success', 'Préstamo creado exitosamente. Fecha de devolución: ' . $loan->due_date->format('d/m/Y'));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'book_id' => 'required|exists:books,id',
            'librarian_id' => 'nullable|exists:users,id',
            'reservation_id' => 'nullable|exists:reservations,id',
            'borrowed_at' => 'required|date',
            'due_date' => 'required|date|after:borrowed_at',
            'notes' => 'nullable|string|max:1000',
            'left_credential' => 'required|boolean',
            'fine_amount' => 'nullable|numeric|min:0',
        ], [
            'librarian_id.exists' => 'El bibliotecario no existe.',
            'reservation_id.exists' => 'La reserva no existe.',
            'borrowed_at.required' => 'La fecha de préstamo es requerida.',
            'notes.required'  => 'La notas son obligatorias',
            'due_date.required' => 'La fecha de devolución es requerida.',
            'due_date.after' => 'La fecha de devolución debe ser posterior a la fecha de préstamo.',
            'notes.max' => 'Las notas no pueden tener más de 1000 caracteres.',
            'left_credential.required' => 'El estado de la credencial es requerido.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        // Verificar si el usuario ya tiene un préstamo activo para el mismo libro
        $prestamoExistente = Loan::where('user_id', $validated['user_id'])
            ->where('book_id', $validated['book_id'])
            ->where('status', 'active')
            ->exists();

        if ($prestamoExistente) {
            return response()->json([
                'message' => 'El usuario ya tiene un préstamo activo para este libro y no se le puede prestar nuevamente.'
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Crear el préstamo
            $loan = Loan::create([
                'user_id' => $validated['user_id'],
                'book_id' => $validated['book_id'],
                'librarian_id' => $validated['librarian_id'] ?? null,
                'reservation_id' => $validated['reservation_id'] ?? null,
                'borrowed_at' => $validated['borrowed_at'],
                'due_date' => $validated['due_date'],
                'notes' => $validated['notes'] ?? null,
                'left_credential' => $validated['left_credential'],
                'fine_amount' => $validated['fine_amount'] ?? 0,
                'status' => 'active',
            ]);

            // Si hay reserva, márcala como aprobada/usada
            if ($validated['reservation_id']) {
                $reservation = Reservation::find($validated['reservation_id']);
                if ($reservation) {
                    $reservation->status = 'approved';
                    $reservation->save();
                }
            }

            DB::commit();
            return response()->json(['message' => 'Préstamo creado satisfactoriamente', 'loan' => $loan], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al crear el préstamo', 'error' => $e->getMessage()], 500);
        }
    }

    public function return(Loan $loan)
    {
        if (!Auth::user()->isLibrarian()) {
            abort(403);
        }

        if ($loan->status !== 'active') {
            return back()->withErrors(['loan' => 'Este préstamo ya no está activo.']);
        }

        $fine = $loan->calculateFine();

        if ($loan->return()) {
            $message = 'Préstamo marcado como devuelto exitosamente.';
            if ($fine > 0) {
                $message .= " Multa aplicada: $" . number_format($fine, 2);
            }
            return back()->with('success', $message);
        }

        return back()->withErrors(['loan' => 'No se pudo procesar la devolución.']);
    }

    public function markAsLost(Loan $loan)
    {
        if (!Auth::user()->isLibrarian()) {
            abort(403);
        }

        if ($loan->status !== 'active') {
            return back()->withErrors(['loan' => 'Este préstamo ya no está activo.']);
        }

        $loan->update([
            'status' => 'lost',
            'fine_amount' => 50.00, // Multa por libro perdido
        ]);

        return back()->with('success', 'Préstamo marcado como perdido. Multa aplicada: $50.00');
    }

    public function extend(Request $request, Loan $loan)
    {
        if (!Auth::user()->isLibrarian()) {
            abort(403);
        }

        $request->validate([
            'new_due_date' => 'required|date|after:' . $loan->due_date->format('Y-m-d'),
        ]);

        if ($loan->status !== 'active') {
            return back()->withErrors(['loan' => 'Solo se pueden extender préstamos activos.']);
        }

        $loan->update(['due_date' => $request->new_due_date]);

        return back()->with('success', 'Fecha de devolución extendida exitosamente.');
    }

    public function show(Loan $loan)
    {
        // Verificar permisos
        if ($loan->user_id !== Auth::id() && !Auth::user()->isLibrarian()) {
            abort(403);
        }

        $loan->load(['user', 'book', 'librarian', 'reservation']);

        return Inertia::render('loans/show', [
            'loan' => $loan
        ]);
    }

    public function overdue()
    {
        if (!Auth::user()->isLibrarian()) {
            abort(403);
        }

        $overdueLoans = Loan::with(['user', 'book'])
            ->overdue()
            ->orderBy('due_date')
            ->get();

        return Inertia::render('librarian/sections/overdue-loans', [
            'overdueLoans' => $overdueLoans
        ]);
    }

    public function stats()
    {
        $stats = [
            'total' => Loan::count(),
            'active' => Loan::active()->count(),
            'overdue' => Loan::overdue()->count(),
            'returned' => Loan::returned()->count(),
            'lost' => Loan::where('status', 'lost')->count(),
            'today' => Loan::whereDate('created_at', today())->count(),
            'this_week' => Loan::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'total_fines' => Loan::sum('fine_amount'),
        ];

        return response()->json($stats);
    }
}
