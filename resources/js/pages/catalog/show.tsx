import { useState, } from 'react';
import { Head } from '@inertiajs/react';
import { Book } from '@/types/models';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { BookOpen, Calendar, Building2, Tag, Hash, Users, CheckCircle, X, LogIn, ArrowLeft, Share2, Heart } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { router } from '@inertiajs/react';
import BookCard from '@/components/book-card';
import ModalReservation from '@/components/modal-reservation';

interface BookDetailProps {
    book: Book & {
        is_available: boolean;
        can_reserve: boolean;
        availability_status: any;
        folio: string;
    };
    relatedBooks: Book[];
    popularBooks: Book[];
    recentBooks: Book[];
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

export default function BookDetail({ book, relatedBooks, popularBooks, recentBooks, user, storageUrl }: BookDetailProps) {
    const getInitials = useInitials();
    const [showReservationModal, setShowReservationModal] = useState(false);
    const currentUrl = window.location.href;

    return (
        <PublicLayout>
            <Head title={`${book.title}`} />
            {/* Header con breadcrumbs */}
            <div className="bg-muted/40 border-b">
                <div className="mx-auto max-w-7xl px-4 py-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.get('/catalog')}
                            className="p-0 h-auto"
                        >
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Catálogo
                        </Button>
                        <span>/</span>
                        <span>{book.category?.name}</span>
                        <span>/</span>
                        <span className="font-medium text-foreground">{book.title}</span>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Columna izquierda - Imagen y botones */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="p-6">
                                {/* Imagen del libro */}
                                <div className="aspect-[3/4] w-full rounded-lg bg-muted flex items-center justify-center overflow-hidden mb-6">
                                    {book.cover_image ? (
                                        <img
                                            src={`${storageUrl}/${book.cover_image}`}
                                            alt={book.title}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <PlaceholderPattern className="w-full h-full text-muted-foreground/20" />
                                    )}
                                </div>

                                {/* Estado de disponibilidad */}
                                <div className="mb-6">
                                    {book.is_available ? (
                                        <Alert className="border-green-200 bg-green-50">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <AlertTitle className="text-green-800">Disponible</AlertTitle>
                                            <AlertDescription className="text-green-700">
                                                Este libro está disponible para reserva
                                            </AlertDescription>
                                        </Alert>
                                    ) : (
                                        <Alert className="border-red-200 bg-red-50">
                                            <X className="h-4 w-4 text-red-600" />
                                            <AlertTitle className="text-red-800">No disponible</AlertTitle>
                                            <AlertDescription className="text-red-700">
                                                {book.availability_status?.status === 'borrowed'
                                                    ? `Prestado hasta ${book.availability_status.due_date}`
                                                    : 'Este libro no está disponible actualmente'
                                                }
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {/* Botones de acción */}
                                <div className="space-y-3">
                                    {user && book.is_available && book.can_reserve && (
                                        <Button
                                            onClick={() => setShowReservationModal(true)}
                                            className="w-full"
                                            size="lg"
                                        >
                                            <Calendar className="mr-2 h-5 w-5" />
                                            Reservar este libro
                                        </Button>
                                    )}
                                    {user && book.is_available && !book.can_reserve && (
                                        <Alert className="border-yellow-200 bg-yellow-50 mt-2">
                                            <AlertTitle className="text-yellow-800">Ya tienes una reserva activa o un préstamo activo</AlertTitle>
                                            <AlertDescription className="text-yellow-700">
                                                Ya has reservado este libro o tienes un préstamo activo. Por favor revisa tus reservas activas o tus préstamos activos.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {!user && (
                                        <Button
                                            variant="outline"
                                            onClick={() => router.get(`/login?redirect=${encodeURIComponent(currentUrl || '/')}`)}
                                            className="w-full"
                                            size="lg"
                                        >
                                            Iniciar sesión para reservar
                                        </Button>
                                    )}

                                    <div className="flex gap-2">
                                        <Button variant="outline" className="flex-1">
                                            <Heart className="mr-2 h-4 w-4" />
                                            Favorito
                                        </Button>
                                        <Button variant="outline" className="flex-1">
                                            <Share2 className="mr-2 h-4 w-4" />
                                            Compartir
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Columna derecha - Información del libro */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-3xl mb-2">{book.title}</CardTitle>
                                        <p className="text-xl text-muted-foreground mb-4">
                                            {book.authors?.map((a) => a.full_name).join(', ') || 'Autor desconocido'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">{book.category?.name}</Badge>
                                        <Badge variant="outline">{book.genre?.name}</Badge>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {/* Descripción */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Descripción</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {book.description || 'Sin descripción disponible.'}
                                    </p>
                                </div>

                                <Separator />

                                {/* Información técnica */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Información del libro</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2">
                                            <Hash className="h-4 w-4 text-muted-foreground" />
                                            <span><strong>ISBN:</strong> {book.isbn}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span><strong>Año:</strong> {book.publication_year || 'N/D'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                            <span><strong>Editorial:</strong> {book.publisher?.name || 'N/D'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Tag className="h-4 w-4 text-muted-foreground" />
                                            <span><strong>Categoría:</strong> {book.category?.name || 'N/D'}</span>
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                                            <Tag className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                <strong>Copias disponibles:</strong>{" "}
                                                <span className="font-semibold text-primary">
                                                    {book.inventory?.quantity ?? 'N/D'}
                                                </span>
                                                <span className="ml-1 text-xs text-muted-foreground">(Biblioteca escolar)</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Autores */}
                                {book.authors && book.authors.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">Autores</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {book.authors.map(author => (
                                                <div key={author.id} className="flex items-center gap-3 p-3 border rounded-lg">
                                                    <Avatar>
                                                        <AvatarImage src={author.image || undefined} alt={author.full_name} />
                                                        <AvatarFallback>{getInitials(author.full_name)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{author.full_name}</p>
                                                        {author.biography && (
                                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                                {author.biography}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Libros relacionados */}
                        {relatedBooks.length > 0 && (
                            <Card className="mt-8">
                                <CardHeader>
                                    <CardTitle>Libros relacionados</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {relatedBooks.map(relatedBook => (
                                            <div
                                                key={relatedBook.id}
                                                className="cursor-pointer group"
                                                onClick={() => router.get(`/catalog/${relatedBook.id}`)}
                                            >
                                                <div className="aspect-[3/4] w-full rounded-lg bg-muted flex items-center justify-center overflow-hidden mb-3 group-hover:scale-105 transition-transform">
                                                    {relatedBook.cover_image ? (
                                                        <img
                                                            src={`${storageUrl}/${relatedBook.cover_image}`}
                                                            alt={relatedBook.title}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <PlaceholderPattern className="w-full h-full text-muted-foreground/20" />
                                                    )}
                                                </div>
                                                <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                                                    {relatedBook.title}
                                                </h4>
                                                <p className="text-xs text-muted-foreground">
                                                    {relatedBook.authors?.map((a) => a.full_name).join(', ')}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Secciones de sugerencias */}
            <div className="mt-12 space-y-8">

                {/* Libros del mismo autor */}
                {book.authors && book.authors.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Más libros de {book.authors[0].full_name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Descubre otros títulos del mismo autor
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {relatedBooks.filter(related =>
                                    related.authors?.some(author =>
                                        book.authors?.some(bookAuthor => bookAuthor.id === author.id)
                                    )
                                ).slice(0, 6).map(relatedBook => (
                                    <BookCard key={relatedBook.id} book={relatedBook} storageUrl={storageUrl} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Libros de la misma categoría */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Tag className="h-5 w-5" />
                            Más libros de {book.category?.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Explora otros títulos de esta categoría
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {relatedBooks.filter(related =>
                                related.category?.id === book.category?.id
                            ).slice(0, 6).map(relatedBook => (
                                <BookCard key={relatedBook.id} book={relatedBook} storageUrl={storageUrl} />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Libros del mismo género */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Más libros de {book.genre?.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Encuentra libros similares de este género
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {relatedBooks.filter(related =>
                                related.genre?.id === book.genre?.id
                            ).slice(0, 6).map(relatedBook => (
                                <BookCard key={relatedBook.id} book={relatedBook} storageUrl={storageUrl} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <ModalReservation book={book} user={user} storageUrl={storageUrl} showReservationModal={showReservationModal} setShowReservationModal={setShowReservationModal} />
        </PublicLayout>
    );
}