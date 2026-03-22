export type MenuItem = {
  id: number;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner";
  dishName: string;
  quantityPrepared: number;
  quantityConsumed: number;
};

export type FeedbackItem = {
  id: number;
  studentName: string;
  dishName: string;
  rating: number;
  comment: string;
};

export const menuItems: MenuItem[] = [
  {
    id: 1,
    date: "2026-03-16",
    mealType: "breakfast",
    dishName: "Idli",
    quantityPrepared: 200,
    quantityConsumed: 180,
  },
  {
    id: 2,
    date: "2026-03-16",
    mealType: "lunch",
    dishName: "Lemon Rice",
    quantityPrepared: 250,
    quantityConsumed: 140,
  },
  {
    id: 3,
    date: "2026-03-16",
    mealType: "dinner",
    dishName: "Paneer Curry",
    quantityPrepared: 220,
    quantityConsumed: 210,
  },
];

export const feedbackItems: FeedbackItem[] = [
  {
    id: 1,
    studentName: "Asha",
    dishName: "Idli",
    rating: 4,
    comment: "Soft and good",
  },
  {
    id: 2,
    studentName: "Rahul",
    dishName: "Lemon Rice",
    rating: 2,
    comment: "Too sour",
  },
  {
    id: 3,
    studentName: "Meena",
    dishName: "Paneer Curry",
    rating: 5,
    comment: "Very tasty",
  },
];