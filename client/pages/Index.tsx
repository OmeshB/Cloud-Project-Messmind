import { Link } from "react-router-dom";
import { Brain, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-4">
            MessMind
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl text-muted-foreground mb-12 font-medium">
            Smart Mess Management with NutriCast AI
          </p>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Optimize your mess operations with AI-powered predictions. Reduce waste, manage student expectations, and make data-driven decisions for better food management.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105 text-lg"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={() => alert("Login functionality coming soon!")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 transition-all text-lg"
            >
              <span>Login</span>
            </button>
          </div>

          {/* Features preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20">
            <div className="p-6 rounded-xl bg-muted/30 border border-border/50">
              <div className="text-3xl font-bold text-primary mb-2">AI-Powered</div>
              <p className="text-muted-foreground">Smart predictions using NutriCast</p>
            </div>
            <div className="p-6 rounded-xl bg-muted/30 border border-border/50">
              <div className="text-3xl font-bold text-secondary mb-2">Real-time</div>
              <p className="text-muted-foreground">Live menu & waste tracking</p>
            </div>
            <div className="p-6 rounded-xl bg-muted/30 border border-border/50">
              <div className="text-3xl font-bold text-accent mb-2">Insights</div>
              <p className="text-muted-foreground">Data-driven decisions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} MessMind. Smart Mess Management with NutriCast AI.</p>
        </div>
      </footer>
    </div>
  );
}
