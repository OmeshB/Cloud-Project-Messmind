const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
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

export type PredictionData = {
  predictedDemand: number;
  topDish: string;
  lowDemandDishes: { dish: string; quantity: number }[];
  suggestion: string;
};

export type MenuItem = {
  Id: number;
  MealDate: string;
  MealType: string;
  DishName: string;
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