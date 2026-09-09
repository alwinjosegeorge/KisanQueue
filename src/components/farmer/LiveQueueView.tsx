import React, { useState } from "react";
import { useKisanQueue } from "@/lib/store";
import { t } from "@/lib/translations";
import {
  ArrowLeft,
  Navigation,
  Clock,
  AlertTriangle,
  Check,
  RefreshCw,
  X,
  MapPin,
  Sparkles,
  XCircle,
} from "lucide-react";

interface LiveQueueViewProps {
  onBack: () => void;
  onOpenReschedule: () => void;
  onOpenDirections: () => void;
}

export function LiveQueueView({ onBack, onOpenReschedule, onOpenDirections }: LiveQueueViewProps) {
  const { user, activeBooking, centres, queue, nowServing, language, predictWaitingTime, cancelBooking } = useKisanQueue();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const currentCentre = centres.find((c) => c.id === activeBooking?.centreId) || centres[0];
  const userQueueNumber = activeBooking ? activeBooking.queueNumber : null;
  const prediction = activeBooking
    ? predictWaitingTime(currentCentre.id, activeBooking.queueNumber)
    : { timeStr: "Immediate", minutesLeft: 0, delayMinutes: 0 };
  const farmersAhead = activeBooking ? Math.max(0, activeBooking.queueNumber - nowServing) : 0;

  return (
    <div className="content-stack pt-2 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold">{t(language, "liveQueue")}</h1>
          <p className="text-xs text-muted-foreground">{currentCentre.name}</p>
        </div>
      </div>

      {/* Delay Alert Callout (Automatically synchronizes when staff clicks Report Delay!) */}
      {currentCentre.activeDelayMinutes > 0 && (
        <div className="rounded-2xl border border-amber-500/50 bg-amber-500/15 p-4 text-foreground shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-xs font-bold uppercase text-amber-900 dark:text-amber-300">
                  Operational Delay: +{currentCentre.activeDelayMinutes} minutes
                </strong>
              </div>
              <p className="mt-1 text-xs text-amber-950/85 dark:text-amber-100/90 leading-relaxed">
                {currentCentre.delayReason || "Moisture meter calibration & yard vehicle congestion."}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-900 dark:text-amber-200">
                <Clock className="size-3.5" />
                Updated turn: <strong>{prediction.timeStr}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Active Token Notice */}
      {!activeBooking && (
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/10 p-4 text-center space-y-2.5 shadow-sm">
          <Sparkles className="size-6 text-primary mx-auto" />
          <h3 className="font-bold text-sm text-foreground">{t(language, "noActiveTokenNotice")}</h3>
          <p className="text-xs text-muted-foreground">
            {t(language, "noActiveTokenSub")}
          </p>
          <button
            type="button"
            onClick={onOpenReschedule}
            className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:opacity-90 transition-opacity"
          >
            ⚡ {t(language, "generateQueueToken")}
          </button>
        </div>
      )}

      {/* Live Counter Hero Ring */}
      <section className="queue-progress-card relative overflow-hidden rounded-3xl bg-primary p-5 text-primary-foreground shadow-xl">
        <div className="pointer-events-none absolute inset-0 bg-dots text-white/10" />

        <div className="relative z-10 text-center">
          <span className="eyebrow text-secondary">{t(language, "realtimePosition")}</span>

          <div className="my-4 flex items-center justify-center gap-6">
            <div className="rounded-2xl bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
              <span className="block text-[10px] uppercase tracking-wider text-primary-foreground/65">
                {t(language, "nowServing")}
              </span>
              <strong className="font-display text-5xl font-extrabold text-secondary">#{nowServing}</strong>
              <small className="block text-[10px] text-primary-foreground/75 mt-0.5">{t(language, "weighBay")}</small>
            </div>

            <div className="rounded-2xl bg-white/15 px-4 py-3 text-center ring-2 ring-secondary/50 backdrop-blur-sm">
              <span className="block text-[10px] uppercase tracking-wider text-primary-foreground/80 font-bold">
                {t(language, "yourToken")}
              </span>
              <strong className="font-display text-5xl font-extrabold text-white">
                {userQueueNumber ? `#${userQueueNumber}` : "—"}
              </strong>
              <small className="block text-[10px] text-secondary mt-0.5 font-semibold">
                {activeBooking
                  ? (farmersAhead === 0 ? t(language, "servingNow") : `${farmersAhead} ${t(language, "farmersAhead")}`)
                  : t(language, "noToken")}
              </small>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-white/15 pt-3 text-center text-xs">
            <div>
              <span className="text-[10px] text-primary-foreground/60 block">{t(language, "queueGap")}</span>
              <strong>{activeBooking ? `${farmersAhead} ${t(language, "farmersAhead")}` : "—"}</strong>
            </div>
            <div>
              <span className="text-[10px] text-primary-foreground/60 block">{t(language, "waitTime")}</span>
              <strong className={currentCentre.activeDelayMinutes > 0 ? "text-secondary" : ""}>
                {activeBooking ? `~${prediction.minutesLeft} mins` : "Ready"}
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-primary-foreground/60 block">{t(language, "expectedCall")}</span>
              <strong className="text-secondary">{activeBooking ? prediction.timeStr : "Immediate"}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Pipeline (SIH Main Demo Feature: #11 -> #12 -> #13 ... -> #18 YOU) */}
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-sm font-bold flex items-center gap-1.5">
            <Sparkles className="size-4 text-primary" /> Visual Queue Pipeline
          </h3>
          <span className="text-[11px] text-muted-foreground">Yard Gates 1 & 2</span>
        </div>

        <div className="space-y-2">
          {queue.slice(0, 8).map((item) => {
            const isServing = item.queueNumber === nowServing;
            const isUser = item.queueNumber === userQueueNumber;
            const isCompleted = item.queueNumber < nowServing;

            return (
              <div
                key={item.queueNumber}
                className={`flex items-center justify-between rounded-xl border p-2.5 text-xs transition-all ${
                  isServing
                    ? "border-secondary bg-secondary/15 font-bold shadow-sm"
                    : isUser
                    ? "border-primary bg-primary text-primary-foreground font-bold shadow-md"
                    : isCompleted
                    ? "opacity-45 border-border bg-muted/40"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-7 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                      isServing
                        ? "bg-secondary text-secondary-foreground"
                        : isUser
                        ? "bg-white text-primary"
                        : isCompleted
                        ? "bg-muted text-muted-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    #{item.queueNumber}
                  </span>

                  <div>
                    <span className="font-semibold block">{item.farmerName}</span>
                    <span
                      className={`text-[10px] ${
                        isUser ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}
                    >
                      {item.crop} · {item.quantityKg} kg
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  {isServing && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary/30 px-2 py-0.5 text-[10px] font-bold text-secondary-foreground">
                      <span className="size-1.5 rounded-full bg-primary animate-ping" /> AT COUNTER
                    </span>
                  )}
                  {isUser && (
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
                      YOUR TURN
                    </span>
                  )}
                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Check className="size-3 text-emerald-600" /> Done
                    </span>
                  )}
                  {!isServing && !isUser && !isCompleted && (
                    <span className="text-[10px] text-muted-foreground">
                      ~{(item.queueNumber - nowServing) * currentCentre.avgProcessingMinutes}m
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Rebooking & Reschedule Option (Can't make your slot?) */}
      <section className="rounded-2xl border border-border bg-muted/40 p-4 space-y-3">
        <div>
          <h4 className="text-xs font-bold">Running late or can't make your slot?</h4>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            KisanQueue allows one-tap rescheduling or cancellation so your slot can be offered to waiting farmers.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOpenDirections}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90"
          >
            <Navigation className="size-4" /> {t(language, "directions")}
          </button>

          <button
            type="button"
            onClick={onOpenReschedule}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2.5 text-xs font-bold hover:bg-muted"
          >
            <RefreshCw className="size-3.5" /> {t(language, "rescheduleSlot")}
          </button>
        </div>

        {activeBooking && (
          <button
            type="button"
            onClick={() => setShowCancelConfirm(true)}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/60 dark:bg-rose-950/30 dark:border-rose-900/50 py-2.5 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
          >
            <XCircle className="size-4" /> {t(language, "cancelBooking")}
          </button>
        )}
      </section>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && activeBooking && (
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
                onClick={() => setShowCancelConfirm(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to cancel your queue slot for <strong>Token #{activeBooking.queueNumber}</strong>? You will lose your current spot in the live queue.
            </p>
            <div className="rounded-xl bg-muted/40 p-3 text-xs space-y-1 font-mono">
              <p>Booking ID: <strong>{activeBooking.id}</strong></p>
              <p>Crop: <strong>{activeBooking.crop} ({activeBooking.quantityKg} kg)</strong></p>
              <p>Slot: <strong>{activeBooking.date} · {activeBooking.slotTime}</strong></p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="rounded-xl border border-border bg-background py-2.5 text-xs font-semibold hover:bg-muted"
              >
                {t(language, "keepSpot")}
              </button>
              <button
                type="button"
                onClick={() => {
                  cancelBooking(activeBooking.id);
                  setShowCancelConfirm(false);
                  onBack();
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
