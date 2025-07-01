import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import React, { useEffect, useState } from "react";
import { CalendarCheck, X, Info, ArrowRight, BookOpen, User, Calendar, FileText, CreditCard } from "lucide-react";
import axios from "axios";
import { Author, Book, Reservation } from "@/types/models";
import { User as UserType } from "@/types";
import { format, toZonedTime } from "date-fns-tz";

export default function ModalLoan({
    open,
    onOpenChange,
    book,
    user,
    reservation,
    librarianId,
    storageUrl,
    due_date,
    librarian
}: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    book: Book,
    user: UserType,
    reservation: Reservation,
    librarianId: number,
    storageUrl: string,
    due_date: string | null,
    librarian: UserType
}) {
    const [dueDate, setDueDate] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [leftCredential, setLeftCredential] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [borrowedAt, setBorrowedAt] = useState<string>("");
    const [initialDueDate, setInitialDueDate] = useState<string>("");

    useEffect(() => {
        const timeZone = "America/Mexico_City";
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone);
        const borrowedAt = format(zonedDate, "yyyy-MM-dd'T'HH:mm");
        setBorrowedAt(borrowedAt);

        if (due_date) {
            const dueDateObj = toZonedTime(new Date(due_date), timeZone);
            const formattedDueDate = format(dueDateObj, "yyyy-MM-dd");
            setDueDate(formattedDueDate);
            setInitialDueDate(formattedDueDate);
        } else {
            setDueDate("");
            setInitialDueDate("");
        }
    }, [due_date]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                route('librarian.books.loans.store'),
                {
                    user_id: user.id,
                    book_id: book.id,
                    librarian_id: librarianId,
                    reservation_id: reservation.id,
                    borrowed_at: new Date().toISOString(),
                    due_date: dueDate,
                    notes,
                    left_credential: leftCredential ? 1 : 0,
                    fine_amount: 0
                },
                {
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    }
                }
            );

            toast.success(response.data.message);
            onOpenChange(false);
        } catch (err: any) {
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                let message = "";
                Object.keys(errors).forEach((field) => {
                    message += `${errors[field].join(", ")}\n`;
                });
                toast.error(message);
            } else if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Ocurrió un error al crear el préstamo.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Calcular fecha mínima (mañana)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-md mx-auto p-0 overflow-hidden sm:max-w-lg md:max-w-xl rounded-lg sm:rounded-xl h-[90vh] max-h-[700px] flex flex-col">
                {/* Header fijo */}
                <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 p-4 sm:p-6 text-white relative overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <DialogHeader className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20">
                                    <BookOpen className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <DialogTitle className="text-lg sm:text-xl font-semibold text-white">
                                        Crear Préstamo
                                    </DialogTitle>
                                    <DialogDescription className="text-green-100 text-sm mt-1">
                                        Completa los datos para registrar el préstamo del libro
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        {/* Información resumida del libro */}
                        <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-16 bg-white/20 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0 border border-white/20">
                                    {book?.cover_image ? (
                                        <img
                                            src={`${storageUrl}/${book.cover_image}`}
                                            alt={book.title}
                                            className="object-cover w-full h-full"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <BookOpen className="h-5 w-5 text-white/70" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-white text-sm line-clamp-1">
                                        {book?.title || "Libro"}
                                    </h3>
                                    <p className="text-green-100 text-xs mt-1 line-clamp-1">
                                        {book?.authors?.map(a => a.full_name).join(", ") || "Autor desconocido"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenido desplazable */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Fecha de préstamo */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                                Fecha de préstamo
                            </Label>
                            <Input
                                type="datetime-local"
                                value={borrowedAt}
                                readOnly
                                className="w-full bg-muted text-muted-foreground cursor-not-allowed"
                            />
                        </div>

                        {/* Fecha de devolución */}
                        <div className="space-y-2">
                            <Label htmlFor="due_date" className="text-sm font-medium text-foreground flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Fecha de devolución
                            </Label>
                            <div className="relative">
                                <Input
                                    id="due_date"
                                    type="date"
                                    min={minDate}
                                    value={dueDate}
                                    onChange={e => setDueDate(e.target.value)}
                                    required
                                    className="w-full text-sm px-3 py-2.5 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
                                    style={{ minHeight: '2.75rem' }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <Info className="h-3 w-3 flex-shrink-0" />
                                <span>Debe ser posterior a la fecha de préstamo</span>
                            </p>
                        </div>

                        {/* Notas */}
                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-sm font-medium text-foreground flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Notas (opcional)
                            </Label>
                            <div className="relative">
                                <textarea
                                    id="notes"
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    rows={3}
                                    maxLength={300}
                                    className="w-full px-3 py-2.5 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent resize-none placeholder:text-muted-foreground text-sm bg-background"
                                    placeholder="Observaciones adicionales..."
                                />
                                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded border">
                                    {notes.length}/300
                                </div>
                            </div>
                        </div>

                        {/* Checkbox de credencial */}
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                            <Checkbox
                                id="left_credential"
                                checked={leftCredential}
                                onCheckedChange={checked => setLeftCredential(!!checked)}
                            />
                            <Label htmlFor="left_credential" className="text-sm font-medium text-foreground flex items-center gap-2 cursor-pointer">
                                <CreditCard className="h-4 w-4" />
                                ¿Dejó credencial?
                            </Label>
                        </div>

                        {/* Footer fijo en la parte inferior */}
                        <DialogFooter className="pt-4 border-t border-border sticky bottom-0 bg-background pb-1">
                            <div className="flex w-full gap-3">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => onOpenChange(false)}
                                    className="flex-1 sm:flex-none gap-2"
                                    disabled={loading}
                                >
                                    <X className="h-4 w-4" />
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!dueDate || loading}
                                    className="flex-1 sm:flex-none gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                >
                                    <CalendarCheck className="h-4 w-4" />
                                    {loading ? "Procesando..." : "Registrar"}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}