import React from "react";
import { useKisanQueue } from "@/lib/store";
import { ArrowLeft, Check, Clock, ShieldCheck, Scale, CheckCircle2, IndianRupee } from "lucide-react";

export function ProcurementTimelineView({ onBack }: { onBack: () => void }) {
  const { activeBooking, language } = useKisanQueue();
  const currentStep = activeBooking ? activeBooking.currentStepIndex : 2;

  const steps = [
    { label: "Slot Booked", time: "08 Sep, 04:15 PM", icon: Clock, desc: "Token #47 generated for Kottayam Centre" },
    { label: "Farmer Arrived", time: "10 Sep, 10:14 AM", icon: Check, desc: "Vehicle entry gate pass verified" },
    { label: "Moisture & Quality Verification", time: "10 Sep, 10:38 AM", icon: ShieldCheck, desc: "Moisture content: 13.8% (Approved within 14% limit)" },
    { label: "Electronic Weighing", time: "10 Sep, 11:05 AM", icon: Scale, desc: "Gross Weight: 420 kg on Certified Scale #1" },
    { label: "Procurement Accepted", time: "10 Sep, 11:22 AM", icon: CheckCircle2, desc: "Signed receipt issued by Officer P. V. Thomas" },
    { label: "Direct Bank Payment", time: "Estimated within 24h", icon: IndianRupee, desc: "DBT settlement to SBI A/C ****4891" },
  ];

  return (
    <div className="content-stack pt-2 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold">Procurement Status Tracking</h1>
          <p className="text-xs text-muted-foreground">Step-by-step physical processing journey</p>
        </div>
      </div>

      {/* Summary Card */}
      <section className="summary-card relative overflow-hidden rounded-3xl bg-primary p-4 text-primary-foreground shadow-xl">
        <div className="pointer-events-none absolute inset-0 bg-dots text-white/10" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="eyebrow text-secondary">Token #{activeBooking?.queueNumber || 47}</span>
            <h2 className="font-display text-2xl font-bold mt-1">
              {activeBooking
                ? `${activeBooking.crop} · ${activeBooking.quantityKg} kg`
                : language === "ml"
                ? "നെല്ല് · 420 kg"
                : "Paddy · 420 kg"}
            </h2>
            <p className="text-xs text-primary-foreground/75">Kottayam Procurement Centre · Gate 1</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase text-primary-foreground/60 block">Total MSP</span>
            <strong className="font-display text-2xl font-bold text-secondary">₹13,440</strong>
          </div>
        </div>
      </section>

      {/* Timeline Steps */}
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-4">
        <div className="timeline pl-1 space-y-4">
          {steps.map((s, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;
            const isPending = idx > currentStep;
            const Icon = s.icon;

            return (
              <div key={s.label} className="relative flex items-start gap-3.5">
                {/* Connecting vertical line */}
                {idx < steps.length - 1 && (
                  <div
                    className={`absolute left-3.5 top-8 w-0.5 h-12 transition-colors ${
                      isDone ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}

                {/* Icon marker */}
                <div
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    isDone
                      ? "bg-primary text-primary-foreground ring-2 ring-primary/20"
                      : isCurrent
                      ? "bg-secondary text-secondary-foreground ring-4 ring-secondary/30 animate-pulse"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  <Icon className="size-3.5" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold ${isCurrent ? "text-primary font-extrabold" : ""}`}>
                      {s.label}
                    </h4>
                    <span className="text-[10px] text-muted-foreground">{s.time}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
