import { useEffect, useState } from "react";
import { TrendingUp, AlertCircle, Users, Utensils, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import type { DashboardData, FeedbackItem, MenuItem } from "../lib/api";
import { getDashboard, getFeedback, getMenu, getPrediction } from "../lib/api";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [aiInsight, setAiInsight] = useState<string>(""); // ✅ NEW
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [dashboardJson, menuJson, feedbackJson, predictionJson] = await Promise.all([
        getDashboard(),
        getMenu(),
        getFeedback(),
        getPrediction(), // ✅ NEW
      ]);

      setDashboardData(dashboardJson);
      setMenuItems(Array.isArray(menuJson) ? menuJson : []);
      setFeedbackItems(Array.isArray(feedbackJson) ? feedbackJson : []);

      // ✅ AI Insight set
      setAiInsight(predictionJson.aiInsight || "");
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const recentMenuItems = [...menuItems].slice(0, 5);

  const feedbackSummaryMap: Record<string, { totalRating: number; count: number }> = {};
  feedbackItems.forEach((item) => {
    const meal = item.DishName;
    if (!feedbackSummaryMap[meal]) {
      feedbackSummaryMap[meal] = { totalRating: 0, count: 0 };
    }
    feedbackSummaryMap[meal].totalRating += Number(item.Rating || 0);
    feedbackSummaryMap[meal].count += 1;
  });

  const todayFeedbackSummary = Object.entries(feedbackSummaryMap)
    .map(([meal, value]) => ({
      meal,
      rating: (value.totalRating / value.count).toFixed(1),
      count: value.count,
    }))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-muted/20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Live overview from your Azure SQL data
          </p>
        </div>

        {loading && (
          <div className="mb-8 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
            Loading dashboard data...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* cards unchanged */}
          <div className="bg-white rounded-xl shadow-sm border border-border/50 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-2">
                  Total Portions Planned
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {dashboardData?.totalPrepared || 0}
                </p>
                <p className="text-xs text-secondary mt-1">
                  Based on all menu entries
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-border/50 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-2">
                  Most Planned Dish
                </p>
                <p className="text-2xl font-bold text-foreground break-words">
                  {dashboardData?.popularMeal || "No data"}
                </p>
                <p className="text-xs text-primary mt-1">From menu data</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Utensils className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-border/50 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-2">
                  Avg Feedback Rating
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {dashboardData?.averageRating || "0.0"}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  From {dashboardData?.totalFeedback || 0} responses
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-border/50 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-2">
                  Active Alerts
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {dashboardData?.alerts?.length || 0}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  NutriCast basic insights
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 UPDATED ALERT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-border/50 p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              NutriCast Alerts
            </h2>

            <div className="space-y-4">
              {/* ✅ AI Insight FIRST */}
              {aiInsight && (
                <div className="flex items-start gap-4 p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-purple-900">
                      NutriCast AI Insight
                    </p>
                    <p className="text-purple-800 text-sm mt-1 whitespace-pre-line">
                      {aiInsight}
                    </p>
                  </div>
                </div>
              )}

              {/* EXISTING ALERTS */}
              {!dashboardData?.alerts || dashboardData.alerts.length === 0 ? (
                <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50 border border-green-200">
                  <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900">
                      All Looks Healthy
                    </p>
                    <p className="text-green-800 text-sm mt-1">
                      No major alerts right now. Menu and feedback look stable.
                    </p>
                  </div>
                </div>
              ) : (
                dashboardData.alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg bg-orange-50 border border-orange-200"
                  >
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-orange-900">
                        Insight {index + 1}
                      </p>
                      <p className="text-orange-800 text-sm mt-1">{alert}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* FEEDBACK SNAPSHOT (unchanged) */}
          <div className="bg-white rounded-xl shadow-sm border border-border/50 p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Feedback Snapshot
            </h2>

            <div className="space-y-4">
              {todayFeedbackSummary.length === 0 ? (
                <p className="text-muted-foreground">No feedback data available yet.</p>
              ) : (
                todayFeedbackSummary.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-muted/30 border border-border/30"
                  >
                    <p className="font-semibold text-foreground mb-2 capitalize">
                      {item.meal}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 fill-accent text-accent-foreground" />
                      <span className="font-bold text-foreground">{item.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.count} responses
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}