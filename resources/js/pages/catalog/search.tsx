import PublicLayout from "@/layouts/public-layout";
import { Head } from "@inertiajs/react";
import SearchWithHistory from "@/components/search-with-history";
import { Book, PaginatedResponse, Category } from "@/types/models";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react"; // Importamos iconos para el filtro móvil

interface SearchPageProps {
    books: PaginatedResponse<Book>;
    storageUrl: string;
    categories: Category[];
}

export default function SearchPage({ books, storageUrl, categories }: SearchPageProps) {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [showAvailable, setShowAvailable] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false); // Estado para mostrar/ocultar filtros en móvil

    // Filtro de libros
    const filteredBooks = books.data.filter(book =>
        (selectedCategory ? book.category_id === selectedCategory : true) &&
        (showAvailable ? book.is_available : true)
    );

    const handleBookClick = (id: number) => {
        router.get(`/catalog/${id}`);
    };

    return (
        <PublicLayout>
            <Head title="Catálogo" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
                {/* Barra de búsqueda */}
                <div className="mb-6 md:mb-8">
                    <SearchWithHistory
                        className="w-full"
                        placeholder="Buscar libros, autores, editoriales..."
                        onSearch={query => router.get(`/catalog/search?q=${encodeURIComponent(query)}`)}
                    />
                </div>

                {/* Botón de filtros para móvil */}
                <div className="md:hidden mb-4">
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                    >
                        <Filter size={16} />
                        Filtros
                        {showMobileFilters && <X size={16} />}
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar de filtros - Versión móvil */}
                    {showMobileFilters && (
                        <div className="md:hidden bg-background p-4 rounded-lg border border-border mb-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-semibold text-lg text-foreground">Filtrar resultados</h2>
                                <button onClick={() => setShowMobileFilters(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-foreground">Categoría</label>
                                <select
                                    className="w-full border border-input bg-background text-foreground rounded px-2 py-1 focus:ring-2 focus:ring-ring focus:border-transparent"
                                    value={selectedCategory ?? ""}
                                    onChange={e => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                                >
                                    <option value="">Todas</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm text-foreground">
                                    <input
                                        type="checkbox"
                                        checked={showAvailable}
                                        onChange={e => setShowAvailable(e.target.checked)}
                                        className="rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring"
                                    />
                                    Solo disponibles
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Sidebar de filtros - Versión desktop */}
                    <aside className="hidden md:block w-64 flex-shrink-0">
                        <div className="bg-card border border-border rounded-lg shadow-sm p-4 mb-6 sticky top-4">
                            <h2 className="font-semibold text-lg mb-4 text-foreground">Filtrar resultados</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-foreground">Categoría</label>
                                <select
                                    className="w-full border border-input bg-background text-foreground rounded px-2 py-1 focus:ring-2 focus:ring-ring focus:border-transparent"
                                    value={selectedCategory ?? ""}
                                    onChange={e => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                                >
                                    <option value="">Todas</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm text-foreground">
                                    <input
                                        type="checkbox"
                                        checked={showAvailable}
                                        onChange={e => setShowAvailable(e.target.checked)}
                                        className="rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring"
                                    />
                                    Solo disponibles
                                </label>
                            </div>
                        </div>
                    </aside>

                    {/* Resultados */}
                    <main className="flex-1">
                        <h1 className="text-2xl font-bold mb-4 md:mb-6 text-foreground">Resultados de búsqueda</h1>
                        <div className="flex flex-col gap-4 md:gap-6">
                            {filteredBooks.length === 0 ? (
                                <div className="text-center text-muted-foreground">No se encontraron libros.</div>
                            ) : (
                                filteredBooks.map(book => (
                                    <div
                                        key={book.id}
                                        className="flex flex-col sm:flex-row bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-5 gap-4 sm:gap-5 cursor-pointer group hover:bg-accent/50"
                                        onClick={() => handleBookClick(book.id)}
                                    >
                                        {/* Imagen - Versión móvil */}
                                        <div className="flex sm:hidden items-center gap-3">
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={book.cover_image ? `${storageUrl}/${book.cover_image}` : "/images/book-placeholder.svg"}
                                                    alt={book.title}
                                                    className="w-16 h-20 object-cover rounded-md border border-border"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h2 className="text-base font-bold text-foreground group-hover:underline truncate">{book.title}</h2>
                                                <div className="text-xs text-muted-foreground truncate">
                                                    {book.authors?.map(a => a.full_name).join(", ") || "Autor desconocido"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Imagen - Versión desktop */}
                                        <div className="hidden sm:flex flex-shrink-0">
                                            <img
                                                src={book.cover_image ? `${storageUrl}/${book.cover_image}` : "/images/book-placeholder.svg"}
                                                alt={book.title}
                                                className="w-20 h-28 object-cover rounded-md border border-border"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="hidden sm:flex items-center gap-2 mb-1">
                                                <Badge className="bg-accent text-accent-foreground">{book.category?.name || "Sin categoría"}</Badge>
                                                <span className="text-xs text-muted-foreground">{book.publication_year}</span>
                                                {book.is_available ? (
                                                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">Disponible</Badge>
                                                ) : (
                                                    <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">No disponible</Badge>
                                                )}
                                            </div>
                                            <h2 className="hidden sm:block text-lg font-bold text-foreground group-hover:underline truncate">{book.title}</h2>
                                            <div className="hidden sm:block text-sm text-muted-foreground mb-1 truncate">
                                                {book.authors?.map(a => a.full_name).join(", ") || "Autor desconocido"}
                                            </div>
                                            <div className="hidden sm:block text-xs text-muted-foreground line-clamp-2">{book.description || "Sin descripción."}</div>

                                            {/* Badges para móvil */}
                                            <div className="sm:hidden flex flex-wrap gap-1 mt-2">
                                                <Badge variant="secondary" className="text-xs">{book.category?.name || "Sin categoría"}</Badge>
                                                {book.is_available ? (
                                                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs">Disponible</Badge>
                                                ) : (
                                                    <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs">No disponible</Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Acción */}
                                        <div className="flex sm:flex-col items-end justify-between sm:min-w-[80px]">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full sm:w-auto"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    handleBookClick(book.id);
                                                }}
                                            >
                                                Ver detalles
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </PublicLayout>
    );
}