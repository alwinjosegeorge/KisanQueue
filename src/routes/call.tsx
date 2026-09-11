import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useKisanQueue } from "@/lib/store";
import { IVRCallSimulator } from "@/components/ivr/IVRCallSimulator";
import { PhoneCall, ArrowLeft, Headphones, Radio, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/call")({
  head: () => ({
    meta: [
      { title: "Toll-Free IVR Call Booking (1800-425-1661) — KisanQueue" },
      {
        name: "description",
        content: "Simulate booking a harvest procurement slot over a normal feature-phone voice call via automated IVR with DTMF tones and SMS confirmation.",
      },
    ],
  }),
  component: IVRCallRoutePage,
});

function IVRCallRoutePage() {
  const { largeText, highContrast } = useKisanQueue();
  const navigate = useNavigate();

  return (
    <div
      className={`min-h-screen bg-stone-50 text-stone-900 flex flex-col ${
        largeText ? "text-lg" : ""
      } ${highContrast ? "contrast-125" : ""}`}
    >
      {/* Top Bar Header */}
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur-md px-4 py-3 sm:px-6 shadow-xs">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="flex size-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer shadow-xs"
              title="Return to Farmer Dashboard"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Headphones className="size-4" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <span>Toll-Free Voice IVR Call Simulator</span>
                  <span className="rounded-full bg-emerald-100 text-emerald-900 px-2 py-0.5 text-[10px] font-mono font-bold border border-emerald-200">
                    1800-425-1661
                  </span>
                </h1>
                <p className="text-[11px] text-stone-500">
                  Dial from any keypad or landline phone · Dual-language DTMF audio
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-xs font-bold text-stone-700 transition-colors cursor-pointer shadow-xs"
            >
              <span>Back to Farmer Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: Feature Context & Instructions for Evaluators */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-stone-200 bg-white p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Sparkles className="size-4 text-emerald-700" />
              <span>Digital Inclusion Innovation</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 leading-snug">
              Procurement Booking for Basic Keypad Phones
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              In Kerala, hundreds of thousands of elder and rural farmers do not operate smartphones or lack reliable data connections.
              KisanQueue bridges this divide with an automated, bilingual IVR Toll-Free service (`1800-425-1661`).
            </p>

            <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-700">
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wide">
                Staff &amp; IVR 6-Step Script Flow:
              </h3>
              <ul className="space-y-1.5 text-[11px] text-stone-600">
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-emerald-800 font-mono">1.</span>
                  <span><strong className="text-stone-900">Verify Identity &amp; Language:</strong> Auto-detects caller ID / confirms registered phone.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-emerald-800 font-mono">2.</span>
                  <span><strong className="text-stone-900">Location Details:</strong> Chooses district and nearest procurement yard.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-emerald-800 font-mono">3.</span>
                  <span><strong className="text-stone-900">Crop &amp; Quantity:</strong> Records harvest crop (Paddy/Coconut/Rubber) and checks moisture.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-emerald-800 font-mono">4.</span>
                  <span><strong className="text-stone-900">Slot Reservation:</strong> Picks next available window and registers a backup slot.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-emerald-800 font-mono">5.</span>
                  <span><strong className="text-stone-900">Alternate Contact:</strong> Takes a secondary family/neighbour phone number for alerts.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-emerald-800 font-mono">6.</span>
                  <span><strong className="text-stone-900">Confirmation &amp; SMS:</strong> Reads back details, assigns Token, updates the real database, and sends SMS.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Key Advantages Card */}
          <div className="rounded-3xl border border-emerald-200/80 bg-emerald-50/70 p-4 space-y-2 text-xs shadow-xs">
            <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-800" />
              <span>Unified Backend Architecture</span>
            </h4>
            <p className="text-[11px] text-emerald-900/85 leading-relaxed">
              Whether booked via the smartphone web app, Krishi Bhavan desk officer, or this Toll-Free phone call, all bookings feed into the <strong>exact same live queue database</strong> with shared capacity limits and DBT payment pipelines.
            </p>
          </div>
        </div>

        {/* Right 7 Cols: Interactive Phone Keypad Simulator */}
        <div className="lg:col-span-7 flex justify-center">
          <IVRCallSimulator
            onNavigateToDashboard={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/?screen=home";
              } else {
                navigate({ to: "/" });
              }
            }}
            onNavigateToQueue={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/?screen=queue";
              } else {
                navigate({ to: "/" });
              }
            }}
          />
        </div>
      </main>
    </div>
  );
}
