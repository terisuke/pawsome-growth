
export interface Dog {
  id: string;
  name: string;
  breed: string;
  image: string; // Maps from image_url
  birthday: string;
  ownerId?: string; // Maps from owner_id
}

export interface WeightLog {
  id: string;
  dogId: string; // Maps from dog_id
  date: string;
  weight: number;
}

export interface FoodLog {
  id: string;
  dogId: string; // Maps from dog_id
  date: string;
  amount: number; // in grams
  memo?: string;
}

export interface Diary {
  id: string;
  dogId: string;
  date: string;
  title: string;
  content: string;
}

export interface HealthData {
  weightLogs: WeightLog[];
  foodLogs: FoodLog[];
  diaries: Diary[];
}
