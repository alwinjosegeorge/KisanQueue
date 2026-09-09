import React from "react";
import { useKisanQueue } from "@/lib/store";
import { Role, Language } from "@/lib/types";
import { Bell, Globe, Sparkles, Type } from "lucide-react";
import { useNavigate, useLocation } from "@tanstack/react-router";

export function DemoHeader({ onOpenNotifications, onOpenAuth }: { onOpenNotifications: () => void; onOpenAuth: () => void }) {
  const { role, setRole, language, setLanguage, largeText, setLargeText, notifications } = useKisanQueue();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;
  const isStaff = pathname === "/staff" || (pathname !== "/" && pathname !== "/admin" && role === "staff");
  const isAdmin = pathname === "/admin" || (pathname !== "/" && pathname !== "/staff" && role === "admin");
  const isFarmer = !isStaff && !isAdmin;

  const handleRoleSelect = (targetRole: Role) => {
    setRole(targetRole);
    if (targetRole === "staff") {
      navigate({ to: "/staff" });
    } else if (targetRole === "admin") {
      navigate({ to: "/admin" });
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-2 border-b border-border/70 bg-card/90 px-4 py-2.5 backdrop-blur-md">
      {/* Role Switcher Pill for SIH Judges */}
      <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 p-1 shadow-sm">
        <span className="hidden px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:inline-flex items-center gap-1">
          <Sparkles className="size-3 text-secondary" /> SIH Demo:
        </span>
        <button
          type="button"
          onClick={() => handleRoleSelect("farmer")}
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
            isFarmer
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>👨‍🌾</span> <span>Farmer</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect("staff")}
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
            isStaff
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>🏢</span> <span>Staff</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect("admin")}
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
            isAdmin
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>🧑‍💼</span> <span>Admin</span>
        </button>
      </div>

      {/* Language & Utilities */}
      <div className="flex items-center gap-2">
        {/* Language Selector */}
        <div className="flex items-center rounded-full border border-border/70 bg-background/80 px-1 py-0.5 text-xs">
          <Globe className="ml-1.5 size-3.5 text-muted-foreground" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            aria-label="Select language"
            className="cursor-pointer bg-transparent py-1 pl-1.5 pr-2 font-medium text-foreground outline-none"
          >
            <option value="en">English</option>
            <option value="ml">മലയാളം</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>

        {/* Accessibility Toggle: Large Text */}
        <button
          type="button"
          onClick={() => setLargeText((p) => !p)}
          title="Toggle Large Text (Accessibility)"
          aria-label="Toggle Large Text"
          className={`flex size-8 items-center justify-center rounded-full border transition-colors ${
            largeText ? "border-primary bg-primary/15 text-primary" : "border-border/70 bg-background/80 text-muted-foreground"
          }`}
        >
          <Type className="size-4" />
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative flex size-8 items-center justify-center rounded-full border border-border/70 bg-background/80 text-foreground transition-colors hover:bg-muted/60"
          title="Notifications & Live Alerts"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Login/Role Badge */}
        <button
          type="button"
          onClick={onOpenAuth}
          className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted/60"
        >
          {role === "farmer" ? "ID: 26047" : role === "staff" ? "Staff Gate-B" : "Govt Admin"}
        </button>
      </div>
    </header>
  );
}
