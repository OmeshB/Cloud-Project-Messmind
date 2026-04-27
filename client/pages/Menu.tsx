import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import type { MenuItem } from "../lib/api";
import { addMenu, getMenu } from "../lib/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
console.log("API URL:", import.meta.env.VITE_API_BASE_URL);

export default function Menu() {
  const [formData, setFormData] = useState({
    mealType: "breakfast",
    dishName: "",
    quantity: "",
    date: "",
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      let uploadedImageUrl = "";

      // Upload image
      if (file) {
        const formDataImg = new FormData();
        formDataImg.append("image", file);

        const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formDataImg,
      });

        const data = await res.json();
        uploadedImageUrl = data.imageUrl;
        setImageUrl(uploadedImageUrl);
      }

      // Add menu item
      await addMenu({
      date: formData.date,
      mealType: formData.mealType,
      dishName: formData.dishName,
      quantityPrepared: formData.quantity,
      imageUrl: uploadedImageUrl,   // ✅ NOW VALID
    });

      alert("Menu item added successfully!");

      setFormData({
        mealType: "breakfast",
        dishName: "",
        quantity: "",
        date: "",
      });

      setFile(null);
      fetchMenuItems();
    } catch (error) {
      console.error("Error:", error);
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

            {/* Meal Type */}
            <div>
              <label className="block text-sm font-semibold mb-3">Meal Type</label>
              <select
                name="mealType"
                value={formData.mealType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            {/* Dish Name */}
            <div>
              <label className="block text-sm font-semibold mb-3">Dish Name</label>
              <input
                type="text"
                name="dishName"
                value={formData.dishName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border"
                required
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold mb-3">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold mb-3">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border"
                required
              />
            </div>

            {/* 🔥 Upload Image (FIXED POSITION) */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 text-white rounded-lg"
            >
              {loading ? "Adding..." : "Add Menu Item"}
            </button>
          </form>

          {/* Show Image */}
          {imageUrl && (
            <div className="mt-4">
              <img src={imageUrl} className="w-40 rounded-lg" />
            </div>
          )}
        </div>

        {/* Menu List */}
        <div className="mt-12 bg-white rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Recent Menu Items</h2>

          {menuItems.map((item) => (
          <div key={item.Id} className="p-3 border mb-2 rounded">
            <div>{item.DishName} ({item.QuantityPrepared})</div>

            {item.imageUrl && (
              <img src={item.imageUrl} className="w-24 mt-2 rounded" />
            )}
          </div>
        ))}
        </div>
      </main>
    </div>
  );
}