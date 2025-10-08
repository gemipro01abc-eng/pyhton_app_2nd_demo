
import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import { classifyImage } from './services/geminiService';
import type { PredictionResult } from './types';

function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    // Basic validation for file type
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!acceptedTypes.includes(file.type)) {
      setError('Định dạng tệp không hợp lệ. Vui lòng chọn tệp .jpg, .jpeg, hoặc .png.');
      return;
    }

    // Basic validation for file size (e.g., 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Kích thước tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 10MB.');
      return;
    }
    
    setError(null);
    setPrediction(null);
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
  }, []);

  const handleClassify = useCallback(async () => {
    if (!imageFile) {
      setError("Vui lòng tải lên một hình ảnh trước.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const result = await classifyImage(imageFile);
      setPrediction(result);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi không xác định.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-gray-800 dark:text-gray-200">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Hệ thống Phân loại Hình ảnh</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Tải lên hình ảnh để Gemini AI phân tích</p>
      </div>

      <div className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-800/50 rounded-xl shadow-2xl p-8 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <ImageUploader onFileSelect={handleFileSelect} imageUrl={imageUrl} />
          <ResultDisplay prediction={prediction} isLoading={isLoading} error={error} />
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={handleClassify}
            disabled={!imageFile || isLoading}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 ease-in-out"
          >
            {isLoading ? 'Đang xử lý...' : 'Phân loại Hình ảnh'}
          </button>
        </div>
      </div>
       <footer className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm">
            <p>Phát triển với React, Tailwind CSS, và Gemini API.</p>
        </footer>
    </div>
  );
}

export default App;
