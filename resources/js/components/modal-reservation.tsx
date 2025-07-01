import { Dialog } from "@/components/ui/dialog";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { BookOpen, X, CalendarCheck, Info, ArrowRight, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createReservation } from "@/utils/reservation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function ModalReservation({ book, user, storageUrl, showReservationModal, setShowReservationModal }: { book: any, user: any, storageUrl: string, showReservationModal: boolean, setShowReservationModal: (show: boolean) => void }) {
    const [reservationReason, setReservationReason] = useState<string>("");
    const [plannedReturnDate, setPlannedReturnDate] = useState<Date | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        createReservation(book.id.toString(), user.id.toString(), reservationReason, plannedReturnDate?.toISOString() || "")
            .then((res) => {
                setShowReservationModal(false);
                toast.success(res.message);
            })
            .catch((err) => {
                if (err.response && err.response.status === 422 && err.response.data.errors) {
                    const errores = err.response.data.errors;
                    let mensaje = "";
                    Object.keys(errores).forEach((campo) => {
                        mensaje += `${errores[campo].join(", ")}\n`;
                    });
                    toast.error(mensaje);
                } else if (err.response && err.response.data.error) {
                    toast.error(err.response.data.error);
                } else if (err.response && err.response.data.message) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error("Ocurrió un error al crear la reserva.");
                }
            });
    }

    // Calcular fecha mínima (mañana)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <Dialog open={showReservationModal} onOpenChange={setShowReservationModal}>
            <DialogContent className="w-[95vw] max-w-md mx-auto p-0 overflow-hidden sm:max-w-lg md:max-w-xl rounded-lg sm:rounded-xl">
                {/* Header con gradiente mejorado */}
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-4 sm:p-6 text-white relative overflow-hidden">
                    {/* Patrón de fondo sutil */}
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <DialogHeader className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20">
                                    <BookOpen className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <DialogTitle className="text-lg sm:text-xl font-semibold text-white">
                                        Reservar Libro
                                    </DialogTitle>
                                    <DialogDescription className="text-blue-100 text-sm mt-1">
                                        {user ? "Completa los detalles de tu solicitud" : "Inicia sesión para reservar este libro"}
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        {/* Información del libro mejorada */}
                        {book && (
                            <div className="mt-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                                <div className="flex gap-3">
                                    <div className="w-14 h-20 bg-white/20 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 border border-white/20">
                                        {book.cover_image ? (
                                            <img
                                                src={`${storageUrl}/${book.cover_image}`}
                                                alt={book.title}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <BookOpen className="h-7 w-7 text-white/70" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-white text-sm sm:text-base line-clamp-2 leading-tight">
                                            {book.title}
                                        </h3>
                                        <div className="mt-2 space-y-1">
                                            <p className="text-blue-100 text-xs sm:text-sm">
                                                <span className="font-medium">Autor:</span> {book.authors?.map((author: any) => author.full_name).join(", ") || "Autor desconocido"}
                                            </p>
                                            <p className="text-blue-100 text-xs sm:text-sm">
                                                <span className="font-medium">Folio:</span> {book.folio || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Información del usuario */}
                                {user && (
                                    <div className="mt-3 pt-3 border-t border-white/20">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-blue-200" />
                                            <span className="text-xs sm:text-sm text-blue-100">
                                                <span className="font-medium">Solicitado por:</span> {user.name}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Contenido del formulario */}
                <div className="p-4 sm:p-6 space-y-5">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input type="hidden" name="book_id" value={book.id} />

                        {/* Campo de motivo mejorado */}
                        <div className="space-y-2">
                            <Label htmlFor="reason" className="text-sm font-medium text-foreground">
                                Motivo de la solicitud
                            </Label>
                            <div className="relative">
                                <textarea
                                    id="reason"
                                    value={reservationReason}
                                    onChange={(e) => setReservationReason(e.target.value)}
                                    placeholder="Ej: Necesito este libro para mi proyecto de investigación sobre..."
                                    rows={4}
                                    minLength={10}
                                    maxLength={500}
                                    required
                                    className="w-full px-3 py-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent resize-none transition-all duration-200 placeholder:text-muted-foreground text-sm bg-background"
                                />
                                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded border">
                                    {reservationReason.length}/500
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Info className="h-3 w-3" />
                                <span>Mínimo 10 caracteres, máximo 500</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="planned_return_date" className="text-sm font-medium text-foreground flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Fecha de devolución
                            </Label>
                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Selecciona la fecha en la que planeas devolver el libro
                                </p>
                                <div className="relative">
                                    {/* Input con estilos optimizados para móviles */}
                                    <Input
                                        type="date"
                                        id="planned_return_date"
                                        min={minDate}
                                        className="w-full text-sm px-3 py-3 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 bg-background
                           appearance-none mobile-date-input"
                                        value={plannedReturnDate?.toISOString().split("T")[0] || ""}
                                        onChange={(e) => setPlannedReturnDate(new Date(e.target.value))}
                                        required
                                    />
                                    {/* Mejor visualización para móviles */}
                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-end pr-3 sm:hidden">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </div>
                                {/* Texto de ayuda solo para móviles */}
                                <p className="text-xs text-muted-foreground sm:hidden">
                                    Toca el campo para seleccionar fecha
                                </p>
                            </div>
                        </div>

                        {/* Footer mejorado */}
                        <DialogFooter className="flex flex-col gap-3 pt-4 border-t border-border sm:flex-row">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => setShowReservationModal(false)}
                                className="flex items-center gap-2 px-4 py-2.5 w-full sm:w-auto text-sm"
                            >
                                <X className="h-4 w-4" />
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    reservationReason.length < 10 ||
                                    !plannedReturnDate
                                }
                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto text-sm font-medium btn-gradient-hover"
                            >
                                <CalendarCheck className="h-4 w-4" />
                                <span className="whitespace-nowrap">Confirmar Reserva</span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}