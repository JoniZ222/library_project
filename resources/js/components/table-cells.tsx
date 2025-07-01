import React from 'react';

interface TableCellProps {
    value: any;
    fallback?: string;
    className?: string;
}

interface RelationCellProps {
    relation: any;
    property: string;
    fallback?: string;
    className?: string;
}

interface AuthorsCellProps {
    authors: any[];
    fallback?: string;
    className?: string;
    authorClassName?: string;
}

export const TextCell: React.FC<TableCellProps> = ({
    value,
    className,
    fallback = 'Desconocido'
}) => (
    <div className={className}>{value || fallback}</div>
);

export const RelationCell: React.FC<RelationCellProps> = ({
    relation,
    property,
    className,
    fallback = 'Desconocido'
}) => (
    <div className={className}>{relation ? relation[property] : fallback}</div>
);

export const AuthorsCell: React.FC<AuthorsCellProps> = ({
    authors,
    className,
    authorClassName,
    fallback = 'Desconocido'
}) => (
    <div className={className}>
        {authors && authors.length > 0 ? (
            authors.map((author, index) => (
                <span key={author.id} className={authorClassName}   >
                    {author.full_name}{index < authors.length - 1 ? ', ' : ''}
                </span>
            ))
        ) : (
            <span>{fallback}</span>
        )}
    </div>
);

export const StatusCell: React.FC<TableCellProps> = ({
    value,
    className,
    fallback = 'Desconocido'
}) => {
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'disponible':
                return 'text-green-600 bg-green-100';
            case 'prestado':
                return 'text-blue-600 bg-blue-100';
            case 'reservado':
                return 'text-yellow-600 bg-yellow-100';
            case 'perdido':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)} ${className}`}>
            {value || fallback}
        </span>
    );
}; 