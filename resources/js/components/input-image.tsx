import React, { useRef } from 'react';

interface FileInputProps {
  label?: string;
  accept?: string; // Ejemplo: "image/*" o ".pdf,.docx"
  multiple?: boolean;
  value?: File[]; // Para mostrar previews si lo deseas
  onChange: (files: FileList | null) => void;
  preview?: boolean; // Si quieres mostrar preview de imágenes
  className?: string;
}

export const FileInput: React.FC<FileInputProps> = ({
  label,
  accept = '',
  multiple = false,
  value,
  onChange,
  preview = false,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files);
  };

  return (
    <div className={className}>
      {label && <label className="block mb-1 font-medium text-card-foreground dark:text-card-foreground">{label}</label>}
      <div
        className="flex items-center space-x-2"
        onClick={() => inputRef.current?.click()}
        style={{ cursor: 'pointer' }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
        <button
          type="button"
          className="px-3 py-2 border border-input dark:border-input rounded bg-gray-100 dark:bg-muted hover:bg-gray-200 dark:hover:bg-muted/80 text-foreground dark:text-foreground"
        >
          Seleccionar archivo{multiple ? 's' : ''}
        </button>
        {value && value.length > 0 && (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {value.map(file => file.name).join(', ')}
          </span>
        )}
      </div>
      {preview && value && value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {Array.from(value).map((file, idx) =>
            file.type.startsWith('image/') ? (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-20 h-20 object-cover rounded border border-input dark:border-input bg-white dark:bg-background"
                onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
              />
            ) : (
              <span key={idx} className="text-xs text-gray-500 dark:text-gray-400">
                {file.name}
              </span>
            )
          )}
        </div>
      )}
    </div>
  )


};

{/* Ejemplo de uso para imágenes:


<FileInput
  label="Imágenes del libro"
  accept="image/*"
  multiple
  value={files}
  onChange={fl => setFiles(fl ? Array.from(fl) : [])}
  preview
/>

{/* Ejemplo de uso para documentos:
<FileInput
  label="Adjuntar documento"
  accept=".pdf,.docx"
onChange={fl => { /* lógica para manejar archivos 
*/}