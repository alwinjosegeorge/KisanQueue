import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
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
  Sprout,
  Ticket,
} from "lucide-react";
import heroImage from "@/assets/smartprocure-home.jpg";
import cropPaddy from "@/assets/crop-paddy.jpg";
import cropCoconut from "@/assets/crop-coconut.jpg";
import cropRubber from "@/assets/crop-rubber.jpg";
import cropPepper from "@/assets/crop-pepper.jpg";
import cropCardamom from "@/assets/crop-cardamom.jpg";
import cropArecanut from "@/assets/crop-arecanut.jpg";
import cropNutmeg from "@/assets/crop-nutmeg.jpg";
import cropCoffee from "@/assets/crop-coffee.jpg";
import cropBanana from "@/assets/crop-banana.jpg";

const CROPS_DATA = [
  {
    id: "paddy",
    name: "Paddy (നെല്ല്)",
    timeframeKey: "readyHarvest" as const,
    msp: "₹32 / kg MSP",
    badgeKey: "healthy" as const,
    badgeClass: "bg-emerald-600 text-white",
    image: cropPaddy,
  },
  {
    id: "coconut",
    name: "Raw Coconut (തേങ്ങ)",
    timeframeKey: "oneMonthHarvest" as const,
    msp: "₹38 / kg MSP",
    badgeKey: "normal" as const,
    badgeClass: "bg-white/90 text-gray-800 border border-gray-200",
    image: cropCoconut,
  },
  {
    id: "rubber",
    name: "Rubber (RSS4)",
    timeframeKey: "dailyTapping" as const,
    msp: "₹180 / kg MSP",
    badgeKey: "peakTap" as const,
    badgeClass: "bg-amber-500 text-white",
    image: cropRubber,
  },
  {
    id: "pepper",
    name: "Black Pepper (കുരുമുളക്)",
    timeframeKey: "dryingStage" as const,
    msp: "₹520 / kg MSP",
    badgeKey: "gradeA" as const,
    badgeClass: "bg-emerald-700 text-white",
    image: cropPepper,
  },
  {
    id: "cardamom",
    name: "Cardamom (ഏലം)",
    timeframeKey: "curingStage" as const,
    msp: "₹1,850 / kg MSP",
    badgeKey: "gradeSpecial" as const,
    badgeClass: "bg-emerald-800 text-white",
    image: cropCardamom,
  },
  {
    id: "arecanut",
    name: "Areca Nut (അടയ്ക്ക)",
    timeframeKey: "sunDrying" as const,
    msp: "₹360 / kg MSP",
    badgeKey: "gradeA" as const,
    badgeClass: "bg-amber-600 text-white",
    image: cropArecanut,
  },
  {
    id: "nutmeg",
    name: "Nutmeg (ജാതിക്ക)",
    timeframeKey: "maceSeparation" as const,
    msp: "₹280 / kg MSP",
    badgeKey: "healthy" as const,
    badgeClass: "bg-orange-600 text-white",
    image: cropNutmeg,
  },
  {
    id: "coffee",
    name: "Robusta Coffee (കാപ്പി)",
    timeframeKey: "cherryPicking" as const,
    msp: "₹210 / kg MSP",
    badgeKey: "gradeA" as const,
    badgeClass: "bg-rose-700 text-white",
    image: cropCoffee,
  },
  {
    id: "banana",
    name: "Nendran (നേന്ത്രക്കായ)",
    timeframeKey: "matureBunch" as const,
    msp: "₹42 / kg MSP",
    badgeKey: "healthy" as const,
    badgeClass: "bg-emerald-600 text-white",
    image: cropBanana,
  },
];

