import { useState } from "react";
import { Send, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import { addFeedback } from "../lib/api";

export default function Feedback() {
  const [formData, setFormData] = useState({
    meal: "",
    rating: 5,
    comment: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addFeedback({
        studentName: "Anonymous",
        dishName: formData.meal,
        rating: formData.rating,
        comment: formData.comment,
      });

      setSubmitted(true);

      setFormData({
        meal: "",
        rating: 5,
        comment: "",
      });

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Error submitting feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-muted/20">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Feedback</h1>
          <p className="text-muted-foreground text-lg">
            Help us improve by sharing your meal experience
          </p>
        </div>

        {submitted && (
          <div className="mb-8 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
            <p className="font-semibold">Feedback saved to database! 🎉</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-border/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Which meal are you providing feedback for?
              </label>
              <select
                name="meal"
                value={formData.meal}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-white"
                required
              >
                <option value="">Select a meal...</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-4">
                How would you rate this meal?
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, rating: star }))
                    }
                    className={`p-2 rounded-lg ${
                      star <= formData.rating
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= formData.rating ? "fill-current" : ""
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Your Comments
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border"
                rows={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-secondary to-secondary/80 text-white font-semibold rounded-xl"
            >
              <Send className="w-5 h-5 inline mr-2" />
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}