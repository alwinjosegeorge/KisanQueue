import React, { useState } from "react";
import { useKisanQueue } from "@/lib/store";
import { t } from "@/lib/translations";
import {
  CalendarDays,
  UsersRound,
  PackageCheck,
  IndianRupee,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Clock,
  Wheat,
  MapPin,
  Headphones,
  Map,
  Bell,
  XCircle,
  X,
  Sun,
  Wind,
  Droplets,
  CheckCircle2,
  Circle,
  Sprout,
  ShieldCheck,
  Check,
} from "lucide-react";
import heroImage from "@/assets/smartprocure-home.jpg";
import cropPaddy from "@/assets/crop-paddy.jpg";
import cropCoconut from "@/assets/crop-coconut.jpg";
import cropRubber from "@/assets/crop-rubber.jpg";
import cropPepper from "@/assets/crop-pepper.jpg";

const CROPS_DATA = [
  {
    id: "paddy",
    name: "Paddy (Nel)",
    timeframe: "Ready for Harvest",
    msp: "₹32 / kg MSP",
    badge: "Healthy",
    badgeClass: "bg-emerald-600 text-white",
    image: cropPaddy,
  },
  {
    id: "coconut",
    name: "Raw Coconut",
    timeframe: "1 Month to Harvest",
    msp: "₹38 / kg MSP",
    badge: "Normal",
    badgeClass: "bg-white/90 text-gray-800 border border-gray-200",
    image: cropCoconut,
  },
  {
    id: "rubber",
    name: "Rubber (RSS4)",
    timeframe: "Daily Tapping",
    msp: "₹180 / kg MSP",
    badge: "Peak Tap",
    badgeClass: "bg-amber-500 text-white",
    image: cropRubber,
  },
  {
    id: "pepper",
    name: "Black Pepper",
    timeframe: "Drying Stage",
    msp: "₹520 / kg MSP",
    badge: "Grade A",
    badgeClass: "bg-emerald-700 text-white",
    image: cropPepper,
  },
];

interface FarmerDashboardProps {
  onOpenBooking: () => void;
  onOpenLiveQueue: () => void;
  onOpenBookingsList: () => void;
  onOpenPayments: () => void;
  onOpenAssisted: () => void;
  onOpenMap: () => void;
  onSelectCentre: (centreName: string) => void;
  onOpenNotifications: () => void;
}

