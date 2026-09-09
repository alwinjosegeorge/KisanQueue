import React from "react";
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
} from "lucide-react";

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
  const { user, activeBooking, centres, language, nowServing, predictWaitingTime, getRecommendedCentre, notifications } =
    useKisanQueue();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const recommendedCentre = getRecommendedCentre();
  const currentCentre = centres.find((c) => c.id === activeBooking?.centreId) || centres[0];
  const userQueueNumber = activeBooking?.queueNumber || 47;
  const prediction = predictWaitingTime(currentCentre.id, userQueueNumber);
  const farmersAhead = Math.max(0, userQueueNumber - nowServing);

  return (
    <div className="content-stack pt-2 space-y-4">
      {/* Farmer Greeting Header */}
      <div className="flex items-center justify-between rounded-2xl bg-card border border-border p-4 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display text-base font-bold text-primary">
            AK
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{t(language, "goodMorning")}</p>
            <h1 className="font-display text-lg font-bold truncate text-foreground">{user.name}</h1>
            <p className="text-[10px] text-muted-foreground font-mono">ID: {user.farmerId} · {user.village}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative flex size-9 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-muted transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenAssisted}
            className="flex items-center gap-1 rounded-full border border-secondary/40 bg-secondary/15 px-3 py-1 text-xs font-bold text-foreground transition-all hover:bg-secondary/25"
          >
            <Headphones className="size-3.5 text-primary" />
            <span className="hidden sm:inline">Assisted</span>
          </button>
        </div>
      </div>

      {/* Delay Alert Broadcast Banner (Recalculated in real time when staff logs delay) */}
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

      {/* LIVE QUEUE HERO CARD (Styled with bg-dots & SIH visual language) */}
      <section className="hero-queue-card relative overflow-hidden rounded-3xl bg-primary p-5 text-primary-foreground shadow-xl">
        <div className="pointer-events-none absolute inset-0 bg-dots text-white/10" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="eyebrow text-secondary">{t(language, "upcomingBooking")}</span>
            <span className="live-pill inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              <span className="size-2 rounded-full bg-secondary animate-ping" /> Live Queue
            </span>
          </div>

          <h2 className="mt-2 font-display text-xl font-bold leading-tight">
            {activeBooking ? activeBooking.centreName : currentCentre.name}
          </h2>
          <p className="mt-0.5 text-xs text-primary-foreground/75">
            {activeBooking ? `${activeBooking.crop} · ${activeBooking.quantityKg} kg` : "Paddy (നെല്ല്) · 420 kg"} · {activeBooking?.slotTime || "10:30 AM"}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-white/10 p-3.5 backdrop-blur-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground/60">
                {t(language, "nowServing")}
              </p>
              <p className="font-display text-4xl font-extrabold text-secondary">#{nowServing}</p>
              <p className="text-[11px] text-primary-foreground/75 mt-0.5">Yard Gate 1</p>
            </div>

            <div className="border-l border-white/15 pl-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground/60">
                {t(language, "yourToken")}
              </p>
              <p className="font-display text-4xl font-extrabold text-white">#{userQueueNumber}</p>
              <p className="text-[11px] text-primary-foreground/80 mt-0.5">
                <strong>{farmersAhead}</strong> farmers ahead
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-primary-foreground/85">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 text-secondary" />
              {t(language, "approxTime")}: <strong className="text-secondary">{prediction.timeStr}</strong>
            </span>
            <span className="text-[11px] font-medium opacity-80">
              ~{prediction.minutesLeft} min wait
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenLiveQueue}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-xs font-bold text-secondary-foreground shadow-lg transition-transform hover:scale-[1.01]"
          >
            Track Real-time Queue Pipeline <ChevronRight className="size-4" />
          </button>
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
              onClick={onOpenBooking}
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
    </div>
  );
}
