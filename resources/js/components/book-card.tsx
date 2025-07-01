import { router } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Badge } from '@/components/ui/badge';
import { Book } from '@/types/models';

export default function BookCard({ book, storageUrl }: { book: Book, storageUrl: string }) {
    return (
        <div
            className="group cursor-pointer"
            onClick={() => router.get(`/catalog/${book.id}`)}
        >
            <div className="aspect-[3/4] w-full rounded-lg bg-muted flex items-center justify-center overflow-hidden mb-3 group-hover:scale-105 transition-transform duration-200">
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
            <div className="space-y-1">
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                    {book.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-1">
                    {book.authors?.map((a) => a.full_name).join(', ')}
                </p>
                <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">
                        {book.category?.name}
                    </Badge>
                    {book.is_available && (
                        <Badge variant="default" className="text-xs">
                            Disponible
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    );
};