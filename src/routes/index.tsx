import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
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
  ChevronLeft,
  MapPin,
  Settings2,
  Sliders,
  LogOut,
  Sparkles,
  PlayCircle,
  Building2,
} from "lucide-react";

import { useKisanQueue } from "@/lib/store";
import { useTranslation, t, SUPPORTED_LANGUAGES } from "@/lib/translations";
import { NotificationDrawer } from "@/components/common/NotificationDrawer";
import { AuthModal } from "@/components/auth/AuthModal";

import heroImage from "@/assets/smartprocure-home.jpg";
import splashImage from "@/assets/smartprocure-splash.jpg";

// Farmer components
import { FarmerDashboard } from "@/components/farmer/FarmerDashboard";
import { SlotBookingModal } from "@/components/farmer/SlotBookingModal";
import { AssistedBookingModal } from "@/components/farmer/AssistedBookingModal";
import { LiveQueueView } from "@/components/farmer/LiveQueueView";
import { MyBookingsView } from "@/components/farmer/MyBookingsView";
import { ProcurementTimelineView } from "@/components/farmer/ProcurementTimelineView";
import { PaymentTrackingView } from "@/components/farmer/PaymentTrackingView";
import { CentreMapView } from "@/components/farmer/CentreMapView";

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

type FarmerScreen = "splash" | "onboarding" | "home" | "bookings" | "queue" | "timeline" | "payment" | "map" | "profile";

const FARMER_NAV_ITEMS: { id: FarmerScreen; label: string; icon: typeof Leaf }[] = [
  { id: "home", label: "Home", icon: Sprout },
  { id: "bookings", label: "Bookings", icon: CalendarDays },
  { id: "map", label: "Map", icon: MapPin },
  { id: "queue", label: "Queue", icon: UsersRound },
  { id: "profile", label: "Profile", icon: UserRound },
];

const ONBOARDING = [
  {
    eyebrow: "Your time matters",
    title: "Skip the Queue",
    copy: "Spend less time waiting at procurement centres.",
    focus: "queue",
  },
  {
    eyebrow: "Plan with confidence",
    title: "Book Your Slot",
    copy: "Choose the best time to bring your produce.",
    focus: "slot",
  },
  {
    eyebrow: "Arrive right on time",
    title: "Know When to Arrive",
    copy: "Track your queue and estimated waiting time.",
    focus: "arrival",
  },
] as const;

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

