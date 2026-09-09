import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useKisanQueue } from "@/lib/store";
import { DemoHeader } from "@/components/common/DemoHeader";
import { StaffDashboard } from "@/components/staff/StaffDashboard";
import { NotificationDrawer } from "@/components/common/NotificationDrawer";
import { AuthModal } from "@/components/auth/AuthModal";

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
  const { setRole, largeText, highContrast } = useKisanQueue();
  const [authOpen, setAuthOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    setRole("staff");
  }, [setRole]);

  return (
    <div
      className={`min-h-screen flex flex-col bg-background text-foreground ${
        largeText ? "text-lg" : ""
      } ${highContrast ? "contrast-125" : ""}`}
    >
      <DemoHeader
        onOpenAuth={() => setAuthOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
      />

      <main className="flex-1">
        <StaffDashboard />
      </main>

      <NotificationDrawer open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
