import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useKisanQueue } from "@/lib/store";
import { StaffDashboard } from "@/components/staff/StaffDashboard";
import { NotificationDrawer } from "@/components/common/NotificationDrawer";
import { AuthModal } from "@/components/auth/AuthModal";
import { Building2, Bell, Leaf, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "KisanQueue — Procurement Centre Staff Console" },
      {
        name: "description",
        content: "Operational staff dashboard for live queue advancement, farmer verification, and delay reporting.",
      },
    ],
  }),
  component: StaffRouteComponent,
});

function StaffRouteComponent() {
  const { setRole, largeText, highContrast, notifications } = useKisanQueue();
  const [authOpen, setAuthOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    setRole("staff");
  }, [setRole]);

  return (
    <div
      className={`min-h-screen flex flex-col bg-background text-foreground ${
        largeText ? "text-lg" : ""
      } ${highContrast ? "contrast-125" : ""}`}
    >
      {/* Official Standard Staff Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-2 hover:opacity-85 transition-opacity"
            title="Return to Farmer Portal"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-sm">
              <Leaf className="size-5" />
            </span>
            <div className="text-left">
              <span className="font-display text-lg font-bold tracking-tight text-foreground block leading-tight">
                KisanQueue
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                Staff Portal
              </span>
            </div>
          </button>

          <div className="hidden h-5 w-px bg-border md:block" />

          <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 md:inline-flex">
            <Building2 className="size-3.5" /> Kottayam Centre • Counter 1
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate({ to: "/" })}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            👨‍🌾 Farmer View
          </button>
          <button
            onClick={() => navigate({ to: "/admin" })}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            🧑‍💼 Admin Center
          </button>
          <button
            onClick={() => setNotificationsOpen(true)}
            className="relative flex size-9 items-center justify-center rounded-xl border border-border bg-background text-foreground hover:bg-muted transition-colors"
            title="Notifications"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1">
        <StaffDashboard />
      </main>

      <NotificationDrawer open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
