import React, { useState } from "react";
import { useKisanQueue } from "@/lib/store";
import { X, PhoneCall, Headphones, MessageSquare, Check, Sparkles, Volume2 } from "lucide-react";

export function AssistedBookingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { bookSlot, centres, crops, addNotification } = useKisanQueue();
  const [callerName, setCallerName] = useState("Arun Kumar");
  const [assistedCrop, setAssistedCrop] = useState("Paddy (നെല്ല്)");
  const [isCalling, setIsCalling] = useState(false);
  const [booked, setBooked] = useState(false);

  if (!isOpen) return null;

  const handleAssistedBook = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalling(true);
    setTimeout(() => {
      bookSlot(centres[0].id, assistedCrop, 500, "11 Sep 2026", "11:00 AM – 12:00 PM");
      setIsCalling(false);
      setBooked(true);
      addNotification("Assisted Booking Confirmed", "Krishi Bhavan desk officer booked your slot on your behalf.", "booking");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-border bg-card text-foreground shadow-2xl p-5">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-secondary/30 text-primary">
            <Headphones className="size-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Digital Literacy Support
            </span>
            <h2 className="font-display text-lg font-bold">Assisted Booking Hotline</h2>
          </div>
        </div>

        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          For elderly farmers or those with basic keypad phones, centre staff and Krishi Bhavan field officers can book slots on their behalf.
        </p>

        {!booked ? (
          <form onSubmit={handleAssistedBook} className="mt-4 space-y-3.5">
            <div className="rounded-2xl border border-border bg-muted/40 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <PhoneCall className="size-3.5 text-primary" /> Toll-Free Voice Assistance:
                </span>
                <span className="font-mono text-xs font-bold text-primary">1800-425-1661</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Supported Languages: Malayalam (മലയാളം), English, Tamil (தமிழ்), Hindi (हिंदी).
              </p>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Farmer Name</label>
              <input
                type="text"
                value={callerName}
                onChange={(e) => setCallerName(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs font-semibold outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Crop to Harvest</label>
              <select
                value={assistedCrop}
                onChange={(e) => setAssistedCrop(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs font-semibold outline-none"
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary flex items-center gap-2">
              <Volume2 className="size-4 shrink-0" />
              <span>Audio confirmation and SMS token will be sent directly to your registered number.</span>
            </div>

            <button
              type="submit"
              disabled={isCalling}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md transition-all hover:scale-[1.01]"
            >
              {isCalling ? (
                <span>Connecting to Krishi Bhavan Desk...</span>
              ) : (
                <>
                  <span>Confirm Assisted Booking</span>
                  <Check className="size-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="py-6 text-center space-y-3">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
              <Check className="size-6 stroke-[3]" />
            </div>
            <h3 className="font-display text-lg font-bold">Assisted Reservation Confirmed!</h3>
            <p className="text-xs text-muted-foreground">
              A voice confirmation and SMS token have been dispatched to +91 94471 28930.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
