import { feedbackItems, menuItems } from "../data/mockData";

export function getNutriCastInsights() {
  const lowSellingFoods = menuItems
    .filter((item) => item.quantityConsumed < item.quantityPrepared * 0.7)
    .map((item) => ({
      dishName: item.dishName,
      wastage: item.quantityPrepared - item.quantityConsumed,
      suggestion: `Reduce ${item.dishName} preparation by 20-30%`,
    }));

  const dishRatings: Record<string, number[]> = {};

  for (const feedback of feedbackItems) {
    if (!dishRatings[feedback.dishName]) {
      dishRatings[feedback.dishName] = [];
    }
    dishRatings[feedback.dishName].push(feedback.rating);
  }

  const popularDishes = Object.entries(dishRatings)
    .map(([dishName, ratings]) => ({
      dishName,
      avgRating:
        ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
    }))
    .filter((dish) => dish.avgRating >= 4);

  return {
    lowSellingFoods,
    popularDishes,
    message: "NutriCast analyzed meal trends successfully",
  };
}