"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer state update to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 p-1 rounded-lg border bg-muted/50 w-[100px]">
        <div className="flex-1 flex items-center justify-center py-1.5">
          <Sun className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 flex items-center justify-center py-1.5">
          <Moon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg border bg-muted/50 w-[100px] relative">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          "flex-1 flex items-center justify-center py-1.5 rounded-md transition-all relative z-10 min-h-[36px]",
          !isDark && "bg-background shadow-sm"
        )}
        aria-label="Light theme"
      >
        <Sun
          className={cn(
            "h-4 w-4 transition-colors",
            !isDark ? "text-primary" : "text-muted-foreground"
          )}
        />
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          "flex-1 flex items-center justify-center py-1.5 rounded-md transition-all relative z-10 min-h-[36px]",
          isDark && "bg-background shadow-sm"
        )}
        aria-label="Dark theme"
      >
        <Moon
          className={cn(
            "h-4 w-4 transition-colors",
            isDark ? "text-primary" : "text-muted-foreground"
          )}
        />
      </button>
    </div>
  );
}
