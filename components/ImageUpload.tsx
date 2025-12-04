import React, { useState, useRef, useCallback } from 'react';
import { ArrowUpTrayIcon } from './icons/ArrowUpTrayIcon';
import { XMarkIcon } from './icons/XMarkIcon';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const dataUrl = await fileToDataUrl(file);
      onChange(dataUrl);
    }
  }, [onChange]);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };
  
  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    onChange('');
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={onFileInputChange}
        className="hidden"
      />
      {value ? (
        <div className="relative group">
          <img src={value} alt="Preview" className="w-full h-48 object-cover rounded-md" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove image"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div
          onClick={openFileDialog}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors
            ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'}`}
        >
          <div className="flex flex-col items-center justify-center space-y-2 text-gray-500 dark:text-gray-400">
            <ArrowUpTrayIcon className="w-10 h-10" />
            <p className="text-sm">
              <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;