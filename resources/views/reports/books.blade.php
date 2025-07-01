<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resumen de Libros - Biblioteca</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            color: #333;
            min-height: 100vh;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            background-color: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            position: relative;
        }

        .header::after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 3px;
            background: linear-gradient(90deg, #6c757d, #495057);
            border-radius: 2px;
        }

        .header h1 {
            color: #495057;
            margin: 0;
            font-size: 32px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .header .subtitle {
            color: #6c757d;
            font-size: 16px;
            margin-top: 8px;
            font-weight: 300;
        }

        .books-table {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            margin-bottom: 30px;
            overflow-x: auto;
        }

        .section-title {
            color: #495057;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e9ecef;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 11px;
            table-layout: fixed;
        }

        th,
        td {
            padding: 8px 6px;
            text-align: left;
            border-bottom: 1px solid #e9ecef;
            vertical-align: top;
        }

        th {
            background-color: #f8f9fa;
            color: #495057;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 9px;
            letter-spacing: 0.5px;
            position: sticky;
            top: 0;
            z-index: 10;
        }

        tr:hover {
            background-color: #f8f9fa;
        }

        .book-title {
            font-weight: 600;
            color: #495057;
            width: 22%;
        }

        .authors-cell {
            width: 20%;
            white-space: normal;
            line-height: 1.3;
            word-wrap: break-word;
        }

        .year-cell {
            width: 5%;
            text-align: center;
        }

        .isbn-cell {
            font-family: 'Courier New', monospace;
            font-size: 9px;
            width: 11%;
            max-width: 110px;
        }

        .folio-cell {
            width: 7%;
            text-align: center;
        }

        .publisher-cell {
            width: 16%;
        }

        .category-cell {
            width: 9%;
        }

        .genre-cell {
            width: 9%;
        }

        .status-cell {
            text-align: center;
            font-weight: 600;
            width: 11%;
        }

        .status-available {
            color: #28a745;
        }

        .status-unavailable {
            color: #dc3545;
        }

        .stats-section {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            margin-bottom: 30px;
        }

        .stats-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .stats-table th,
        .stats-table td {
            padding: 15px;
            text-align: center;
            border: 1px solid #e9ecef;
        }

        .stats-table th {
            background: linear-gradient(135deg, #495057 0%, #6c757d 100%);
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.5px;
        }

        .stats-table td {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            font-size: 18px;
            font-weight: 600;
            color: #495057;
        }

        .stats-table .number {
            font-size: 24px;
            font-weight: 700;
            color: #495057;
        }

        .stats-table .label {
            font-size: 14px;
            color: #6c757d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            margin-top: 5px;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            color: #6c757d;
            font-size: 13px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
        }

        .footer p {
            margin: 5px 0;
        }

        @media (max-width: 768px) {
            .container {
                padding: 20px;
                max-width: 100%;
            }

            .books-table {
                padding: 15px;
            }

            table {
                font-size: 10px;
            }

            th,
            td {
                padding: 6px 4px;
            }

            .stats-table th,
            .stats-table td {
                padding: 10px;
                font-size: 14px;
            }

            .stats-table .number {
                font-size: 20px;
            }
        }

        @media print {
            .container {
                max-width: none;
                box-shadow: none;
            }

            .books-table {
                box-shadow: none;
                border: 1px solid #ddd;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Resumen de Libros</h1>
            <div class="subtitle">Reporte ejecutivo de la colección bibliotecaria</div>
        </div>

        <div class="books-table">
            <h3 class="section-title">Catálogo Completo</h3>
            <table style="font-size:9px; width:100%; border-collapse:collapse;">
                <thead>
                    <tr>
                        <th style="padding:4px 3px; border:1px solid #ccc;">Título</th>
                        <th style="padding:4px 3px; border:1px solid #ccc;">Autores</th>
                        <th style="padding:4px 3px; border:1px solid #ccc;">Año</th>
                        <th style="padding:4px 3px; border:1px solid #ccc;">ISBN</th>
                        <th style="padding:4px 3px; border:1px solid #ccc;">Folio</th>
                        <th style="padding:4px 3px; border:1px solid #ccc;">Editorial</th>
                        <th style="padding:4px 3px; border:1px solid #ccc;">Categoría</th>
                        <th style="padding:4px 3px; border:1px solid #ccc;">Género</th>
                        <th style="padding:4px 3px; border:1px solid #ccc;">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($books as $book)
                    <tr>
                        <td style="padding:4px 3px; border:1px solid #ccc; word-break:break-word; white-space:normal; line-height:1.2;">{{ Str::limit($book->title, 45) }}</td>
                        <td style="padding:3px 4px; border:1px solid #ccc; word-break:break-word; white-space:normal; line-height:1.2;">{{ Str::limit($book->authors->pluck('full_name')->implode(', '), 35) }}</td>
                        <td style="padding:3px 4px; border:1px solid #ccc; text-align:center;">{{ $book->publication_year }}</td>
                        <td style="padding:3px 4px; border:1px solid #ccc; word-break:break-word; white-space:normal; line-height:1.2;">{{ Str::limit($book->isbn, 50) }}</td>
                        <td style="padding:3px 4px; border:1px solid #ccc; text-align:center; word-break:break-word; white-space:normal; line-height:1.2;">{{ $book->folio }}</td>
                        <td style="padding:3px 4px; border:1px solid #ccc; word-break:break-word; white-space:normal; line-height:1.2;">{{ Str::limit($book->publisher->name, 18) }}</td>
                        <td style="padding:3px 4px; border:1px solid #ccc; word-break:break-word; white-space:normal; line-height:1.2;">{{ Str::limit($book->category->name, 15) }}</td>
                        <td style="padding:3px 4px; border:1px solid #ccc; word-break:break-word; white-space:normal; line-height:1.2;">{{ Str::limit($book->genre->name, 15) }}</td>
                        <td style="padding:3px 4px; border:1px solid #ccc; text-align:center; color:{{ $book->inventory->status === 'disponible' ? '#28a745' : '#dc3545' }};">
                            {{ $book->inventory->status }}
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div class="stats-section">
            <h3 class="section-title">Estadísticas del Catálogo</h3>
            <table class="stats-table">
                <thead>
                    <tr>
                        <th>📚 Total de Libros</th>
                        <th>📂 Categorías</th>
                        <th>✍️ Autores Únicos</th>
                        <th>🆕 Últimos 5 Años</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div class="number">{{ $books->count() }}</div>
                            <div class="label">Libros en Total</div>
                        </td>
                        <td>
                            <div class="number">{{ $books->unique('category_id')->count() }}</div>
                            <div class="label">Categorías Diferentes</div>
                        </td>
                        <td>
                            <div class="number">{{ $books->flatMap->authors->unique('id')->count() }}</div>
                            <div class="label">Autores Únicos</div>
                        </td>
                        <td>
                            <div class="number">{{ $books->where('publication_year', '>=', now()->subYears(5)->year)->count() }}</div>
                            <div class="label">Libros Recientes</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="footer">
            <p>Reporte generado automáticamente por el sistema de biblioteca</p>
            <p>© {{ date('Y') }} Sistema de Gestión Bibliotecaria</p>
        </div>
    </div>
</body>

</html>