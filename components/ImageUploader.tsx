
import React, { useRef, useState, useCallback } from 'react';
import { ImageIcon } from './icons';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  imageUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect, imageUrl }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileSelect(event.target.files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUploaderClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors duration-300 ease-in-out cursor-pointer h-80 flex items-center justify-center ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50 dark:bg-gray-700'
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleUploaderClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".jpg,.jpeg,.png"
          onChange={handleFileChange}
        />
        {imageUrl ? (
          <img src={imageUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
        ) : (
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">Tải lên một tệp</span> hoặc kéo và thả
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, JPEG</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
