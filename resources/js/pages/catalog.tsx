import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Book, Category, Genre, PaginatedResponse, Publisher } from '@/types/models';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useInitials } from '@/hooks/use-initials';
import { Search, Frown, Grid, List, CheckCircle, BookOpen, MessageSquare, Info, CreditCard, X, CalendarCheck, ImageIcon } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { router } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import SearchWithHistory from '@/components/search-with-history';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface CatalogProps {
    books: PaginatedResponse<Book>;
    categories: Category[];
    genres: Genre[];
    publishers: Publisher[];
    stats: {
        total_books: number;
        total_categories: number;
        total_genres: number;
        recent_books: Book[];
    };
    user?: {
        id: number;
        name: string;
        role: string;
        has_credential: boolean;
        is_credential_verified: boolean;
        credential_url?: string;
    } | null;
    storageUrl: string;
}

export default function Catalog({ books, categories, genres, publishers, stats, user, storageUrl }: CatalogProps) {
    const { data: booksList, meta, links } = books as unknown as PaginatedResponse<Book>;
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showReservationModal, setShowReservationModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [reservationReason, setReservationReason] = useState('');
    const [credential, setCredential] = useState<File | null>(null);
    const [isFirstReservation, setIsFirstReservation] = useState(false);
    const handleSearch = (searchQuery: string) => {
        if (searchQuery.trim()) {
            const encodedQuery = encodeURIComponent(searchQuery.trim()).replace(/%20/g, '+');
            const url = `/catalog/search?q=${encodedQuery}`;
            router.visit(url);
        }
    };


    const handleSearchWithHistory = (searchQuery: string) => {
        if (searchQuery.trim()) {
            handleSearch(searchQuery);
        }
    };

    const handleReserve = (book: Book) => {
        setSelectedBook(book);
        setIsFirstReservation(!user?.has_credential);
        setShowReservationModal(true);
    };

    const submitReservation = () => {
        const formData = new FormData();
        formData.append('book_id', selectedBook?.id.toString() || '');
        formData.append('reason', reservationReason);

        if (credential) {
            formData.append('credential', credential);
        }

        router.post(route('reservations.store'), formData, {
            onSuccess: () => {
                setShowReservationModal(false);
                setReservationReason('');
                setCredential(null);
                setSelectedBook(null);
            }
        });
    };

    return (
        <PublicLayout>
            <Head title="Catalogo" />
            <div className="bg-background border-b border-border sticky top-0 z-40">
                <div className="mx-auto max-w-7xl px-4 py-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full mb-4">
                        <div className="flex-1">
                            <SearchWithHistory onSearch={handleSearchWithHistory} className="w-full" />
                        </div>
                        <div className="flex items-center justify-end">
                            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')} className="w-full sm:w-40">
                                <TabsList className="w-full">
                                    <TabsTrigger value="grid" className="flex-1"><Grid className="h-4 w-4" /></TabsTrigger>
                                    <TabsTrigger value="list" className="flex-1"><List className="h-4 w-4" /></TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-6">
                {/* Estadísticas rápidas */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-4">
                    <div className="flex flex-col xs:flex-row sm:flex-row gap-1 xs:gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <span>{booksList.length} libros mostrados</span>
                        <span className="hidden xs:inline">•</span>
                        <span>{stats.total_books} libros disponibles</span>
                    </div>
                </div>

                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")}>
                    <TabsContent value="grid">
                        {booksList.length === 0 ? (
                            <div className="text-center py-12">
                                <Frown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2 text-foreground">No hay libros disponibles</h3>
                                <p className="text-muted-foreground">
                                    No se encontraron libros en el catálogo
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                                {booksList.map((book) => (
                                    <div
                                        key={book.id}
                                        className="flex flex-col items-center bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 cursor-pointer hover:bg-accent/50"
                                        onClick={() => router.get(`/catalog/${book.id}`)}
                                    >
                                        <div className="w-32 h-44 bg-muted rounded overflow-hidden flex items-center justify-center mb-3">
                                            {book.cover_image ? (
                                                <img
                                                    src={`${storageUrl}/${book.cover_image}`}
                                                    alt={book.title}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <span className="text-muted-foreground">Sin imagen</span>
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-base font-semibold text-foreground leading-tight line-clamp-2">{book.title}</h3>
                                            <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                {book.authors?.map(a => a.full_name).join(", ") || "Autor desconocido"}
                                            </div>
                                            <div className="text-xs text-muted-foreground">{book.publication_year}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="list">
                        {booksList.length === 0 ? (
                            <div className="text-center py-12">
                                <Frown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2 text-foreground">No hay libros disponibles</h3>
                                <p className="text-muted-foreground">
                                    No se encontraron libros en el catálogo
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {booksList.map(book => (
                                    <div
                                        key={book.id}
                                        className="flex items-center bg-card border border-border rounded-lg shadow-sm px-4 py-3 gap-6 hover:shadow-md hover:bg-accent/50 transition-all duration-200 cursor-pointer"
                                        onClick={() => router.get(`/catalog/${book.id}`)}
                                    >
                                        <div className="flex-shrink-0">
                                            <img
                                                src={book.cover_image ? `${storageUrl}/${book.cover_image}` : "/images/book-placeholder.svg"}
                                                alt={book.title}
                                                className="w-20 h-28 object-cover rounded"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-muted-foreground mb-1 uppercase font-semibold">{book.category?.name || "Libro"}</div>
                                            <h3 className="text-lg font-bold text-foreground mb-1 hover:underline">{book.title}</h3>
                                            <div className="text-sm text-muted-foreground mb-1">
                                                {book.authors?.map(a => a.full_name).join(", ") || "Autor desconocido"}
                                            </div>
                                            <div className="text-xs text-muted-foreground">Año: {book.publication_year || "N/D"}</div>
                                            <div className="text-xs text-muted-foreground">ISBN: {book.isbn}</div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            {book.is_available ? (
                                                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Disponible</span>
                                            ) : (
                                                <span className="text-xs text-red-600 dark:text-red-400 font-medium">No disponible</span>
                                            )}
                                            <button className="text-primary text-xs hover:underline">Ver detalles</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Usar meta/links para la paginación */}
                {meta && meta.last_page > 1 && (
                    <div className="flex justify-center mt-12">
                        <Button
                            onClick={() => router.get(links?.prev || '')}
                            disabled={!links?.prev}
                        >
                            Anterior
                        </Button>
                        <span className="text-sm text-muted-foreground">Página {meta.current_page} de {meta.last_page}</span>
                        <Button
                            onClick={() => router.get(links?.next || '')}
                            disabled={!links?.next}
                        >
                            Siguiente
                        </Button>
                    </div>
                )}
            </div>

            {/* Modal de Reserva */}
            <Dialog open={showReservationModal} onOpenChange={setShowReservationModal}>
                <DialogContent className="max-w-lg p-0 overflow-hidden">
                    {/* Header con gradiente */}
                    <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
                        <DialogHeader className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-foreground/20 rounded-lg">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-semibold">
                                        Reservar Libro
                                    </DialogTitle>
                                    <DialogDescription className="text-primary-foreground/80">
                                        {isFirstReservation
                                            ? 'Primera reserva - Necesitamos tu credencial escolar'
                                            : 'Tu credencial ya está registrada en el sistema'
                                        }
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        {/* Información del libro */}
                        {selectedBook && (
                            <div className="mt-4 p-4 bg-primary-foreground/10 rounded-lg backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-16 bg-primary-foreground/20 rounded overflow-hidden flex items-center justify-center">
                                        {selectedBook.cover_image ? (
                                            <img
                                                src={`${storageUrl}/${selectedBook.cover_image}`}
                                                alt={selectedBook.title}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <BookOpen className="h-6 w-6 text-primary-foreground/70" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-primary-foreground truncate">{selectedBook.title}</h3>
                                        <p className="text-primary-foreground/80 text-sm">
                                            {selectedBook.authors?.map(a => a.full_name).join(", ") || "Autor desconocido"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contenido del formulario */}
                    <div className="p-6 space-y-6">
                        <form onSubmit={(e) => { e.preventDefault(); submitReservation(); }} className="space-y-6">
                            {/* Campo de motivo */}
                            <div className="space-y-2">
                                <Label htmlFor="reason" className="text-sm font-medium text-foreground block mb-1">
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
                                        className="w-full px-4 py-3 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent resize-none transition-all duration-200 placeholder:text-muted-foreground"
                                    />
                                    <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-background px-1 rounded">
                                        {reservationReason.length}/500
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                    <Info className="h-3 w-3" />
                                    <span>Mínimo 10 caracteres, máximo 500</span>
                                </div>
                            </div>

                            {/* Campo de credencial para primera reserva */}
                            {isFirstReservation && (
                                <div className="space-y-2">
                                    <Label htmlFor="credential" className="text-sm font-medium text-foreground block mb-1">
                                        Credencial escolar
                                    </Label>
                                    <Input
                                        id="credential"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setCredential(e.target.files?.[0] || null)}
                                        required
                                        className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent file:text-accent-foreground hover:file:bg-accent/80 transition-all duration-200"
                                    />
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                        <ImageIcon className="h-3 w-3" />
                                        <span>Formatos: JPG, PNG. Máximo 2MB</span>
                                    </div>
                                </div>
                            )}

                            {/* Credencial ya registrada */}
                            {!isFirstReservation && user?.has_credential && (
                                <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-green-800 dark:text-green-200">Credencial registrada</span>
                                            <p className="text-xs text-green-600 dark:text-green-400">Tu credencial ya está verificada en el sistema</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.credential_url}
                                            alt="Tu credencial"
                                            className="w-16 h-auto rounded-lg border-2 border-green-200 dark:border-green-800 shadow-sm"
                                        />
                                        <div className="text-xs text-green-700 dark:text-green-300">
                                            <p className="font-medium">Credencial verificada</p>
                                            <p>No necesitas subir una nueva</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>

                        {/* Footer con botones mejorados */}
                        <DialogFooter className="flex gap-3 pt-4 border-t border-border">
                            <Button
                                variant="outline"
                                onClick={() => setShowReservationModal(false)}
                                className="flex items-center gap-2 px-6 py-2"
                            >
                                <X className="h-4 w-4" />
                                Cancelar
                            </Button>
                            <Button
                                onClick={submitReservation}
                                disabled={
                                    reservationReason.length < 10 ||
                                    (isFirstReservation && !credential)
                                }
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <CalendarCheck className="h-4 w-4" />
                                Confirmar Reserva
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </PublicLayout>
    );
}