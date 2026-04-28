import { useEffect, useState } from "react";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import type { PredictionData } from "../lib/api";
import { getPrediction, getAIInsight } from "../lib/api";

export default function Prediction() {
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 NEW STATES
  const [aiInsight, setAiInsight] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const json = await getPrediction();
        setData(json);
      } catch (err) {
        console.error("Prediction error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, []);

  // 🔥 BUTTON CLICK FUNCTION
  const generateAIInsight = async () => {
    if (!data) return;

    try {
      setAiLoading(true);

      const json = await getAIInsight(data);
      setAiInsight(json.insight || "No insight generated");
    } catch (err) {
      console.error("AI Insight error:", err);
      setAiInsight("Error generating AI insight");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-muted/20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            🍽️ Nutricast AI
          </h1>
          <p className="text-muted-foreground text-lg">
            Smart meal demand predictions powered by AI
          </p>
        </div>

        {loading && (
          <div className="mb-8 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
            Loading Nutricast AI insights...
          </div>
        )}

        {!data && !loading && (
          <div className="mb-8 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
            Failed to load prediction data
          </div>
        )}

        {data && (
          <>
            {/* TOP CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white rounded-xl p-8 border shadow-sm">
                <div className="flex justify-between mb-4">
                  <h3 className="font-semibold">Predicted Demand</h3>
                  <TrendingUp className="text-primary" />
                </div>
                <p className="text-4xl font-bold text-primary">
                  {data.predictedDemand}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Average portions based on history
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border shadow-sm">
                <div className="flex justify-between mb-4">
                  <h3 className="font-semibold">Top Dish</h3>
                  <CheckCircle className="text-secondary" />
                </div>
                <p className="text-3xl font-bold text-secondary capitalize">
                  {data.topDish}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Highest demand item
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border shadow-sm">
                <div className="flex justify-between mb-4">
                  <h3 className="font-semibold">Low Demand Items</h3>
                  <AlertTriangle className="text-orange-500" />
                </div>
                {data.lowDemandDishes.length === 0 ? (
                  <p className="text-green-600 font-semibold">
                    No low demand items
                  </p>
                ) : (
                  data.lowDemandDishes.map((item, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      {item.dish} ({item.quantity})
                    </p>
                  ))
                )}
              </div>
            </div>

            {/* BASIC SUGGESTION */}
            <div className="bg-white rounded-xl p-8 border shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Nutricast Recommendation
              </h2>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium">
                  {data.suggestion}
                </p>
              </div>
            </div>

            {/* 🔥 AI BUTTON */}
            <div className="mb-6">
              <button
                onClick={generateAIInsight}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
                disabled={aiLoading}
              >
                {aiLoading ? "Generating AI Insight..." : "✨ Generate AI Insight"}
              </button>
            </div>

            {/* 🔥 AI INSIGHT SECTION */}
            {aiInsight && (
              <div className="bg-white rounded-xl p-8 border shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-purple-500" />
                  <h2 className="text-2xl font-bold">
                    Nutricast AI Insight
                  </h2>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-purple-900 leading-relaxed">
                    {aiInsight}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}