import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  UsersRound,
  PackageCheck,
  IndianRupee,
  UserRound,
  Leaf,
  Sprout,
  Languages,
  CircleHelp,
  Phone,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Settings2,
  Sliders,
  LogOut,
  Sparkles,
} from "lucide-react";

import { KisanQueueProvider, useKisanQueue } from "@/lib/store";
import { useTranslation, t } from "@/lib/translations";
import { DemoHeader } from "@/components/common/DemoHeader";
import { NotificationDrawer } from "@/components/common/NotificationDrawer";
import { AuthModal } from "@/components/auth/AuthModal";

// Farmer components
import { FarmerDashboard } from "@/components/farmer/FarmerDashboard";
import { SlotBookingModal } from "@/components/farmer/SlotBookingModal";
import { AssistedBookingModal } from "@/components/farmer/AssistedBookingModal";
import { LiveQueueView } from "@/components/farmer/LiveQueueView";
import { MyBookingsView } from "@/components/farmer/MyBookingsView";
import { ProcurementTimelineView } from "@/components/farmer/ProcurementTimelineView";
import { PaymentTrackingView } from "@/components/farmer/PaymentTrackingView";
import { CentreMapView } from "@/components/farmer/CentreMapView";

// Staff & Admin components
import { StaffDashboard } from "@/components/staff/StaffDashboard";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KisanQueue — Fair & Fast Farmer Queue Management System" },
      {
        name: "description",
        content:
          "AI-driven procurement slot booking, live waiting time prediction, queue monitoring, and direct MSP payment tracking for farmers.",
      },
      { property: "og:title", content: "KisanQueue — Smart Agricultural Queue" },
      {
        property: "og:description",
        content: "Smart queue management for Kerala agricultural procurement centres.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: KisanQueueApp,
});

type FarmerScreen = "home" | "bookings" | "queue" | "timeline" | "payment" | "map" | "profile";

const FARMER_NAV_ITEMS: { id: FarmerScreen; label: string; icon: typeof Leaf }[] = [
  { id: "home", label: "Home", icon: Sprout },
  { id: "bookings", label: "Bookings", icon: CalendarDays },
  { id: "queue", label: "Queue", icon: UsersRound },
  { id: "timeline", label: "Tracking", icon: PackageCheck },
  { id: "payment", label: "Payments", icon: IndianRupee },
  { id: "profile", label: "Profile", icon: UserRound },
];

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={inverse ? "brand-mark brand-mark-inverse" : "brand-mark"}>
        <Leaf className="size-5" strokeWidth={2.2} />
        <span />
      </span>
      <span className={inverse ? "font-display text-2xl text-primary-foreground" : "font-display text-2xl text-foreground"}>
        KisanQueue
      </span>
    </div>
  );
}

