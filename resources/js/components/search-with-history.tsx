import { useState, useEffect, useRef } from 'react';
import { Search, BookOpen, User, Building2, Clock, TrendingUp, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { debounce } from 'lodash';
import { useDebounce } from 'use-debounce';

interface SearchSuggestion {
    id: number;
    title: string;
    type: 'book' | 'author' | 'publisher';
    subtitle?: string;
}

interface SearchHistory {
    query: string;
    timestamp: number;
    type: 'search' | 'book' | 'author' | 'publisher';
}

interface SearchWithHistoryProps {
    placeholder?: string;
    className?: string;
    onSearch?: (query: string) => void;
}

export default function SearchWithHistory({
    placeholder = "Buscar libros, autores, editoriales...",
    className = "",
    onSearch
}: SearchWithHistoryProps) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
    const [popularSearches] = useState([
        'Cien años de soledad',
        'Gabriel García Márquez',
        'Ficción',
        'Planeta',
        'Poesía',
        'Historia'
    ]);
    const searchRef = useRef<HTMLDivElement>(null);
    const [debouncedQuery] = useDebounce(query, 500);

    useEffect(() => {
        const savedHistory = localStorage.getItem('searchHistory');
        if (savedHistory) {
            setSearchHistory(JSON.parse(savedHistory));
        }
    }, []);

    const saveSearchHistory = (newHistory: SearchHistory[]) => {
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    };

    const addToHistory = (searchQuery: string, type: SearchHistory['type'] = 'search') => {
        const existe = searchHistory.some(
            item => item.query.trim().toLowerCase() === searchQuery.trim().toLowerCase()
        );
        if (existe) return;

        const nuevoHistorial = [
            { query: searchQuery, timestamp: Date.now(), type },
            ...searchHistory
        ].slice(0, 5);

        saveSearchHistory(nuevoHistorial);
    };

    const searchSuggestions = debounce(async (searchQuery: string) => {
        if (searchQuery.length < 2) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(route('public.catalog.suggestions', { q: searchQuery }));
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error('Error buscando sugerencias:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, 300);

    useEffect(() => {
        searchSuggestions(debouncedQuery);
    }, [debouncedQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (searchQuery?: string) => {
        const finalQuery = searchQuery || query;
        if (finalQuery.trim()) {
            addToHistory(finalQuery, 'search');
            if (onSearch) {
                onSearch(finalQuery);
            } else {
                router.get(route('public.catalog.search', { q: finalQuery }));
            }
            setShowSuggestions(false);
            setQuery('');
        }
    };

    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
        addToHistory(suggestion.title, suggestion.type);

        if (suggestion.type === 'book') {
            router.get(route('public.catalog.search', { q: suggestion.title }));
        } else {
            router.get(route('public.catalog.search'), {
                q: suggestion.title,
                filter: suggestion.type
            });
        }
        setShowSuggestions(false);
        setQuery('');
    };

    const handleHistoryClick = (historyItem: SearchHistory) => {
        setQuery(historyItem.query);
        handleSearch(historyItem.query);
    };

    const clearHistory = () => {
        saveSearchHistory([]);
    };

    const removeFromHistory = (index: number) => {
        const newHistory = searchHistory.filter((_, i) => i !== index);
        saveSearchHistory(newHistory);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    className="pl-10 pr-20"
                />
                {/* Botón invisible para mantener funcionalidad de búsqueda con Enter */}
                <button
                    onClick={() => handleSearch()}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 opacity-0 pointer-events-none"
                    aria-hidden="true"
                >
                    <Search className="h-4 w-4" />
                </button>
            </div>

            {showSuggestions && (
                <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg max-h-96 overflow-hidden">
                    <CardContent className="p-0">
                        <div className="max-h-96 overflow-y-auto">
                            <div className="border-b">
                                <div className="flex items-center justify-between p-3 bg-muted/30">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Clock className="h-4 w-4" />
                                        Búsquedas recientes
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearHistory}
                                        className="h-6 px-2 text-xs"
                                        disabled={searchHistory.length === 0}
                                    >
                                        Limpiar
                                    </Button>
                                </div>
                                <div className="p-2">
                                    {searchHistory.length === 0 ? (
                                        <div className="flex justify-center items-center text-muted-foreground py-2">
                                            Sin historial de búsquedas
                                        </div>
                                    ) : (
                                        searchHistory.slice(0, 5).map((historyItem, index) => (
                                            <div
                                                key={`${historyItem.query}-${historyItem.timestamp}`}
                                                className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer group"
                                                onClick={() => handleHistoryClick(historyItem)}
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                    <span className="truncate">{historyItem.query}</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFromHistory(index);
                                                    }}
                                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            {/* 
                            <div className="border-b">
                                <div className="flex items-center gap-2 p-3 bg-muted/30">
                                    <TrendingUp className="h-4 w-4" />
                                    <span className="text-sm font-medium">Búsquedas populares</span>
                                </div>
                                <div className="p-2">
                                    {popularSearches.map((popularSearch) => (
                                        <div
                                            key={popularSearch}
                                            className="flex items-center gap-3 p-2 hover:bg-muted rounded cursor-pointer"
                                            onClick={() => handleSearch(popularSearch)}
                                        >
                                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                            <span>{popularSearch}</span>
                                        </div>
                                    ))}
                                </div>
                            </div> */}

                            {query.length >= 2 && (
                                <div>
                                    <div className="flex items-center gap-2 p-3 bg-muted/30">
                                        <Search className="h-4 w-4" />
                                        <span className="text-sm font-medium">
                                            {isLoading ? 'Buscando...' : 'Sugerencias'}
                                        </span>
                                    </div>
                                    <div className="p-2">
                                        {isLoading ? (
                                            <div className="p-4 text-center text-muted-foreground">
                                                Buscando...
                                            </div>
                                        ) : suggestions.length > 0 ? (
                                            suggestions.map((suggestion) => (
                                                <div
                                                    key={`${suggestion.type}-${suggestion.id}`}
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                    className="flex items-center gap-3 p-2 hover:bg-muted rounded cursor-pointer"
                                                >
                                                    <div className="flex-shrink-0">
                                                        {suggestion.type === 'book' && (
                                                            <BookOpen className="h-4 w-4 text-blue-600" />
                                                        )}
                                                        {suggestion.type === 'author' && (
                                                            <User className="h-4 w-4 text-green-600" />
                                                        )}
                                                        {suggestion.type === 'publisher' && (
                                                            <Building2 className="h-4 w-4 text-purple-600" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium truncate">
                                                            {suggestion.title}
                                                        </div>
                                                        {suggestion.subtitle && (
                                                            <div className="text-sm text-muted-foreground truncate">
                                                                {suggestion.subtitle}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground capitalize">
                                                        {suggestion.type}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-muted-foreground">
                                                No se encontraron sugerencias
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}