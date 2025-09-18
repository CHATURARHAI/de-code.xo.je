import * as React from "react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

interface BottomNavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  to: string;
}

interface BottomNavProps {
  items: BottomNavItem[];
  className?: string;
}

export const BottomNav = ({ items, className }: BottomNavProps) => {
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border",
        "flex items-center justify-around py-2 px-4",
        "md:hidden", // Hide on larger screens
        className
      )}
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200",
              "min-w-[60px] text-xs font-medium",
              isActive
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                className={cn(
                  "h-6 w-6 mb-1 transition-all duration-200",
                  isActive ? "text-primary scale-110" : "text-muted-foreground"
                )}
              />
              <span className="text-xs">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};