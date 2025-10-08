
import React from 'react';
import Spinner from './Spinner';
import type { PredictionResult } from '../types';

interface ResultDisplayProps {
  prediction: PredictionResult | null;
  isLoading: boolean;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ prediction, isLoading, error }) => {
  const confidencePercentage = prediction ? Math.round(prediction.confidence * 100) : 0;
  
  const getConfidenceColor = (percentage: number) => {
    if (percentage > 75) return 'bg-green-500';
    if (percentage > 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Spinner />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Đang phân tích hình ảnh...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="font-semibold text-red-700 dark:text-red-300">Đã xảy ra lỗi</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{error}</p>
        </div>
      );
    }
    
    if (prediction) {
      return (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Kết quả dự đoán</h3>
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Đối tượng</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 capitalize">{prediction.object}</p>
          </div>
          <div className="mt-4">
             <p className="text-sm text-gray-500 dark:text-gray-400">Độ chính xác</p>
             <div className="flex items-center mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                    <div 
                        className={`h-4 rounded-full transition-all duration-500 ease-out ${getConfidenceColor(confidencePercentage)}`}
                        style={{ width: `${confidencePercentage}%` }}
                    ></div>
                </div>
                <span className="ml-4 font-semibold text-gray-700 dark:text-gray-200">{confidencePercentage}%</span>
             </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <p className="font-semibold text-gray-700 dark:text-gray-200">Chưa có kết quả</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tải lên một hình ảnh và nhấn "Phân loại" để bắt đầu.</p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-80">
      {renderContent()}
    </div>
  );
};

export default ResultDisplay;
