// 🔥 FIX: Add your deployed backend URL as fallback
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://messmind-app-cqb9gkagg7exgrcf.centralindia-01.azurewebsites.net";

// 🔧 Generic API handler
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

// 📊 TYPES
export type PredictionData = {
  predictedDemand: number;
  topDish: string;
  lowDemandDishes: { dish: string; quantity: number }[];
  suggestion: string;
  aiInsight?: string;
};

export type MenuItem = {
  Id: number;
  MealDate: string;
  MealType: string;
  DishName: string;
  imageUrl?: string;
  QuantityPrepared: number;
};

export type FeedbackItem = {
  Id: number;
  StudentName: string;
  DishName: string;
  Rating: number;
  Comment: string;
  CreatedAt: string;
};

export type DashboardData = {
  totalPrepared: number;
  totalFeedback: number;
  averageRating: string;
  popularMeal: string;
  alerts: string[];
};

// ✅ API CALLS

export async function getPrediction() {
  return apiRequest<PredictionData>("/api/prediction");
}

export async function getMenu() {
  return apiRequest<MenuItem[]>("/api/menu");
}

export async function addMenu(payload: {
  date: string;
  mealType: string;
  dishName: string;
  quantityPrepared: string;
  imageUrl?: string;
}) {
  return apiRequest("/api/menu", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getFeedback() {
  return apiRequest<FeedbackItem[]>("/api/feedback");
}

export async function addFeedback(payload: {
  studentName: string;
  dishName: string;
  rating: number;
  comment: string;
}) {
  return apiRequest("/api/feedback", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getDashboard() {
  return apiRequest<DashboardData>("/api/dashboard");
}

// 🔥 NEW: AI INSIGHT CALL (YOU WERE MISSING THIS)
export async function getAIInsight(data: any) {
  return apiRequest<{ insight: string }>("/api/prediction/ai-insight", {
    method: "POST",
    body: JSON.stringify(data),
  });
}