function AppButton({
  children,
  tone = "primary",
  onClick,
  className = "",
}: {
  children: ReactNode;
  tone?: "primary" | "soft" | "ghost" | "danger";
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button className={`app-button app-button-${tone} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}

function Splash({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const { language, setLanguage } = useKisanQueue();
  return (
    <main className="splash-screen">
      <img
        src={splashImage}
        alt="Farmer with harvested grain at a procurement centre"
        width={1088}
        height={1600}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="splash-shade" />
      <div className="relative z-10 flex min-h-dvh flex-col px-6 pb-8 pt-10 sm:mx-auto sm:max-w-md">
        <div className="flex items-center justify-between">
          <Logo inverse />
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-full bg-black/40 px-2.5 py-1 text-xs backdrop-blur-md border border-white/25 text-white">
              <Languages className="size-3.5 text-secondary mr-1.5" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                aria-label="Language"
                className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id} className="text-foreground bg-card">
                    {l.native} ({l.label})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={onSkip}
              className="rounded-full bg-black/25 px-3 py-1 text-xs font-semibold text-primary-foreground/90 hover:bg-black/40 hover:text-white backdrop-blur-sm transition-all"
            >
              Skip →
            </button>
          </div>
        </div>
        <div className="mt-auto">
          <p className="eyebrow text-secondary font-semibold">Kerala Agricultural Department</p>
          <h1 className="mt-2 font-display text-6xl leading-[0.92] text-primary-foreground">
            Kisan<br />Queue
          </h1>
          <p className="mt-4 text-sm leading-6 text-primary-foreground/85">
            {t(language, "subTagline")}
          </p>
          <AppButton
            tone="soft"
            className="mt-7 w-full flex items-center justify-center gap-1.5 py-3 font-bold text-base shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
            onClick={onNext}
          >
            {language === "ml" ? "ആരംഭിക്കുക" : language === "hi" ? "शुरू करें" : language === "ta" ? "தொடங்குங்கள்" : language === "te" ? "ప్రారంభించండి" : language === "kn" ? "ಪ್ರಾರಂಭಿಸಿ" : language === "bn" ? "শুরু করুন" : language === "mr" ? "सुरू करा" : "Begin"} <ChevronRight className="size-4" />
          </AppButton>
        </div>
      </div>
    </main>
  );
}

function Onboarding({
  step,
  onNext,
  onBack,
  onSkip,
}: {
  step: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}) {
  const item = ONBOARDING[step] ?? ONBOARDING[0];
  return (
    <main className="min-h-dvh bg-background p-4 sm:grid sm:place-items-center">
      <section className="relative mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-[2rem] bg-primary p-5 text-primary-foreground shadow-float sm:min-h-[760px]">
        <div className="pointer-events-none absolute inset-0 bg-dots text-white/10" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="flex size-8 items-center justify-center rounded-full bg-white/15 text-primary-foreground hover:bg-white/25 transition-all"
              aria-label="Previous step"
              title="Go Back"
            >
              <ChevronLeft className="size-4" />
            </button>
            <Logo inverse />
          </div>
          <button
            className="text-xs font-semibold text-primary-foreground/75 hover:text-white transition-colors"
            onClick={onSkip}
          >
            Skip
          </button>
        </div>
        <div className="onboarding-visual mt-8">
          <img
            src={heroImage}
            alt="Farmers arriving at a procurement centre"
            width={1600}
            height={912}
            className="h-full w-full object-cover"
          />
          <div className="queue-ticket">
            <span>YOUR TOKEN</span>
            <strong>#47</strong>
            <small>24 min</small>
          </div>
        </div>
        <div className="mt-auto pt-8">
          <p className="eyebrow text-secondary">{item.eyebrow}</p>
          <h1 className="mt-3 font-display text-5xl leading-none">{item.title}</h1>
          <p className="mt-4 max-w-xs text-sm leading-6 text-primary-foreground/75">{item.copy}</p>
          <div className="mt-8 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 rounded-xl border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-white/20 transition-all active:scale-95"
            >
              <ChevronLeft className="size-4" /> Back
            </button>

            <div className="flex gap-1.5">
              {ONBOARDING.map((_, index) => (
                <span
                  key={index}
                  className={index === step ? "pager-dot pager-dot-active" : "pager-dot"}
                />
              ))}
            </div>

            <AppButton
              tone="soft"
              onClick={onNext}
              className="flex items-center gap-1 font-semibold text-xs py-2 px-4 shadow-md"
            >
              {step === 2 ? "Open KisanQueue" : "Next"}
              <ChevronRight className="size-4" />
            </AppButton>
          </div>
        </div>
      </section>
    </main>
  );
}

function KisanQueueApp() {
  const { role, setRole, language, setLanguage, user, activeBooking, nowServing, largeText, highContrast } =
    useKisanQueue();
  const { t: translate } = useTranslation();
  const navigate = useNavigate();

  const [farmerScreen, setFarmerScreen] = useState<FarmerScreen>("splash");
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [authOpen, setAuthOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedCentreForBooking, setSelectedCentreForBooking] = useState<string | null>(null);
  const [selectedCropForBooking, setSelectedCropForBooking] = useState<string | null>(null);
  const [assistedModalOpen, setAssistedModalOpen] = useState(false);

  useEffect(() => {
    setRole("farmer");
  }, [setRole]);

  // If user is on pure Splash screen
  if (farmerScreen === "splash") {
    return (
      <div
        className={`min-h-screen bg-background text-foreground ${
          largeText ? "text-lg" : ""
        } ${highContrast ? "contrast-125" : ""}`}
      >
        <Splash
          onNext={() => {
            setOnboardingStep(0);
            setFarmerScreen("onboarding");
          }}
          onSkip={() => setFarmerScreen("home")}
        />
      </div>
    );
  }

  // If user is on Onboarding walkthrough
  if (farmerScreen === "onboarding") {
    return (
      <div
        className={`min-h-screen bg-background text-foreground ${
          largeText ? "text-lg" : ""
        } ${highContrast ? "contrast-125" : ""}`}
      >
        <Onboarding
          step={onboardingStep}
          onBack={() => {
            if (onboardingStep > 0) {
              setOnboardingStep((v) => v - 1);
            } else {
              setFarmerScreen("splash");
            }
          }}
          onSkip={() => setFarmerScreen("home")}
          onNext={() => {
            if (onboardingStep < 2) {
              setOnboardingStep((v) => v + 1);
            } else {
              setFarmerScreen("home");
            }
          }}
        />
      </div>
    );
  }


  // Main Farmer App
  return (
    <div
      className={`min-h-screen flex flex-col bg-background text-foreground ${
        largeText ? "text-lg" : ""
      } ${highContrast ? "contrast-125" : ""}`}
    >
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
              const translatedLabel = t(language, item.id as any) || item.label;
              return (
                <button
                  key={item.id}
                  onClick={() => setFarmerScreen(item.id)}
                  className={`rail-item ${active ? "rail-item-active" : ""}`}
                >
                  <Icon className="size-5" />
                  <span>{translatedLabel}</span>
                </button>
              );
            })}
          </nav>

          {/* Clean Portal Navigation Links in Rail */}
          <div className="mt-6 space-y-1.5 border-t border-border/50 pt-4 text-xs font-medium text-muted-foreground">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-2 mb-1">
              Official Portals
            </p>
            <button
              onClick={() => navigate({ to: "/staff" })}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors text-left"
            >
              <span className="flex items-center gap-2">
                <Building2 className="size-4 text-primary" /> Staff Portal (/staff)
              </span>
              <ChevronRight className="size-3.5 text-muted-foreground" />
            </button>
            <button
              onClick={() => navigate({ to: "/admin" })}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors text-left"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" /> Admin Directorate (/admin)
              </span>
              <ChevronRight className="size-3.5 text-muted-foreground" />
            </button>
          </div>

          {/* Live Token Snapshot in Rail */}
          <div className="relative mt-auto overflow-hidden rounded-2xl bg-primary p-4 text-primary-foreground shadow-md">
            <div className="pointer-events-none absolute inset-0 bg-dots text-white/10" />
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-secondary">
                Active Booking
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-300">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                </span>
                Live
              </span>
            </div>
            <p className="relative mt-1 font-display text-3xl font-black text-secondary">
              {activeBooking ? `Token #${activeBooking.queueNumber}` : "No Token"}
            </p>
            <p className="relative mt-1 text-xs text-primary-foreground/80 truncate">
              {activeBooking ? activeBooking.centreName : "Procurement Portal Ready"}
            </p>
            <p className="relative mt-0.5 text-[11px] text-primary-foreground/60">
              {activeBooking
                ? `Now serving: #${nowServing} · ${Math.max(0, activeBooking.queueNumber - nowServing)} ahead`
                : `Now serving: #${nowServing} · Ready to issue token`}
            </p>
          </div>
        </aside>

        {/* Farmer Phone / Mobile View Shell */}
        <main className="phone-shell">
          <div className="phone-content">
            {farmerScreen === "home" && (
              <FarmerDashboard
                onOpenBooking={(cropName) => {
                  setSelectedCentreForBooking(null);
                  setSelectedCropForBooking(cropName || null);
                  setBookingModalOpen(true);
                }}
                onOpenLiveQueue={() => setFarmerScreen("queue")}
                onOpenBookingsList={() => setFarmerScreen("bookings")}
                onOpenPayments={() => setFarmerScreen("payment")}
                onOpenAssisted={() => setAssistedModalOpen(true)}
                onOpenMap={() => setFarmerScreen("map")}
                onSelectCentre={(centreName) => {
                  setSelectedCentreForBooking(centreName);
                  setBookingModalOpen(true);
                }}
                onOpenNotifications={() => setNotificationsOpen(true)}
              />
            )}

            {farmerScreen === "queue" && (
              <LiveQueueView
                onBack={() => setFarmerScreen("home")}
                onOpenReschedule={() => {
                  setSelectedCentreForBooking(null);
                  setBookingModalOpen(true);
                }}
                onOpenDirections={() => setFarmerScreen("map")}
              />
            )}

            {farmerScreen === "bookings" && (
              <MyBookingsView
                onBack={() => setFarmerScreen("home")}
                onOpenReschedule={(booking) => {
                  setSelectedCentreForBooking(booking?.centreName || null);
                  setBookingModalOpen(true);
                }}
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
                onSelectCentre={(centreName) => {
                  setSelectedCentreForBooking(centreName);
                  setBookingModalOpen(true);
                }}
              />
            )}

            {farmerScreen === "profile" && (
              <FarmerProfileView
                onBack={() => setFarmerScreen("home")}
                onReplayIntro={() => setFarmerScreen("splash")}
              />
            )}
          </div>

          {/* Mobile Bottom Navigation Pill */}
          <FarmerBottomNav screen={farmerScreen} onNavigate={setFarmerScreen} />
        </main>
      </div>

      {/* Global Modals */}
      <NotificationDrawer open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <SlotBookingModal
        isOpen={bookingModalOpen}
        initialCentreName={selectedCentreForBooking}
        initialCropName={selectedCropForBooking}
        onNavigateToQueue={() => setFarmerScreen("queue")}
        onClose={() => {
          setBookingModalOpen(false);
          setSelectedCentreForBooking(null);
          setSelectedCropForBooking(null);
        }}
      />
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
  const { language } = useKisanQueue();
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <div className="bottom-nav-pill">
        {FARMER_NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = screen === id;
          const translatedLabel = t(language, id as any) || label;
          return (
            <button
              key={id}
              type="button"
              className={`bottom-nav-item ${active ? "bottom-nav-item-active" : ""}`}
              onClick={() => onNavigate(id)}
              aria-label={translatedLabel}
              title={translatedLabel}
            >
              <Icon className="size-5 shrink-0" strokeWidth={active ? 2.5 : 2} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function FarmerProfileView({
  onBack,
  onReplayIntro,
}: {
  onBack: () => void;
  onReplayIntro: () => void;
}) {
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
            <h3 className="text-xs font-bold text-foreground">
              {t(language, "appLanguage")} / Indian Languages (8)
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {SUPPORTED_LANGUAGES.map((item) => (
            <button
              key={item.id}
              onClick={() => setLanguage(item.id)}
              className={`flex flex-col items-center justify-center rounded-xl border py-2.5 px-2 transition-all text-center ${
                language === item.id
                  ? "border-primary bg-primary text-primary-foreground shadow font-bold"
                  : "border-border bg-background text-foreground hover:bg-muted"
              }`}
            >
              <span className="text-xs font-bold leading-snug">{item.native}</span>
              <span className="text-[10px] opacity-75">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Replay Intro Splash */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <button
          onClick={onReplayIntro}
          className="flex w-full items-center justify-between text-xs font-semibold text-foreground hover:text-primary transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <PlayCircle className="size-4 text-primary" />
            <span>{t(language, "replayIntro")}</span>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>
      </div>

      {/* Support & Helpline */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {t(language, "supportAssistance")}
        </h3>
        <a
          href="tel:18004251661"
          className="flex items-center justify-between rounded-xl bg-muted/40 p-3 text-xs font-semibold hover:bg-muted transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Phone className="size-4 text-primary" />
            <div>
              <p className="text-foreground">{t(language, "kisanCallCentre")}</p>
              <span className="text-[10px] text-muted-foreground font-mono">1800-180-1551 / 1800-425-1661</span>
            </div>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </a>
      </div>

      {/* Official Government Portals */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {t(language, "govPortals")}
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => {
              setRole("staff");
              navigate({ to: "/staff" });
            }}
            className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-3 text-xs font-bold text-foreground hover:bg-muted transition-all"
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="size-4 text-primary" />
              <span>🏢 {t(language, "staffDashboard")}</span>
            </div>
            <span className="text-[11px] text-muted-foreground font-mono">/staff</span>
          </button>
          <button
            onClick={() => {
              setRole("admin");
              navigate({ to: "/admin" });
            }}
            className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-3 text-xs font-bold text-foreground hover:bg-muted transition-all"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="size-4 text-primary" />
              <span>🧑‍💼 {t(language, "adminDashboard")}</span>
            </div>
            <span className="text-[11px] text-muted-foreground font-mono">/admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}