function KisanQueueApp() {
  const { role, setRole, language, setLanguage, user, activeBooking, nowServing, largeText, highContrast } =
    useKisanQueue();
  const { t: translate } = useTranslation();

  const [farmerScreen, setFarmerScreen] = useState<FarmerScreen>("home");
  const [authOpen, setAuthOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [assistedModalOpen, setAssistedModalOpen] = useState(false);

  useEffect(() => {
    setRole("farmer");
  }, [setRole]);

  return (
    <div
      className={`min-h-screen flex flex-col bg-background text-foreground ${
        largeText ? "text-lg" : ""
      } ${highContrast ? "contrast-125" : ""}`}
    >
      {/* Universal Top HUD / Demo Header */}
      <DemoHeader
        onOpenAuth={() => setAuthOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
      />

      {/* Role-based Dynamic View */}
      {role === "staff" ? (
        <main className="flex-1">
          <StaffDashboard />
        </main>
      ) : role === "admin" ? (
        <main className="flex-1">
          <AdminDashboard />
        </main>
      ) : (
        /* Farmer Experience */
        <div className="app-canvas flex-1">
          {/* Desktop Sidebar Rail */}
          <aside className="desktop-rail">
            <Logo />
            <div className="mt-8">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                👨‍🌾 Farmer Portal
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold leading-tight">
                Fair & Fast<br />Procurement
              </h2>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Skip long road queues. Book optimal slots, monitor live queue status, and track MSP DBT payments.
              </p>
            </div>

            <nav className="mt-8 space-y-1.5" aria-label="Desktop navigation">
              {FARMER_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = farmerScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setFarmerScreen(item.id)}
                    className={`rail-item ${active ? "rail-item-active" : ""}`}
                  >
                    <Icon className="size-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Live Token Snapshot in Rail */}
            <div className="relative mt-auto overflow-hidden rounded-2xl bg-primary p-4 text-primary-foreground shadow-md">
              <div className="pointer-events-none absolute inset-0 bg-dots text-white/10" />
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-secondary">
                  Active Booking
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-secondary">
                  <span className="size-1.5 rounded-full bg-secondary animate-ping" /> Live
                </span>
              </div>
              <p className="relative mt-1 font-display text-3xl font-black text-secondary">
                Token #{activeBooking?.queueNumber || 47}
              </p>
              <p className="relative mt-1 text-xs text-primary-foreground/80 truncate">
                {activeBooking?.centreName || "Kottayam Procurement Centre"}
              </p>
              <p className="relative mt-0.5 text-[11px] text-primary-foreground/60">
                Now serving: #{nowServing} · {Math.max(0, (activeBooking?.queueNumber || 47) - nowServing)} ahead
              </p>
            </div>
          </aside>

          {/* Farmer Phone / Mobile View Shell */}
          <main className="phone-shell">
            <div className="phone-content">
              {farmerScreen === "home" && (
                <FarmerDashboard
                  onOpenBooking={() => setBookingModalOpen(true)}
                  onOpenLiveQueue={() => setFarmerScreen("queue")}
                  onOpenBookingsList={() => setFarmerScreen("bookings")}
                  onOpenPayments={() => setFarmerScreen("payment")}
                  onOpenAssisted={() => setAssistedModalOpen(true)}
                  onOpenMap={() => setFarmerScreen("map")}
                  onSelectCentre={() => setBookingModalOpen(true)}
                />
              )}

              {farmerScreen === "queue" && (
                <LiveQueueView
                  onBack={() => setFarmerScreen("home")}
                  onOpenReschedule={() => setFarmerScreen("bookings")}
                  onOpenDirections={() => setFarmerScreen("map")}
                />
              )}

              {farmerScreen === "bookings" && (
                <MyBookingsView
                  onBack={() => setFarmerScreen("home")}
                  onOpenReschedule={() => setBookingModalOpen(true)}
                />
              )}

              {farmerScreen === "timeline" && (
                <ProcurementTimelineView onBack={() => setFarmerScreen("home")} />
              )}

              {farmerScreen === "payment" && (
                <PaymentTrackingView onBack={() => setFarmerScreen("home")} />
              )}

              {farmerScreen === "map" && (
                <CentreMapView
                  onBack={() => setFarmerScreen("home")}
                  onSelectCentre={() => setBookingModalOpen(true)}
                />
              )}

              {farmerScreen === "profile" && (
                <FarmerProfileView onBack={() => setFarmerScreen("home")} />
              )}
            </div>

            {/* Mobile Bottom Navigation Pill */}
            <FarmerBottomNav screen={farmerScreen} onNavigate={setFarmerScreen} />
          </main>
        </div>
      )}

      {/* Global Modals */}
      <NotificationDrawer open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <SlotBookingModal isOpen={bookingModalOpen} onClose={() => setBookingModalOpen(false)} />
      <AssistedBookingModal isOpen={assistedModalOpen} onClose={() => setAssistedModalOpen(false)} />
    </div>
  );
}

function FarmerBottomNav({
  screen,
  onNavigate,
}: {
  screen: FarmerScreen;
  onNavigate: (s: FarmerScreen) => void;
}) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <div className="bottom-nav-pill">
        {FARMER_NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = screen === id;
          return (
            <button
              key={id}
              type="button"
              className={`bottom-nav-item ${active ? "bottom-nav-item-active" : ""}`}
              onClick={() => onNavigate(id)}
              aria-label={label}
            >
              <Icon className="size-4 shrink-0" strokeWidth={2.4} />
              {active && <span className="truncate">{label}</span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function FarmerProfileView({ onBack }: { onBack: () => void }) {
  const { user, language, setLanguage, setRole } = useKisanQueue();
  const navigate = useNavigate();

  return (
    <div className="content-stack pt-2 space-y-4">
      {/* Profile Cover Card */}
      <div className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-xl">
        <div className="pointer-events-none absolute inset-0 bg-dots text-white/10" />
        <div className="relative z-10 flex items-center justify-between">
          <span className="eyebrow text-secondary">Verified Farmer Profile</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold">
            <ShieldCheck className="size-3.5" /> Aadhaar Linked
          </span>
        </div>

        <div className="relative z-10 mt-6 flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-secondary font-display text-2xl font-black text-primary shadow">
            AK
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{user.name}</h1>
            <p className="text-xs text-primary-foreground/80 font-mono">ID: {user.farmerId}</p>
            <p className="text-xs text-primary-foreground/70">{user.mobile}</p>
          </div>
        </div>
      </div>

      {/* Land & Crop Registry */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Agricultural Registry
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl bg-muted/40 p-2.5">
            <span className="text-muted-foreground block text-[10px]">Village Panchayat</span>
            <strong className="text-foreground">{user.village}, {user.district}</strong>
          </div>
          <div className="rounded-xl bg-muted/40 p-2.5">
            <span className="text-muted-foreground block text-[10px]">Primary Crops</span>
            <strong className="text-foreground">{user.primaryCrop}</strong>
          </div>
          <div className="rounded-xl bg-muted/40 p-2.5 col-span-2">
            <span className="text-muted-foreground block text-[10px]">PFMS Direct Benefit Bank Account</span>
            <strong className="text-foreground font-mono">{user.bankAccount} ({user.ifsc})</strong>
          </div>
        </div>
      </div>

      {/* Language Preferences */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="size-4 text-primary" />
            <h3 className="text-xs font-semibold text-foreground">App Language / ഭാഷ / भाषा</h3>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            { id: "en", label: "English" },
            { id: "ml", label: "മലയാളം" },
            { id: "hi", label: "हिंदी" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setLanguage(item.id as any)}
              className={`rounded-xl border py-2.5 font-semibold transition-all ${
                language === item.id
                  ? "border-primary bg-primary text-primary-foreground shadow"
                  : "border-border bg-background text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Support & Helpline */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Support & Assistance
        </h3>
        <a
          href="tel:18004251661"
          className="flex items-center justify-between rounded-xl bg-muted/40 p-3 text-xs font-semibold hover:bg-muted transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Phone className="size-4 text-primary" />
            <div>
              <p className="text-foreground">Kisan Call Centre (Toll-Free)</p>
              <span className="text-[10px] text-muted-foreground font-mono">1800-180-1551 / 1800-425-1661</span>
            </div>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </a>
      </div>

      {/* Role Switcher Shortcuts */}
      <div className="rounded-2xl border border-dashed border-border bg-card/60 p-4 text-center space-y-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Hackathon / Evaluation Quick Switch
        </span>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => {
              setRole("staff");
              navigate({ to: "/staff" });
            }}
            className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold hover:bg-muted transition-all"
          >
            🏢 Open Staff Console (/staff)
          </button>
          <button
            onClick={() => {
              setRole("admin");
              navigate({ to: "/admin" });
            }}
            className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold hover:bg-muted transition-all"
          >
            🧑‍💼 Open Admin Center (/admin)
          </button>
        </div>
      </div>
    </div>
  );
}