'use client';
import { useCallback, useState, useEffect, useRef } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { FiFile, FiImage, FiFileText, FiTrash2 } from 'react-icons/fi';

export function DragAndDrop({
  onDrop,
  accept,
  maxSize = 10240, // 10MB em KB
  label = 'Arraste e solte arquivos aqui',
  helperText,
  error,
  disabled = false,
  className = '',
  value = null, // Valor inicial
  onChange // Callback para mudanças
}) {
  const fileInputRef = useRef(null);
  const { settings } = useSettings();
  const theme = settings?.company?.settings?.theme;
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);

  // Função para gerar preview e info do arquivo
  const processFile = useCallback((file) => {
    if (!file) {
      setPreview(null);
      setFileInfo(null);
      return;
    }

    // Informações do arquivo
    setFileInfo({
      name: file.name,
      size: (file.size / 1024).toFixed(2), // Tamanho em KB
      type: file.type
    });

    // Gerar preview para imagens
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, []);

  // Carregar valor inicial
  useEffect(() => {
    if (value instanceof File) {
      processFile(value);
    } else if (typeof value === 'string' && value) {
      setPreview(value);
      setFileInfo({
        name: value.split('/').pop(),
        type: value.match(/\.(jpg|jpeg|png|gif|ico)$/i) ? 'image' : 'file'
      });
    }
  }, [value, processFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelection = useCallback((files) => {
    if (disabled) return;

    const file = files[0];
    
    if (!file) return;

    // Verifica o tipo de arquivo
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      if (!acceptedTypes.some(type => file.type.match(type))) {
        console.error('Tipo de arquivo não permitido');
        return;
      }
    }

    // Verifica o tamanho
    if (Math.round(file.size / 1024) > maxSize) {
      console.error(`Arquivo muito grande. Máximo permitido: ${maxSize}KB`);
      return;
    }

    processFile(file);
    if (onDrop) onDrop([file]);
    if (onChange) onChange(file);
  }, [accept, maxSize, onDrop, onChange, disabled, processFile]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelection(Array.from(e.dataTransfer.files));
  }, [handleFileSelection]);

  const handleInputChange = (e) => {
    handleFileSelection(Array.from(e.target.files));
  };

  const handleClear = () => {
    setPreview(null);
    setFileInfo(null);
    if (onChange) onChange(null);
  };

  const renderFileIcon = () => {
    if (!fileInfo) return null;
    
    if (fileInfo.type.startsWith('image/') || fileInfo.type === 'image') {
      return <FiImage className="w-8 h-8" />;
    }
    if (fileInfo.type.includes('text')) {
      return <FiFileText className="w-8 h-8" />;
    }
    return <FiFile className="w-8 h-8" />;
  };

  // Função para lidar com o clique na área do componente
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={className}>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging 
            ? 'border-primary bg-primary/10' 
            : 'border-gray-300 dark:border-gray-600'
          }
          ${disabled 
            ? 'bg-gray-100 cursor-not-allowed opacity-60 dark:bg-gray-800' 
            : 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-500'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleInputChange}
          accept={accept}
          className="hidden"
          disabled={disabled}
        />

        {fileInfo ? (
          <div className="space-y-4" onClick={e => e.stopPropagation()}>
            {preview ? (
              <img 
                src={preview} 
                alt={fileInfo.name}
                className="max-w-[200px] max-h-[200px] mx-auto object-contain"
              />
            ) : (
              <div className="flex justify-center">
                {renderFileIcon()}
              </div>
            )}
            
            <div className="text-sm">
              <p className="font-medium text-gray-700 dark:text-gray-300">{fileInfo.name}</p>
              {fileInfo.size && (
                <p className="text-gray-500 dark:text-gray-400">{fileInfo.size}KB</p>
              )}
            </div>

            {!disabled && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="absolute top-2 right-2 p-2 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Remover arquivo"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-gray-700 dark:text-gray-300">{label}</p>
            {helperText && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 