export function FarmerDashboard({
  onOpenBooking,
  onOpenLiveQueue,
  onOpenBookingsList,
  onOpenPayments,
  onOpenAssisted,
  onOpenMap,
  onSelectCentre,
  onOpenNotifications,
}: FarmerDashboardProps) {
  const {
    user,
    activeBooking,
    centres,
    language,
    nowServing,
    predictWaitingTime,
    getRecommendedCentre,
    notifications,
    cancelBooking,
  } = useKisanQueue();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const recommendedCentre = getRecommendedCentre();
  const currentCentre = centres.find((c) => c.id === activeBooking?.centreId) || centres[0];
  const userQueueNumber = activeBooking?.queueNumber || 47;
  const prediction = predictWaitingTime(currentCentre.id, userQueueNumber);
  const farmersAhead = Math.max(0, userQueueNumber - nowServing);

  return (
    <div className="content-stack pt-2 space-y-4">
      {/* LANDSCAPE HERO CARD (Matches Reference Design: Golden Hour Field + Weather + 3 Frosted Metric Cards) */}
      <section className="relative overflow-hidden rounded-[32px] shadow-xl text-white">
        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />
        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/85" />

        <div className="relative z-10 p-5 space-y-4">
          {/* Top Bar inside Hero */}
          <div className="flex items-center justify-between">
            {/* Left: Farm / Avatar circle */}
            <div className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-sm shadow-md">
              <Sprout className="size-5 text-emerald-300" />
            </div>

            {/* Center: Greeting & Date */}
            <div className="text-center">
              <p className="text-sm font-bold text-white drop-shadow-sm">{t(language, "goodMorning")}, {user.name.split(" ")[0]}</p>
              <p className="text-[11px] text-white/80 font-medium">Friday, 10 Sep 2026</p>
            </div>

            {/* Right: Notifications & Assisted */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenNotifications}
                className="relative flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-colors shadow-md"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex size-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </button>
              <button
                type="button"
                onClick={onOpenAssisted}
                className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-colors shadow-md"
                title="Assisted Helpline"
                aria-label="Assisted Helpline"
              >
                <Headphones className="size-4" />
              </button>
            </div>
          </div>

          {/* Temperature & Weather / District */}
          <div className="pt-1">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold tracking-tight drop-shadow-md">24°C</span>
              <span className="text-xs font-semibold text-white/90">☀️ Bright and Sunny</span>
            </div>
            <p className="text-[11px] text-white/75 flex items-center gap-2 mt-0.5">
              <span>📍 Kottayam Agri Cluster</span>
              <span>·</span>
              <span>L: 21°C  H: 31°C</span>
            </p>
          </div>

          {/* 3 Frosted White Metric Pills (Exact Match to Reference Image!) */}
          <div className="grid grid-cols-3 gap-2">
            {/* Metric 1 */}
            <div className="rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 p-2.5 text-white shadow-sm">
              <div className="flex items-center gap-1 text-[10px] text-white/80 font-semibold">
                <Wind className="size-3 text-emerald-300" />
                <span>Now Serving</span>
              </div>
              <p className="font-display text-xl font-extrabold mt-1 text-secondary">
                #{nowServing}
              </p>
              <p className="text-[9px] text-white/70 truncate">Gate 1 · Weigh Bay</p>
            </div>

            {/* Metric 2 */}
            <div className="rounded-2xl bg-white/25 backdrop-blur-md border border-white/40 p-2.5 text-white shadow-md ring-1 ring-white/30">
              <div className="flex items-center gap-1 text-[10px] text-white/90 font-bold">
                <Sun className="size-3 text-amber-300" />
                <span>Your Token</span>
              </div>
              <p className="font-display text-xl font-extrabold mt-1 text-white">
                #{userQueueNumber}
              </p>
              <p className="text-[9px] text-emerald-300 font-semibold truncate">
                {activeBooking ? `${farmersAhead} ahead` : "Slot Ready"}
              </p>
            </div>

            {/* Metric 3 */}
            <div className="rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 p-2.5 text-white shadow-sm">
              <div className="flex items-center gap-1 text-[10px] text-white/80 font-semibold">
                <Droplets className="size-3 text-blue-300" />
                <span>Wait Turn</span>
              </div>
              <p className="font-display text-xl font-extrabold mt-1 text-white">
                ~{prediction.minutesLeft}m
              </p>
              <p className="text-[9px] text-white/70 truncate">{prediction.timeStr}</p>
            </div>
          </div>

          {/* Hero Action Buttons */}
          {activeBooking ? (
            <div className="grid grid-cols-[1fr_auto] gap-2 pt-1">
              <button
                type="button"
                onClick={onOpenLiveQueue}
                className="flex items-center justify-center gap-2 rounded-xl bg-white text-[#123D35] py-2.5 text-xs font-extrabold shadow-lg hover:bg-white/90 transition-colors"
              >
                Track Live Queue <ChevronRight className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/30 bg-black/30 backdrop-blur-sm px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-rose-600 transition-colors"
              >
                <XCircle className="size-4" /> Cancel Slot
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenBooking}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-[#123D35] py-3 text-xs font-extrabold shadow-lg hover:bg-white/90 transition-colors"
            >
              + Book Procurement Slot
            </button>
          )}
        </div>
      </section>

      {/* Delay Alert Broadcast Banner (if operational delay exists) */}
      {currentCentre.activeDelayMinutes > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-amber-500/15 p-4 text-foreground shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-500/25 text-amber-700">
              <AlertTriangle className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                  ⚠️ Operational Delay at {currentCentre.name}
                </h3>
                <span className="rounded-full bg-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:text-amber-200">
                  +{currentCentre.activeDelayMinutes} mins
                </span>
              </div>
              <p className="mt-1 text-xs text-amber-950/80 dark:text-amber-100/90 leading-relaxed">
                {currentCentre.delayReason || "Moisture testing meter calibration in progress."}
              </p>
              <p className="mt-1.5 text-xs font-semibold text-amber-950 dark:text-amber-100">
                🔄 Smart Queue Engine recalculated your expected turn:{" "}
                <strong className="underline">{prediction.timeStr}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* My Crops & Harvest Section (Horizontal Scrollable Cards matching reference image) */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            My Crops & Fields (4)
          </h3>
          <button
            type="button"
            onClick={onOpenBooking}
            className="text-xs font-semibold text-primary hover:underline"
          >
            See all
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {CROPS_DATA.map((crop) => (
            <div
              key={crop.id}
              onClick={onOpenBooking}
              className="group min-w-[145px] max-w-[155px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative h-20 w-full overflow-hidden bg-muted">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className={`absolute top-1.5 left-1.5 rounded-full px-2 py-0.5 text-[8px] font-bold shadow-sm ${crop.badgeClass}`}>
                  {crop.badge}
                </span>
              </div>
              <div className="p-2.5">
                <h4 className="text-xs font-bold truncate text-foreground">{crop.name}</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">{crop.timeframe}</p>
                <p className="text-[10px] font-bold text-primary mt-1">{crop.msp}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* My Tasks Section (Matching "My Task" checklist in reference image) */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Today's Tasks (4)
          </h3>
          <button
            type="button"
            onClick={onOpenBookingsList}
            className="text-xs font-semibold text-primary hover:underline"
          >
            See all
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-sm hover:border-primary/40 transition-all">
            <div className="min-w-0 pr-2">
              <h4 className="text-xs font-bold text-foreground">Procurement Slot Confirmed</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Token #{userQueueNumber} · {activeBooking ? activeBooking.centreName : currentCentre.name}
              </p>
              <span className="text-[10px] text-primary/80 font-mono mt-0.5 block">08:30 AM · Verified</span>
            </div>
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
              <Check className="size-3.5 stroke-[3]" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-sm hover:border-primary/40 transition-all">
            <div className="min-w-0 pr-2">
              <h4 className="text-xs font-bold text-foreground">Pre-Harvest Moisture Testing</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Target moisture &lt; 14% for MSP Grade A rate
              </p>
              <span className="text-[10px] text-primary/80 font-mono mt-0.5 block">09:15 AM · Calibrated</span>
            </div>
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
              <Check className="size-3.5 stroke-[3]" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-sm hover:border-primary/40 transition-all">
            <div className="min-w-0 pr-2">
              <h4 className="text-xs font-bold text-foreground">Yard Gate 1 Entry & Weighing</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Certified weighbridge digital receipt generation
              </p>
              <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">Estimated 10:30 AM</span>
            </div>
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-border text-muted-foreground">
              <Circle className="size-3 text-muted-foreground" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-sm hover:border-primary/40 transition-all">
            <div className="min-w-0 pr-2">
              <h4 className="text-xs font-bold text-foreground">PFMS Direct Benefit Transfer (DBT)</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Automated bank transfer within 24 hours of weighing
              </p>
              <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">Aadhaar Linked Payout</span>
            </div>
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-border text-muted-foreground">
              <Circle className="size-3 text-muted-foreground" />
            </div>
          </div>
        </div>
      </section>


      {/* Quick Actions (SIH Priority 1-4) */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t(language, "quickActions")}
          </h3>
          <button
            onClick={onOpenMap}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <Map className="size-3.5" /> Centre Map
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={onOpenBooking}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card p-3 text-foreground transition-all hover:border-primary/50 hover:shadow-sm"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarDays className="size-5" />
            </span>
            <span className="text-[11px] font-bold text-center leading-tight">Book Slot</span>
          </button>

          <button
            type="button"
            onClick={onOpenLiveQueue}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card p-3 text-foreground transition-all hover:border-primary/50 hover:shadow-sm"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UsersRound className="size-5" />
            </span>
            <span className="text-[11px] font-bold text-center leading-tight">Live Queue</span>
          </button>

          <button
            type="button"
            onClick={onOpenBookingsList}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card p-3 text-foreground transition-all hover:border-primary/50 hover:shadow-sm"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PackageCheck className="size-5" />
            </span>
            <span className="text-[11px] font-bold text-center leading-tight">My Bookings</span>
          </button>

          <button
            type="button"
            onClick={onOpenPayments}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card p-3 text-foreground transition-all hover:border-primary/50 hover:shadow-sm"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <IndianRupee className="size-5" />
            </span>
            <span className="text-[11px] font-bold text-center leading-tight">Payments</span>
          </button>
        </div>
      </section>

      {/* Smart Centre Recommendation Card (SIH Strong Differentiator) */}
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="flex size-6 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
              <Sparkles className="size-3.5" />
            </span>
            <h3 className="font-display text-sm font-bold">{t(language, "recommendedCentre")}</h3>
          </div>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            AI / Multi-Factor Engine
          </span>
        </div>

        <div className="rounded-xl bg-muted/40 p-3 border border-border/80">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-xs">{recommendedCentre.name}</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                <span>📍 {recommendedCentre.distanceKm} km</span>
                <span>👥 {recommendedCentre.currentQueueLength} farmers waiting</span>
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/15 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
              ⭐ Fastest Turn
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs border-t border-border/60 pt-2">
            <span className="text-muted-foreground text-[11px]">
              Est wait: <strong>~{recommendedCentre.currentQueueLength * recommendedCentre.avgProcessingMinutes} mins</strong>
            </span>
            <button
              type="button"
              onClick={() => onSelectCentre(recommendedCentre.name)}
              className="font-bold text-primary hover:underline inline-flex items-center gap-1 text-xs"
            >
              Book Here <ChevronRight className="size-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Nearby Procurement Centres List */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Nearby Centres ({centres.length})
          </h3>
          <button
            onClick={onOpenMap}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View on Map
          </button>
        </div>

        {centres.map((centre) => (
          <div
            key={centre.id}
            onClick={() => onSelectCentre(centre.name)}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/50 cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
                <Wheat className="size-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold truncate">{centre.name}</h4>
                <p className="text-[11px] text-muted-foreground">
                  {centre.distanceKm} km · {centre.currentQueueLength} waiting · {centre.workingHours}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  centre.status === "normal"
                    ? "bg-emerald-500/15 text-emerald-700"
                    : centre.status === "busy"
                    ? "bg-amber-500/15 text-amber-700"
                    : "bg-destructive/15 text-destructive"
                }`}
              >
                {centre.status === "normal" ? "Normal" : centre.status === "busy" ? "Busy" : "Delayed"}
              </span>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                ~{centre.currentQueueLength * centre.avgProcessingMinutes + centre.activeDelayMinutes}m wait
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm overflow-hidden rounded-[24px] border border-border bg-card p-5 text-foreground shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="size-5" />
                <h3 className="font-display font-bold text-base text-foreground">Cancel Booking?</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to cancel your slot for <strong>Token #{activeBooking.queueNumber}</strong> at <strong>{activeBooking.centreName}</strong>? This slot will be released for other waiting farmers.
            </p>
            <div className="rounded-xl bg-muted/40 p-3 text-xs space-y-1 font-mono">
              <p>Booking ID: <strong>{activeBooking.id}</strong></p>
              <p>Crop: <strong>{activeBooking.crop} ({activeBooking.quantityKg} kg)</strong></p>
              <p>Slot: <strong>{activeBooking.date} · {activeBooking.slotTime}</strong></p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="rounded-xl border border-border bg-background py-2.5 text-xs font-semibold hover:bg-muted"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={() => {
                  cancelBooking(activeBooking.id);
                  setShowCancelModal(false);
                }}
                className="rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow hover:bg-rose-700 transition-colors"
              >
                Yes, Cancel Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
