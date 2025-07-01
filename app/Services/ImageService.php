<?php

namespace App\Services;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ImageService
{
    protected $manager;

    public function __construct()
    {
        $this->manager = new ImageManager(new Driver());
    }

    /**
     * Comprimir y optimizar una imagen
     */
    public function compressImage(UploadedFile $file, int $quality = 85, int $maxWidth = 1920, int $maxHeight = 1080): string
    {
        // Leer la imagen
        $image = $this->manager->read($file->getPathname());
        
        // Obtener dimensiones originales
        $width = $image->width();
        $height = $image->height();
        
        // Redimensionar si es necesario
        if ($width > $maxWidth || $height > $maxHeight) {
            $image->scaleDown($maxWidth, $maxHeight);
        }
        
        // Convertir a JPEG si es necesario para mejor compresión
        $extension = strtolower($file->getClientOriginalExtension());
        if (in_array($extension, ['png', 'gif', 'bmp'])) {
            $image->toJpeg($quality);
            $extension = 'jpg';
        } else {
            $image->toJpeg($quality);
        }
        
        // Generar nombre único
        $filename = uniqid() . '_' . time() . '.' . $extension;
        $path = 'books/optimized/' . $filename;
        
        // Guardar imagen optimizada
        Storage::disk('public')->put($path, $image->encode());
        
        return $path;
    }

    /**
     * Crear thumbnail de una imagen
     */
    public function createThumbnail(UploadedFile $file, int $width = 300, int $height = 300): string
    {
        $image = $this->manager->read($file->getPathname());
        
        // Redimensionar y recortar para crear thumbnail cuadrado
        $image->cover($width, $height);
        
        $filename = 'thumb_' . uniqid() . '_' . time() . '.jpg';
        $path = 'books/thumbnails/' . $filename;
        
        Storage::disk('public')->put($path, $image->toJpeg(80)->encode());
        
        return $path;
    }

    /**
     * Convertir imagen a WebP si es posible
     */
    public function convertToWebP(UploadedFile $file, int $quality = 85): string
    {
        $image = $this->manager->read($file->getPathname());
        
        // Redimensionar si es muy grande
        if ($image->width() > 1920 || $image->height() > 1080) {
            $image->scaleDown(1920, 1080);
        }
        
        $filename = uniqid() . '_' . time() . '.webp';
        $path = 'books/webp/' . $filename;
        
        Storage::disk('public')->put($path, $image->toWebp($quality)->encode());
        
        return $path;
    }

    /**
     * Obtener información de la imagen
     */
    public function getImageInfo(UploadedFile $file): array
    {
        $image = $this->manager->read($file->getPathname());
        
        return [
            'width' => $image->width(),
            'height' => $image->height(),
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'extension' => strtolower($file->getClientOriginalExtension()),
        ];
    }

    /**
     * Validar si la imagen es válida
     */
    public function validateImage(UploadedFile $file): bool
    {
        try {
            $image = $this->manager->read($file->getPathname());
            return $image->width() > 0 && $image->height() > 0;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Limpiar archivos temporales
     */
    public function cleanupTempFiles(): void
    {
        // Eliminar archivos temporales más antiguos de 1 hora
        $tempPath = storage_path('app/temp');
        if (is_dir($tempPath)) {
            $files = glob($tempPath . '/*');
            $oneHourAgo = time() - 3600;
            
            foreach ($files as $file) {
                if (is_file($file) && filemtime($file) < $oneHourAgo) {
                    unlink($file);
                }
            }
        }
    }
} 