interface FarmerDashboardProps {
  onOpenBooking: (cropName?: string) => void;
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
    crops,
    language,
    nowServing,
    predictWaitingTime,
    getRecommendedCentre,
    notifications,
    cancelBooking,
    bookSlot,
  } = useKisanQueue();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const recommendedCentre = getRecommendedCentre();
  const currentCentre = centres.find((c) => c.id === activeBooking?.centreId) || recommendedCentre;
  const userQueueNumber = activeBooking ? activeBooking.queueNumber : null;
  const prediction = activeBooking
    ? predictWaitingTime(currentCentre.id, activeBooking.queueNumber)
    : { timeStr: "Immediate", minutesLeft: 0, delayMinutes: 0 };
  const farmersAhead = activeBooking ? Math.max(0, activeBooking.queueNumber - nowServing) : 0;

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

        <div className="relative z-10 p-4 sm:p-5 flex flex-col justify-between">
          {/* Top Bar inside Hero */}
          <div className="flex items-center justify-between">
            {/* Left: Farm / Avatar circle */}
            <div className="flex size-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-md">
              <Sprout className="size-6 text-emerald-400" />
            </div>

            {/* Center: Greeting & Date */}
            <div className="text-center">
              <p className="text-base font-extrabold text-white drop-shadow-sm leading-tight">
                {t(language, "goodMorning")}, {user.name.split(" ")[0]}
              </p>
              <p className="text-[11px] sm:text-xs text-white/80 font-medium leading-tight mt-0.5">
                Friday, 10 Sep 2026
              </p>
            </div>

            {/* Right: Notifications & Assisted */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenNotifications}
                className="relative flex size-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-colors shadow-md"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 flex size-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </button>
              <button
                type="button"
                onClick={onOpenAssisted}
                className="flex size-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-colors shadow-md"
                title="Assisted Helpline"
                aria-label="Assisted Helpline"
              >
                <Headphones className="size-4" />
              </button>
            </div>
          </div>

          {/* 3 Frosted Metric Cards (Matching reference image!) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mt-3.5">
            {/* Metric 1: Now Serving */}
            <div className="rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 p-2.5 sm:p-3 text-white shadow-md flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-white/90 font-semibold">
                <Wind className="size-3.5 text-emerald-400" />
                <span>{t(language, "nowServing")}</span>
              </div>
              <p className="font-display text-xl sm:text-2xl font-black mt-1 text-[#F5B544] tracking-tight">
                #{nowServing}
              </p>
              <p className="text-[9px] sm:text-[10px] text-white/70 truncate mt-0.5">{t(language, "weighBay")}</p>
            </div>

            {/* Metric 2: Your Token */}
            <div
              onClick={() => onOpenBooking()}
              className="rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 p-2.5 sm:p-3 text-white shadow-md cursor-pointer hover:bg-black/50 transition-all flex flex-col justify-between"
              title={activeBooking ? `Your active token #${userQueueNumber}` : t(language, "tapToGenerate")}
            >
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-white font-bold">
                <Sparkles className="size-3.5 text-amber-300" />
                <span>{t(language, "yourToken")}</span>
              </div>
              <p className="font-display text-xl sm:text-2xl font-black mt-1 text-white tracking-tight">
                {userQueueNumber ? `#${userQueueNumber}` : "#47"}
              </p>
              <p className="text-[9px] sm:text-[10px] text-emerald-400 font-bold truncate mt-0.5">
                {activeBooking && farmersAhead > 0 ? `${farmersAhead} ${t(language, "farmersAhead")}` : `7 ${t(language, "farmersAhead")}`}
              </p>
            </div>

            {/* Metric 3: Wait Turn */}
            <div className="rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 p-2.5 sm:p-3 text-white shadow-md flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-white/90 font-semibold">
                <Droplets className="size-3.5 text-blue-300" />
                <span>{t(language, "waitTurn")}</span>
              </div>
              <p className="font-display text-xl sm:text-2xl font-black mt-1 text-white tracking-tight">
                {prediction.minutesLeft > 0 ? `~${prediction.minutesLeft}m` : "~42m"}
              </p>
              <p className="text-[9px] sm:text-[10px] text-white/70 truncate mt-0.5">
                {prediction.timeStr || "05:16"}
              </p>
            </div>
          </div>

          {/* Hero Action Buttons */}
          {activeBooking ? (
            <div className="grid grid-cols-[1.3fr_1fr] gap-2.5 mt-3.5">
              <button
                type="button"
                onClick={onOpenLiveQueue}
                className="flex items-center justify-between rounded-2xl bg-white text-[#123D35] px-4 py-3 text-xs sm:text-sm font-extrabold shadow-lg hover:bg-white/95 active:scale-95 transition-all"
              >
                <span>{t(language, "trackLiveQueue")}</span>
                <ChevronRight className="size-4 stroke-[3]" />
              </button>
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-white/20 bg-black/45 backdrop-blur-md px-3 py-3 text-xs sm:text-sm font-bold text-white hover:bg-black/60 active:scale-95 transition-all shadow-md"
              >
                <XCircle className="size-4" />
                <span>{t(language, "cancelSlot")}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-[1.3fr_1fr] gap-2.5 mt-3.5">
              <button
                type="button"
                onClick={() => onOpenLiveQueue()}
                className="flex items-center justify-between rounded-2xl bg-white text-[#123D35] px-4 py-3 text-xs sm:text-sm font-extrabold shadow-lg hover:bg-white/95 active:scale-95 transition-all"
              >
                <span>{t(language, "trackLiveQueue")}</span>
                <ChevronRight className="size-4 stroke-[3]" />
              </button>
              <button
                type="button"
                onClick={() => onOpenBooking()}
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-white/20 bg-black/45 backdrop-blur-md px-3 py-3 text-xs sm:text-sm font-bold text-white hover:bg-black/60 active:scale-95 transition-all shadow-md"
              >
                <CalendarDays className="size-4" />
                <span>{t(language, "customSlot")}</span>
              </button>
            </div>
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

      {/* 60+ Senior Citizen Quick Mode Switch Banner */}
      <div
        onClick={() => navigate({ to: "/old" })}
        className="flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-950 cursor-pointer shadow-sm hover:bg-emerald-100 hover:border-emerald-300 transition-all dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-850"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white text-base shadow">
            👵
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold leading-tight truncate">
              മുതിർന്ന കർഷകർക്കുള്ള മോഡ് (60+ Senior Mode)
            </p>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 truncate">
              വലിയ അക്ഷരങ്ങളും ശബ്ദ സഹായവും അടങ്ങിയ ലളിതമായ രൂപം
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700">
          തുറക്കുക →
        </span>
      </div>

      {/* My Crops & Harvest Section (Horizontal Scrollable Cards matching reference image) */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t(language, "myCrops")} ({CROPS_DATA.length})
          </h3>
          <button
            type="button"
            onClick={() => onOpenBooking()}
            className="text-xs font-semibold text-primary hover:underline"
          >
            {t(language, "seeAll")}
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {CROPS_DATA.map((crop) => (
            <div
              key={crop.id}
              onClick={() => onOpenBooking(crop.name)}
              className="group min-w-[145px] max-w-[155px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <div className="relative h-20 w-full overflow-hidden bg-muted">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className={`absolute top-1.5 left-1.5 rounded-full px-2 py-0.5 text-[8px] font-bold shadow-sm ${crop.badgeClass}`}>
                  {t(language, crop.badgeKey)}
                </span>
              </div>
              <div className="p-2.5">
                <h4 className="text-xs font-bold truncate text-foreground">{crop.name}</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">{t(language, crop.timeframeKey)}</p>
              </div>
            </div>
          ))}
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
            <Map className="size-3.5" /> {t(language, "mapView")}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => onOpenBooking()}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card p-3 text-foreground transition-all hover:border-primary/50 hover:shadow-sm active:scale-95"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Ticket className="size-5" />
            </span>
            <span className="text-[11px] font-bold text-center leading-tight">{t(language, "generateToken")}</span>
          </button>

          <button
            type="button"
            onClick={onOpenLiveQueue}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card p-3 text-foreground transition-all hover:border-primary/50 hover:shadow-sm"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UsersRound className="size-5" />
            </span>
            <span className="text-[11px] font-bold text-center leading-tight">{t(language, "liveQueue")}</span>
          </button>

          <button
            type="button"
            onClick={onOpenBookingsList}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card p-3 text-foreground transition-all hover:border-primary/50 hover:shadow-sm"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PackageCheck className="size-5" />
            </span>
            <span className="text-[11px] font-bold text-center leading-tight">{t(language, "myBookings")}</span>
          </button>

          <button
            type="button"
            onClick={onOpenPayments}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card p-3 text-foreground transition-all hover:border-primary/50 hover:shadow-sm"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <IndianRupee className="size-5" />
            </span>
            <span className="text-[11px] font-bold text-center leading-tight">{t(language, "paymentStatus")}</span>
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
                <span>👥 {recommendedCentre.currentQueueLength} {t(language, "farmersAhead")}</span>
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/15 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
              ⭐ {t(language, "fastestTurn")}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs border-t border-border/60 pt-2">
            <span className="text-muted-foreground text-[11px]">
              {t(language, "estWait")}: <strong>~{recommendedCentre.currentQueueLength * recommendedCentre.avgProcessingMinutes} mins</strong>
            </span>
            <button
              type="button"
              onClick={() => onSelectCentre(recommendedCentre.name)}
              className="font-bold text-primary hover:underline inline-flex items-center gap-1 text-xs"
            >
              {t(language, "bookHere")} <ChevronRight className="size-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Nearby Procurement Centres List */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t(language, "nearbyCentres")} ({centres.length})
          </h3>
          <button
            onClick={onOpenMap}
            className="text-xs font-semibold text-primary hover:underline"
          >
            {t(language, "viewOnMap")}
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
                {centre.status === "normal" ? t(language, "congestionLow") : centre.status === "busy" ? t(language, "congestionMed") : t(language, "delayReported")}
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
                <h3 className="font-display font-bold text-base text-foreground">
                  {language === "ml" ? "ബുക്കിംഗ് റദ്ദാക്കണോ?" : language === "hi" ? "बुकिंग रद्द करें?" : "Cancel Booking?"}
                </h3>
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
                {t(language, "keepSpot")}
              </button>
              <button
                type="button"
                onClick={() => {
                  cancelBooking(activeBooking.id);
                  setShowCancelModal(false);
                }}
                className="rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow hover:bg-rose-700 transition-colors"
              >
                {t(language, "yesCancelSlot")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
