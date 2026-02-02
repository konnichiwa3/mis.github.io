export enum Category {
  LIBRARY = 'ห้องสมุดประชาชน',
  SUB_DISTRICT = 'ศกร.ตำบล (ศูนย์ส่งเสริมการเรียนรู้ระดับตำบล)',
  COMMUNITY_LC = 'ศูนย์การเรียนรู้ชุมชน (ศรช.)',
  CO_LEARNING = 'Co-Learning Space',
  WISDOM = 'ภูมิปัญญาท้องถิ่น/ปราชญ์ชาวบ้าน',
  OCCUPATION = 'ศูนย์ฝึกอาชีพ/ผลิตภัณฑ์ชุมชน',
  TOURISM = 'แหล่งท่องเที่ยวเชิงนิเวศ/วัฒนธรรม',
  OTHER = 'แหล่งเรียนรู้อื่นๆ'
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  category: Category;
  coverImage: string;
  images: string[];
  lat: number;
  lng: number;
  address: string;
  subDistrict?: string; // ตำบล
  district?: string; // อำเภอ
  province?: string; // จังหวัด
  contact: string;
  rating: number;
  reviews: Review[];
  visits: number; // For dashboard stats
  ownerName?: string; // New field
  socialMedia?: string; // New field
  youtubeUrl?: string; // New field for YouTube Video
}

// --- New Types for Thai Desserts ---

export interface DessertIngredient {
  name: string;
  amount: string;
}

export interface ThaiDessert {
  id: string;
  // 1. Basic Info
  name: string;
  localName?: string; // ชื่อเรียกในท้องถิ่น
  origin: string; // จังหวัด/แหล่งกำเนิด
  subDistrict?: string; // ตำบล
  district?: string; // อำเภอ
  description: string; // รสชาติ/สัมผัส
  images: {
    main: string;
    process?: string[];
    ingredients?: string[];
  };
  
  // New: Location for Navigation
  lat: number;
  lng: number;
  address?: string;

  // 2. Cultural Context
  history: string;
  beliefs?: string; // ความเชื่อ/พิธีกรรม
  season: string;
  
  // 3. Recipe & Method
  ingredients: DessertIngredient[];
  equipment: string[];
  steps: string[];
  tips?: string; // เคล็ดลับก้นครัว
  
  // 4. Nutrition
  nutrition: {
    calories?: number; // Kcal
    healthNotes?: string; // ข้อควรระวัง/สารอาหาร
  };

  // 5. Social & Reviews
  rating?: number;
  reviews?: Review[];
  youtubeUrl?: string; // New field for YouTube Video
}

export interface StatMetric {
  label: string;
  value: number | string;
  change?: number; // percentage
  icon?: any;
}

export type ViewState = 'DASHBOARD' | 'MAP' | 'LIST' | 'ADMIN' | 'DETAIL' | 'DESSERTS';