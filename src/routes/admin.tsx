import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useKisanQueue } from "@/lib/store";
import { DemoHeader } from "@/components/common/DemoHeader";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { NotificationDrawer } from "@/components/common/NotificationDrawer";
import { AuthModal } from "@/components/auth/AuthModal";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "KisanQueue — Government Admin & Directorate Center" },
      {
        name: "description",
        content: "Central command dashboard for multi-centre monitoring, Recharts visual analytics, AI bottleneck detection, and reports.",
      },
    ],
  }),
  component: AdminRouteComponent,
});

function AdminRouteComponent() {
  const { setRole, largeText, highContrast } = useKisanQueue();
  const [authOpen, setAuthOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    setRole("admin");
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
        <AdminDashboard />
      </main>

      <NotificationDrawer open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
