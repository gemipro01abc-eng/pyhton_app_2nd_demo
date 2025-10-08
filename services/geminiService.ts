
import { GoogleGenAI, Type } from "@google/genai";
import type { PredictionResult } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // or handle error
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const classifyImage = async (imageFile: File): Promise<PredictionResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not configured. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imagePart = await fileToGenerativePart(imageFile);
  const textPart = {
    text: `Xác định đối tượng chính trong hình ảnh này. Chỉ trả lời bằng một đối tượng JSON có cấu trúc sau: { "object": "tên đối tượng bằng tiếng Việt", "confidence": một số từ 0 đến 1 thể hiện độ tin cậy của bạn }`
  };
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      object: {
        type: Type.STRING,
        description: 'Tên của đối tượng chính được xác định trong hình ảnh, bằng tiếng Việt.',
      },
      confidence: {
        type: Type.NUMBER,
        description: 'Một số từ 0 đến 1 thể hiện mức độ tin cậy của dự đoán.',
      },
    },
    required: ['object', 'confidence'],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (typeof result.object === 'string' && typeof result.confidence === 'number') {
      return result as PredictionResult;
    } else {
      throw new Error('Invalid JSON response format from API.');
    }

  } catch (error) {
    console.error("Error classifying image:", error);
    throw new Error("Không thể phân loại hình ảnh. Vui lòng thử lại.");
  }
};
