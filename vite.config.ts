// Importaciones necesarias para la configuración de Vite
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Configuración principal de Vite para el proyecto Laravel + React + Tailwind
export default defineConfig({
    // Array de plugins utilizados en el proyecto
    plugins: [
        // Plugin de Laravel para integrar con Vite
        laravel({
            // Archivos de entrada para CSS y JavaScript
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            // Archivo de entrada para Server-Side Rendering (SSR)
            ssr: 'resources/js/ssr.tsx',
            // Habilita la recarga automática de la página
            refresh: true,
        }),
        // Plugin para soporte de React
        react(),
        // Plugin para Tailwind CSS
        tailwindcss(),
    ],
    // Configuración de esbuild para el procesamiento de JSX
    esbuild: {
        // Habilita la transformación automática de JSX
        jsx: 'automatic',
    },
    // Configuración de resolución de módulos
    resolve: {
        // Alias para simplificar las importaciones
        alias: {
            // Mapea 'ziggy-js' al directorio local de Ziggy
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
});
