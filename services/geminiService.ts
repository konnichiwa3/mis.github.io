import { GoogleGenAI } from "@google/genai";
import { Place } from '../types';

// Declare process to ensure TypeScript compatibility without @types/node
declare const process: {
  env: {
    API_KEY?: string;
  }
};

export const getGeminiRecommendation = async (places: Place[], userQuery: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "ไม่พบ API Key (กรุณาตั้งค่า process.env.API_KEY)";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const placesContext = places.map(p => 
      `- ${p.name} (${p.category}): ${p.description}, เรตติ้ง ${p.rating}`
    ).join('\n');

    const prompt = `
      คุณคือผู้เชี่ยวชาญด้านการท่องเที่ยวและวัฒนธรรมท้องถิ่น (Local Guide AI)
      
      นี่คือรายชื่อสถานที่ในชุมชนของเรา:
      ${placesContext}

      คำถามจากผู้ใช้: "${userQuery}"

      กรุณาแนะนำสถานที่ที่เหมาะสมจากรายการข้างต้น พร้อมเหตุผลประกอบสั้นๆ และแนะนำเส้นทางการเที่ยวถ้าเป็นไปได้ ตอบเป็นภาษาไทย น้ำเสียงเป็นมิตรและเป็นทางการเล็กน้อย
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "ขออภัย ไม่สามารถสร้างคำแนะนำได้ในขณะนี้";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI";
  }
};

export const analyzePlaceReviews = async (placeName: string, reviews: string[]): Promise<string> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey || reviews.length === 0) return "ไม่มีข้อมูลรีวิวเพียงพอสำหรับวิเคราะห์";

    const prompt = `
      วิเคราะห์รีวิวของสถานที่ "${placeName}" ต่อไปนี้:
      ${reviews.map(r => `- "${r}"`).join('\n')}

      สรุปจุดเด่นและจุดที่ควรปรับปรุงสั้นๆ 1 ย่อหน้า
    `;
    
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "";
    } catch (e) {
        return "";
    }
}