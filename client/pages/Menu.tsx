import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import type { MenuItem } from "../lib/api";
import { addMenu, getMenu } from "../lib/api";

export default function Menu() {
  const [formData, setFormData] = useState({
    mealType: "breakfast",
    dishName: "",
    quantity: "",
    date: "",
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMenuItems = async () => {
    try {
      const data = await getMenu();
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addMenu({
        date: formData.date,
        mealType: formData.mealType,
        dishName: formData.dishName,
        quantityPrepared: formData.quantity,
      });

      alert("Menu item added successfully!");

      setFormData({
        mealType: "breakfast",
        dishName: "",
        quantity: "",
        date: "",
      });

      fetchMenuItems();
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("Error adding menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-muted/20">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Manage Menu</h1>
          <p className="text-muted-foreground text-lg">
            Add or update meal items for your mess
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Meal Type
              </label>
              <select
                name="mealType"
                value={formData.mealType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Dish Name
              </label>
              <input
                type="text"
                name="dishName"
                value={formData.dishName}
                onChange={handleChange}
                placeholder="e.g., Biryani, Dosa, Samosa"
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Expected Quantity (portions)
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g., 250"
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-primary to-primary/80 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? "Adding..." : "Add Menu Item"}
            </button>
          </form>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-sm border border-border/50 p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Recent Menu Items</h2>

          <div className="space-y-4">
            {menuItems.length === 0 ? (
              <p className="text-muted-foreground">No menu items found.</p>
            ) : (
              menuItems.map((item) => (
                <div
                  key={item.Id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30"
                >
                  <div>
                    <p className="font-semibold text-foreground">{item.DishName}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.MealType} • {item.MealDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      {item.QuantityPrepared}
                    </p>
                    <p className="text-xs text-muted-foreground">portions</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
