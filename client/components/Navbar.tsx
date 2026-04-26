import { Link } from "react-router-dom";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">MessMind</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
          >
            Home
          </Link>

          <Link
            to="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
          >
            Dashboard
          </Link>

          <Link
            to="/menu"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
          >
            Menu
          </Link>

          <Link
            to="/feedback"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
          >
            Feedback
          </Link>

          {/* 🔥 ADD THIS */}
          <Link
            to="/prediction"
            className="text-sm font-semibold text-primary hover:text-primary/80 transition"
          >
            Nutricast AI
          </Link>
        </div>

        {/* Mobile menu indicator */}
        <div className="md:hidden text-sm font-medium text-primary">Menu</div>
      </div>
    </nav>
  );
}