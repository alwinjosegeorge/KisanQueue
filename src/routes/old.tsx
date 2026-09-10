import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { useKisanQueue } from "@/lib/store";
import { ProcurementCentre } from "@/lib/types";
import {
  Volume2,
  VolumeX,
  Phone,
  ArrowLeft,
  Check,
  Plus,
  Minus,
  MapPin,
  Clock,
  AlertCircle,
  Ticket,
  ChevronRight,
  CheckCircle2,
  X,
  Building2,
  Sparkles,
} from "lucide-react";

// Crop image assets
import cropPaddy from "@/assets/crop-paddy.jpg";
import cropCoconut from "@/assets/crop-coconut.jpg";
import cropRubber from "@/assets/crop-rubber.jpg";
import cropPepper from "@/assets/crop-pepper.jpg";
import cropCardamom from "@/assets/crop-cardamom.jpg";
import cropArecanut from "@/assets/crop-arecanut.jpg";
import cropNutmeg from "@/assets/crop-nutmeg.jpg";
import cropCoffee from "@/assets/crop-coffee.jpg";
import cropBanana from "@/assets/crop-banana.jpg";

export const Route = createFileRoute("/old")({
  head: () => ({
    meta: [
      { title: "ജ്യേഷ്ഠ കിസാൻ മോഡ് (60+) — KisanQueue Senior Citizen Mode" },
      {
        name: "description",
        content:
          "മുതിർന്ന കർഷകർക്കായി വലിയ അക്ഷരങ്ങളും ശബ്ദ സഹായവും അടങ്ങിയ ലളിതമായ ക്യൂ ടോക്കൺ സംവിധാനം.",
      },
    ],
  }),
  component: SeniorCitizenModePage,
});

const CROP_ITEMS = [
  {
    id: "paddy",
    nameMl: "നെല്ല് (Paddy)",
    nameEn: "Paddy",
    msp: 32,
    image: cropPaddy,
    unit: "kg",
    badge: "സർക്കാർ താങ്ങുവില",
  },
  {
    id: "coconut",
    nameMl: "തേങ്ങ (Coconut)",
    nameEn: "Raw Coconut",
    msp: 38,
    image: cropCoconut,
    unit: "kg",
    badge: "കേരഫെഡ് നിരക്ക്",
  },
  {
    id: "rubber",
    nameMl: "റബ്ബർ (Rubber RSS4)",
    nameEn: "Rubber RSS4",
    msp: 180,
    image: cropRubber,
    unit: "kg",
    badge: "ബോർഡ് സബ്സിഡി",
  },
  {
    id: "pepper",
    nameMl: "കുരുമുളക് (Black Pepper)",
    nameEn: "Black Pepper",
    msp: 520,
    image: cropPepper,
    unit: "kg",
    badge: "ഗ്രേഡ് A",
  },
  {
    id: "cardamom",
    nameMl: "ഏലം (Cardamom)",
    nameEn: "Cardamom",
    msp: 1850,
    image: cropCardamom,
    unit: "kg",
    badge: "പ്രീമിയം 8mm+",
  },
  {
    id: "arecanut",
    nameMl: "അടയ്ക്ക (Areca Nut)",
    nameEn: "Areca Nut",
    msp: 360,
    image: cropArecanut,
    unit: "kg",
    badge: "ക്യാമ്പ്കോ നിരക്ക്",
  },
  {
    id: "nutmeg",
    nameMl: "ജാതിക്ക (Nutmeg)",
    nameEn: "Nutmeg & Mace",
    msp: 280,
    image: cropNutmeg,
    unit: "kg",
    badge: "ഉണക്ക ജാതിക്ക",
  },
  {
    id: "coffee",
    nameMl: "കാപ്പി (Coffee)",
    nameEn: "Robusta Coffee",
    msp: 210,
    image: cropCoffee,
    unit: "kg",
    badge: "വയനാട് ചെറി",
  },
  {
    id: "banana",
    nameMl: "നേന്ത്രക്കായ (Banana)",
    nameEn: "Nendran Banana",
    msp: 42,
    image: cropBanana,
    unit: "kg",
    badge: "വി.എഫ്.പി.സി.കെ",
  },
];

const PRESET_QUANTITIES = [50, 100, 250, 500];

// Helper to provide friendly Malayalam names for centres
function getCentreMalayalamTitle(centreName: string) {
  if (centreName.includes("Kottayam")) return "കോട്ടയം സംഭരണ കേന്ദ്രം (Kottayam)";
  if (centreName.includes("Pala")) return "പാലാ സംഭരണ കേന്ദ്രം (Pala)";
  if (centreName.includes("Changanassery")) return "ചങ്ങനാശ്ശേരി സംഭരണ കേന്ദ്രം (Changanassery)";
  if (centreName.includes("Alappuzha")) return "ആലപ്പുഴ സംഭരണ കേന്ദ്രം (Alappuzha)";
  return centreName;
}

function SeniorCitizenModePage() {
  const navigate = useNavigate();
  const {
    user,
    language,
    activeBooking,
    nowServing,
    predictWaitingTime,
    centres,
    bookSlot,
    cancelBooking,
  } = useKisanQueue();

  // Accessibility state - PURE LIGHT UI
  const [fontScale, setFontScale] = useState<"normal" | "large" | "huge">("large");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechNotice, setSpeechNotice] = useState<string>("");

  // Booking selection state
  const [selectedCrop, setSelectedCrop] = useState(CROP_ITEMS[0]);
  const [quantity, setQuantity] = useState<number>(100);
  const [selectedCentre, setSelectedCentre] = useState<ProcurementCentre>(centres[0] || {
    id: "centre-ktm",
    name: "Kottayam Procurement Centre",
    district: "Kottayam",
    location: "Near Nagampadam Bus Station, Kottayam",
    distanceKm: 2.4,
    workingHours: "08:30 AM – 04:30 PM",
    dailyCapacityKg: 25000,
    todayBookingsCount: 142,
    currentQueueLength: 12,
    avgProcessingMinutes: 6,
    activeDelayMinutes: 0,
    status: "normal",
    slots: [],
  });

  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Prediction for current or active centre
  const activeCentreForDisplay = activeBooking
    ? centres.find((c) => c.id === activeBooking.centreId) || selectedCentre
    : selectedCentre;

  const prediction = activeBooking
    ? predictWaitingTime(activeBooking.centreId || selectedCentre.id, activeBooking.queueNumber)
    : { timeStr: "Immediate", minutesLeft: 0, delayMinutes: 0 };

  const farmersAhead = activeBooking
    ? Math.max(0, activeBooking.queueNumber - nowServing)
    : 0;

  // Web Speech API Voice synthesis helper
  const speakText = (textMl: string, textEn: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSpeechNotice("ശബ്ദ സഹായം ഈ ബ്രൗസറിൽ ലഭ്യമല്ല.");
      return;
    }

    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      setSpeechNotice("");
      return;
    }

    const textToSpeak = language === "ml" ? textMl : textEn;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    utterance.rate = 0.85; // Slower, calm, clear cadence for elderly citizens
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const mlVoice = voices.find(
      (v) => v.lang.startsWith("ml") || v.lang.includes("Malayalam")
    );
    const inVoice = voices.find(
      (v) => v.lang.includes("en-IN") || v.lang.includes("hi-IN")
    );

    if (language === "ml" && mlVoice) {
      utterance.voice = mlVoice;
      utterance.lang = "ml-IN";
    } else if (inVoice) {
      utterance.voice = inVoice;
      utterance.lang = inVoice.lang;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeechNotice(textToSpeak);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeechNotice("");
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeechNotice("");
    };

    window.speechSynthesis.speak(utterance);
  };

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle instant 1-tap booking using selected centre
  const handleInstantBook = () => {
    const todayStr = "Today (ഇന്ന്)";
    const slotStr = "Immediate Slot (തൽക്ഷണം)";

    const newBooking = bookSlot(
      selectedCentre.id,
      selectedCrop.nameEn,
      quantity,
      todayStr,
      slotStr
    );

    setBookingSuccessModal(true);

    // Speak aloud confirmation in Malayalam
    const mlSpeech = `നിങ്ങളുടെ ടോക്കൺ നമ്പർ ${newBooking.queueNumber} വിജയകരമായി എടുത്തു. സംഭരണ കേന്ദ്രം: ${getCentreMalayalamTitle(selectedCentre.name)}. വിള: ${selectedCrop.nameMl}, തൂക്കം ${quantity} കിലോ. ഇപ്പോൾ വിളിക്കുന്നത് ${nowServing}. നിങ്ങളുടെ ഊഴത്തിനായി കാത്തിരിക്കുക.`;
    const enSpeech = `Your Token Number ${newBooking.queueNumber} is booked successfully at ${selectedCentre.name} for ${selectedCrop.nameEn}, ${quantity} kilograms. Now serving is ${nowServing}.`;
    speakText(mlSpeech, enSpeech);
  };

  // Font scale class
  const scaleClass =
    fontScale === "huge"
      ? "text-2xl leading-relaxed"
      : fontScale === "large"
      ? "text-xl leading-relaxed"
      : "text-base leading-normal";

  return (
    // STRICT PURE LIGHT THEME ONLY (no dark mode styling)
    <div className={`min-h-screen bg-[#F7FAF6] text-stone-900 pb-24 ${scaleClass}`}>
      {/* Top Banner: Easy Exit & Senior Mode Title */}
      <header className="sticky top-0 z-40 border-b border-amber-200 bg-white/95 px-4 py-3 shadow-md backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          {/* Back to normal portal */}
          <button
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-2 rounded-2xl border-2 border-emerald-300 bg-emerald-50 px-4 py-2 font-black text-emerald-950 shadow-sm transition-all hover:bg-emerald-100 active:scale-95"
            title="സാധാരണ വെബ്‌സൈറ്റിലേക്ക് മടങ്ങുക"
          >
            <ArrowLeft className="size-6 shrink-0 text-emerald-800" />
            <span className="text-base font-black sm:text-lg">
              സാധാരണ മോഡ് (Exit)
            </span>
          </button>

          {/* Senior badge */}
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-3 py-1 text-xs font-black text-white shadow">
              👵 60+ ജ്യേഷ്ഠ കിസാൻ
            </span>
            <p className="text-[11px] font-bold text-stone-600 mt-0.5">
              ലളിതമായ സേവനം (Light UI)
            </p>
          </div>
        </div>

        {/* Accessibility Toolbar: Text Size + Voice Narration */}
        <div className="mx-auto mt-2 flex max-w-2xl flex-wrap items-center justify-between gap-2 border-t border-amber-100 pt-2">
          {/* Text Size Stepper */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
              അക്ഷരങ്ങൾ:
            </span>
            <button
              onClick={() => setFontScale("normal")}
              className={`rounded-xl px-3 py-1 text-sm font-bold transition-all shadow-sm ${
                fontScale === "normal"
                  ? "bg-emerald-800 text-white font-black ring-2 ring-emerald-600"
                  : "bg-white border border-stone-300 text-stone-800 hover:bg-stone-50"
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontScale("large")}
              className={`rounded-xl px-3.5 py-1 text-base font-extrabold transition-all shadow-sm ${
                fontScale === "large"
                  ? "bg-emerald-800 text-white font-black ring-2 ring-emerald-600"
                  : "bg-white border border-stone-300 text-stone-800 hover:bg-stone-50"
              }`}
            >
              A+
            </button>
            <button
              onClick={() => setFontScale("huge")}
              className={`rounded-xl px-4 py-1 text-lg font-black transition-all shadow-sm ${
                fontScale === "huge"
                  ? "bg-emerald-800 text-white font-black ring-2 ring-emerald-600"
                  : "bg-white border border-stone-300 text-stone-800 hover:bg-stone-50"
              }`}
            >
              A++
            </button>
          </div>

          {/* Voice Reading Trigger */}
          <button
            onClick={() => {
              if (activeBooking) {
                const mlMsg = `നിങ്ങളുടെ ടോക്കൺ നമ്പർ ${activeBooking.queueNumber} ആണ്. സംഭരണ കേന്ദ്രം ${activeBooking.centreName}. ഇപ്പോൾ വിളിക്കുന്നത് ${nowServing}. നിങ്ങളുടെ മുന്നിൽ ${farmersAhead} കർഷകരുണ്ട്. പ്രതീക്ഷിക്കുന്ന കാത്തിരിപ്പ് സമയം ${prediction.minutesLeft} മിനിറ്റ്.`;
                const enMsg = `Your Token Number is ${activeBooking.queueNumber} at ${activeBooking.centreName}. Now serving is ${nowServing}. There are ${farmersAhead} farmers ahead of you. Estimated wait is ${prediction.minutesLeft} minutes.`;
                speakText(mlMsg, enMsg);
              } else {
                const mlMsg = `നിങ്ങൾക്ക് നിലവിൽ ടോക്കൺ ഇല്ല. താഴെ നിന്ന് വിളയും, എത്ര കിലോ എന്നും, സംഭരണ കേന്ദ്രവും തിരഞ്ഞെടുത്ത് പച്ച ബട്ടൺ അമർത്തി ടോക്കൺ എടുക്കുക. സഹായത്തിന് 1800 425 1661 എന്ന നമ്പറിലേക്ക് വിളിക്കാം.`;
                const enMsg = `You have no active token. Select your crop, weight in kg, and procurement centre below, then tap the green button to book a token, or call toll-free 1800-425-1661.`;
                speakText(mlMsg, enMsg);
              }
            }}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-black shadow-md transition-transform active:scale-95 ${
              isSpeaking
                ? "bg-red-600 text-white animate-pulse"
                : "bg-emerald-700 text-white hover:bg-emerald-800"
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="size-5" />
                <span>ശബ്ദം നിർത്തുക</span>
              </>
            ) : (
              <>
                <Volume2 className="size-5" />
                <span>ശബ്ദത്തിൽ കേൾക്കുക</span>
              </>
            )}
          </button>
        </div>

        {/* Real-time speaking banner */}
        {speechNotice && (
          <div className="mx-auto mt-2 max-w-2xl rounded-2xl bg-emerald-100 border-2 border-emerald-300 p-2.5 text-center text-xs font-black text-emerald-950 shadow-inner">
            🔊 {speechNotice}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-2xl px-4 pt-4 space-y-6">
        {/* Welcome Greeting Banner */}
        <section className="rounded-3xl bg-emerald-800 p-5 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                നമസ്കാരം, {user.name} ചേട്ടാ
              </span>
              <h1 className="text-2xl font-black sm:text-3xl text-white">
                കിസാൻ ക്യൂ സഹായി
              </h1>
              <p className="text-sm text-emerald-100 font-medium">
                വരിനിൽക്കാതെ എളുപ്പത്തിൽ ടോക്കൺ എടുക്കാം
              </p>
            </div>
            <div className="flex size-16 shrink-0 items-center justify-center rounded-3xl bg-white/20 text-3xl shadow-inner backdrop-blur-md">
              🌾
            </div>
          </div>
        </section>

        {/* SECTION 1: ACTIVE TOKEN STATUS CARD (GIANT & CLEAR) */}
        {activeBooking ? (
          <section className="relative overflow-hidden rounded-[32px] border-4 border-emerald-500 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b pb-4 border-stone-200">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-sm font-black text-emerald-800">
                <CheckCircle2 className="size-5 text-emerald-700" />
                നിങ്ങളുടെ ടോക്കൺ സജീവം (Active)
              </span>
              <span className="text-sm font-bold text-stone-600 font-mono">
                {activeBooking.date}
              </span>
            </div>

            {/* Giant Token Metric */}
            <div className="my-6 text-center">
              <p className="text-base font-bold text-stone-600">
                നിങ്ങളുടെ ടോക്കൺ നമ്പർ
              </p>
              <div className="my-2 inline-block rounded-3xl bg-emerald-50 border-3 border-emerald-500 px-8 py-4 shadow-md">
                <p className="font-display text-6xl font-black text-emerald-800 tracking-tight sm:text-7xl">
                  #{activeBooking.queueNumber}
                </p>
              </div>
              <p className="text-sm font-black text-stone-800">
                {activeBooking.crop} · {activeBooking.quantityKg} kg
              </p>
            </div>

            {/* Queue Metrics Comparison */}
            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-amber-50 p-4 border border-amber-200">
              <div className="text-center border-r border-amber-300 pr-2">
                <span className="text-xs font-black text-stone-600 block">
                  ഇപ്പോൾ വിളിക്കുന്നത്
                </span>
                <span className="font-display text-3xl font-black text-amber-900">
                  #{nowServing}
                </span>
                <span className="text-[11px] font-bold text-stone-600 block">
                  (ഗേറ്റ് 1 ൽ)
                </span>
              </div>
              <div className="text-center pl-2">
                <span className="text-xs font-black text-stone-600 block">
                  നിങ്ങളുടെ മുന്നിൽ
                </span>
                <span className="font-display text-3xl font-black text-stone-900">
                  {farmersAhead} പേർ
                </span>
                <span className="text-[11px] font-bold text-stone-600 block">
                  ~{prediction.minutesLeft} മിനിറ്റ് കാത്തിരിപ്പ്
                </span>
              </div>
            </div>

            {/* Centre Location */}
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-stone-100 p-3.5 text-stone-900">
              <Building2 className="size-6 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-base font-black">
                  {getCentreMalayalamTitle(activeBooking.centreName)}
                </strong>
                <p className="text-xs text-stone-600">
                  {activeCentreForDisplay.location || activeCentreForDisplay.address}
                </p>
              </div>
            </div>

            {/* Voice & Action Buttons */}
            <div className="mt-5 space-y-3">
              <button
                onClick={() => {
                  const mlMsg = `നിങ്ങളുടെ ടോക്കൺ നമ്പർ ${activeBooking.queueNumber} ആണ്. കേന്ദ്രം: ${getCentreMalayalamTitle(activeBooking.centreName)}. ഇപ്പോൾ വിളിക്കുന്നത് നമ്പർ ${nowServing}. നിങ്ങളുടെ മുന്നിൽ ${farmersAhead} കർഷകരുണ്ട്. ഏകദേശം ${prediction.minutesLeft} മിനിറ്റിനകം നിങ്ങളുടെ ഊഴം എത്തും.`;
                  const enMsg = `Your Token Number is ${activeBooking.queueNumber} at ${activeBooking.centreName}. Currently serving token is ${nowServing}. There are ${farmersAhead} farmers ahead of you. Estimated wait is ${prediction.minutesLeft} minutes.`;
                  speakText(mlMsg, enMsg);
                }}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-700 py-4 font-black text-white shadow-lg hover:bg-emerald-800 active:scale-95 transition-all text-lg"
              >
                <Volume2 className="size-6" />
                <span>ഈ വിവരങ്ങൾ ശബ്ദത്തിൽ കേൾക്കുക</span>
              </button>

              <div className="flex gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    activeBooking.centreName + " Kerala"
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-stone-300 bg-white py-3.5 font-bold text-stone-800 hover:bg-stone-50 shadow-sm"
                >
                  <MapPin className="size-5 text-emerald-700" />
                  <span>വഴി അറിയുക (Map)</span>
                </a>

                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center justify-center gap-1.5 rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3.5 font-bold text-red-700 hover:bg-red-100 transition-colors"
                >
                  <X className="size-5" />
                  <span>റദ്ദാക്കുക</span>
                </button>
              </div>
            </div>
          </section>
        ) : (
          /* NO TOKEN NOTICE */
          <div className="rounded-3xl border-2 border-dashed border-stone-300 bg-white p-5 text-center shadow-sm">
            <Ticket className="mx-auto size-12 text-stone-400" />
            <h2 className="mt-2 text-xl font-black text-stone-800">
              ഇപ്പോൾ നിങ്ങളുടെ പക്കൽ ടോക്കൺ ഇല്ല
            </h2>
            <p className="mt-1 text-sm font-medium text-stone-600">
              താഴെ നിങ്ങളുടെ വിളയും, തൂക്കവും, സംഭരണ കേന്ദ്രവും തിരഞ്ഞെടുത്ത് പച്ച ബട്ടൺ അമർത്തുക.
            </p>
          </div>
        )}

        {/* SECTION 2: INSTANT TOKEN BOOKING FORM */}
        <section className="rounded-[32px] border-2 border-emerald-200 bg-white p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b pb-4 border-stone-200">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                സ്റ്റെപ്പ് 1, 2 & 3
              </span>
              <h2 className="text-2xl font-black text-stone-900">
                🌾 പുതിയ ടോക്കൺ എടുക്കുക
              </h2>
            </div>
            <button
              onClick={() => {
                const mlMsg = `പുതിയ ടോക്കൺ എടുക്കുന്നതിനായി ആദ്യം നിങ്ങളുടെ വിള തിരഞ്ഞെടുക്കുക. തുടർന്ന് എത്ര കിലോ ഉണ്ടെന്ന് 1 കിലോ വീതം കൂട്ടുകയോ കുറയ്ക്കുകയോ ചെയ്യാം. ശേഷം നിങ്ങളുടെ അടുത്തുള്ള സംഭരണ കേന്ദ്രം തിരഞ്ഞെടുത്ത് താഴെയുള്ള വലിയ പച്ച ബട്ടൺ അമർത്തുക.`;
                const enMsg = `To book a new token, first select your crop, adjust weight by 1 kg increments, pick your procurement centre, and tap the big green button at the bottom.`;
                speakText(mlMsg, enMsg);
              }}
              className="flex items-center gap-1.5 rounded-2xl bg-amber-100 border border-amber-300 px-3 py-2 text-xs font-black text-amber-900 hover:bg-amber-200"
            >
              <Volume2 className="size-4" />
              <span>സഹായം കേൾക്കുക</span>
            </button>
          </div>

          {/* STEP 1: CROP SELECTOR */}
          <div className="space-y-2.5">
            <label className="block text-base font-black text-stone-800">
              1. വിള തിരഞ്ഞെടുക്കുക (Select Crop):
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CROP_ITEMS.map((crop) => {
                const isSelected = selectedCrop.id === crop.id;
                return (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => {
                      setSelectedCrop(crop);
                      const mlMsg = `${crop.nameMl} തിരഞ്ഞെടുത്തു. താങ്ങുവില കിലോയ്ക്ക് ${crop.msp} രൂപ.`;
                      const enMsg = `Selected ${crop.nameEn}. MSP is rupees ${crop.msp} per kilogram.`;
                      speakText(mlMsg, enMsg);
                    }}
                    className={`relative flex flex-col items-center rounded-2xl p-3 text-left transition-all border-2 active:scale-95 ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50 ring-4 ring-emerald-500/20 shadow-md"
                        : "border-stone-200 bg-stone-50 hover:bg-stone-100"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow">
                        <Check className="size-4 stroke-[3]" />
                      </span>
                    )}
                    <img
                      src={crop.image}
                      alt={crop.nameEn}
                      className="size-16 rounded-xl object-cover shadow-sm"
                    />
                    <span className="mt-2 text-center text-sm font-black text-stone-900 leading-tight">
                      {crop.nameMl}
                    </span>
                    <span className="mt-0.5 text-xs font-extrabold text-emerald-700">
                      ₹{crop.msp} / {crop.unit}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: QUANTITY SELECTOR (+1 KG / -1 KG STEPPER) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-base font-black text-stone-800">
                2. തൂക്കം എത്ര കിലോഗ്രാം? (Quantity in kg):
              </label>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                +1 kg വീതം കൂട്ടാം
              </span>
            </div>

            {/* Giant +1 / -1 Stepper Controls */}
            <div className="flex items-center justify-between gap-2 rounded-3xl bg-emerald-50/70 border-2 border-emerald-300 p-3 shadow-inner">
              {/* -10 kg Fast Step */}
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 10))}
                className="flex size-11 sm:size-12 items-center justify-center rounded-2xl bg-white text-stone-700 shadow-sm border border-stone-300 font-black text-xs sm:text-sm hover:bg-stone-100 active:scale-90"
                title="10 കിലോ കുറയ്ക്കുക"
              >
                -10
              </button>

              {/* -1 kg Main Button */}
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex size-14 sm:size-16 items-center justify-center rounded-2xl bg-white text-emerald-800 shadow-md border-3 border-emerald-400 hover:bg-emerald-50 active:scale-90 font-black text-3xl"
                title="1 കിലോ കുറയ്ക്കുക (-1 kg)"
              >
                <Minus className="size-8 stroke-[3]" />
              </button>

              {/* Number Value Display & Edit */}
              <div className="text-center px-1">
                <div className="flex items-baseline justify-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="50000"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val > 0) setQuantity(val);
                      else if (e.target.value === "") setQuantity(1);
                    }}
                    className="w-24 sm:w-28 text-center font-display text-4xl sm:text-5xl font-black text-emerald-950 bg-transparent border-b-2 border-emerald-500 focus:outline-none focus:border-emerald-700"
                  />
                  <span className="text-xl font-black text-stone-600">kg</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 block mt-0.5">
                  കിലോഗ്രാം (കിലോ)
                </span>
              </div>

              {/* +1 kg Main Button */}
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex size-14 sm:size-16 items-center justify-center rounded-2xl bg-white text-emerald-800 shadow-md border-3 border-emerald-400 hover:bg-emerald-50 active:scale-90 font-black text-3xl"
                title="1 കിലോ കൂട്ടുക (+1 kg)"
              >
                <Plus className="size-8 stroke-[3]" />
              </button>

              {/* +10 kg Fast Step */}
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 10)}
                className="flex size-11 sm:size-12 items-center justify-center rounded-2xl bg-white text-stone-700 shadow-sm border border-stone-300 font-black text-xs sm:text-sm hover:bg-stone-100 active:scale-90"
                title="10 കിലോ കൂട്ടുക"
              >
                +10
              </button>
            </div>

            {/* Micro-stepper pills: +1 kg, +5 kg, +25 kg, +50 kg */}
            <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
              <span className="text-xs font-bold text-stone-500 mr-1">കൂട്ടുക:</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="rounded-xl bg-white border border-emerald-300 px-3 py-1.5 text-xs font-black text-emerald-900 shadow-sm hover:bg-emerald-50 active:scale-95"
              >
                +1 kg
              </button>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 5)}
                className="rounded-xl bg-white border border-emerald-300 px-3 py-1.5 text-xs font-black text-emerald-900 shadow-sm hover:bg-emerald-50 active:scale-95"
              >
                +5 kg
              </button>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 25)}
                className="rounded-xl bg-white border border-emerald-300 px-3 py-1.5 text-xs font-black text-emerald-900 shadow-sm hover:bg-emerald-50 active:scale-95"
              >
                +25 kg
              </button>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 50)}
                className="rounded-xl bg-white border border-emerald-300 px-3 py-1.5 text-xs font-black text-emerald-900 shadow-sm hover:bg-emerald-50 active:scale-95"
              >
                +50 kg
              </button>
            </div>

            {/* Fast Preset Chips */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {PRESET_QUANTITIES.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setQuantity(val)}
                  className={`rounded-2xl py-3 text-center text-sm font-black border transition-all active:scale-95 ${
                    quantity === val
                      ? "bg-emerald-700 text-white border-emerald-800 shadow"
                      : "bg-white text-stone-800 border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  {val} kg
                </button>
              ))}
            </div>

            {/* Calculated Estimated MSP Payout */}
            <div className="flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
              <div>
                <span className="text-xs font-bold text-emerald-800 block">
                  കണക്കാക്കിയ തുക (Estimated MSP Bank Credit)
                </span>
                <p className="text-xs text-stone-600">
                  {quantity} kg × ₹{selectedCrop.msp} / kg
                </p>
              </div>
              <div className="text-right">
                <span className="font-display text-2xl font-black text-emerald-800">
                  ₹{(quantity * selectedCrop.msp).toLocaleString("en-IN")}
                </span>
                <span className="block text-[10px] font-bold text-stone-500">
                  നേരിട്ട് ബാങ്കിലേക്ക് (DBT)
                </span>
              </div>
            </div>
          </div>

          {/* STEP 3: CENTRE SELECTOR (USER REQUESTED OPTION) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-base font-black text-stone-800">
                3. സംഭരണ കേന്ദ്രം തിരഞ്ഞെടുക്കുക (Select Centre):
              </label>
              <span className="text-xs font-bold text-emerald-800">
                {centres.length} കേന്ദ്രങ്ങൾ ലഭ്യമാണ്
              </span>
            </div>

            <div className="space-y-2.5">
              {centres.map((centre) => {
                const isSelected = selectedCentre.id === centre.id;
                const centreTitle = getCentreMalayalamTitle(centre.name);
                return (
                  <div
                    key={centre.id}
                    onClick={() => {
                      setSelectedCentre(centre);
                      const mlMsg = `${centreTitle} തിരഞ്ഞെടുത്തു. ദൂരം ${centre.distanceKm} കിലോമീറ്റർ.`;
                      const enMsg = `Selected ${centre.name}. Distance is ${centre.distanceKm} kilometers.`;
                      speakText(mlMsg, enMsg);
                    }}
                    className={`flex items-start justify-between gap-3 rounded-2xl p-4 border-2 cursor-pointer transition-all active:scale-98 ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50 ring-4 ring-emerald-500/20 shadow-md"
                        : "border-stone-200 bg-stone-50 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl font-bold shadow-sm ${
                          isSelected
                            ? "bg-emerald-700 text-white"
                            : "bg-white text-stone-600 border border-stone-300"
                        }`}
                      >
                        {isSelected ? <Check className="size-5 stroke-[3]" /> : <Building2 className="size-5" />}
                      </div>

                      <div className="min-w-0">
                        <strong className="block text-sm font-black text-stone-900 leading-tight">
                          {centreTitle}
                        </strong>
                        <p className="text-xs text-stone-600 mt-0.5">
                          {centre.location || centre.address}
                        </p>
                        <p className="text-xs font-bold text-emerald-700 mt-1 flex items-center gap-2">
                          <span>📍 {centre.distanceKm} km അകലെ</span>
                          <span>·</span>
                          <span>⏰ {centre.workingHours}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase shadow-sm ${
                          centre.status === "normal"
                            ? "bg-emerald-200 text-emerald-900 border border-emerald-300"
                            : centre.status === "busy"
                            ? "bg-amber-200 text-amber-900 border border-amber-300"
                            : "bg-red-200 text-red-900 border border-red-300"
                        }`}
                      >
                        {centre.status === "normal"
                          ? "🟢 വേഗത്തിൽ"
                          : centre.status === "busy"
                          ? "🟡 സാധാരണ"
                          : "🟠 തിരക്ക്"}
                      </span>
                      <p className="text-[11px] font-bold text-stone-600 mt-1">
                        {centre.currentQueueLength} പേർ ക്യൂവിൽ
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GIANT 1-TAP CONFIRM BUTTON */}
          <div className="pt-3">
            <button
              type="button"
              onClick={handleInstantBook}
              className="flex w-full items-center justify-center gap-3 rounded-3xl bg-emerald-700 py-5 px-6 font-black text-white shadow-2xl hover:bg-emerald-800 active:scale-95 transition-all text-xl sm:text-2xl border-4 border-emerald-500/60"
            >
              <Ticket className="size-8" />
              <span>✅ ടോക്കൺ എടുക്കുക (CONFIRM)</span>
            </button>
            <p className="mt-2 text-center text-xs font-bold text-stone-600">
              {getCentreMalayalamTitle(selectedCentre.name)} - ഇന്നത്തെ തീയതിയിൽ ടോക്കൺ നൽകും
            </p>
          </div>
        </section>

        {/* SECTION 4: DIRECT TOLL-FREE CALL HELPLINE CARD */}
        <section className="rounded-3xl border-2 border-emerald-300 bg-emerald-50 p-5 shadow-md space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow">
              <Phone className="size-7" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                സഹായം വേണോ? (Need Assistance?)
              </span>
              <h3 className="text-xl font-black text-stone-900">
                ഫോണിൽ വിളിച്ച് ടോക്കൺ എടുക്കാം
              </h3>
              <p className="text-xs text-stone-600 font-medium">
                കിസാൻ കോൾ സെന്ററിലേക്ക് സൗജന്യമായി വിളിക്കാം
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-2 sm:grid-cols-2">
            {/* Toll Free Button */}
            <a
              href="tel:18004251661"
              className="flex items-center justify-center gap-3 rounded-2xl bg-emerald-700 py-4 px-4 font-black text-white shadow hover:bg-emerald-800 active:scale-95 transition-all text-base"
            >
              <Phone className="size-6" />
              <span>1800-425-1661 (വിളിക്കുക)</span>
            </a>

            {/* Centre Manager Direct Call */}
            <a
              href={`tel:+919447123456`}
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-stone-300 bg-white py-4 px-4 font-black text-stone-800 shadow-sm hover:bg-stone-50 active:scale-95 transition-all text-base"
            >
              <Phone className="size-5 text-emerald-700" />
              <span>കേന്ദ്ര മാനേജർ: 9447123456</span>
            </a>
          </div>
        </section>

        {/* Bottom Back Button */}
        <div className="pt-4 text-center">
          <button
            onClick={() => navigate({ to: "/" })}
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-stone-300 bg-white px-6 py-3 font-extrabold text-stone-800 shadow-sm hover:bg-stone-100 active:scale-95 transition-all text-base"
          >
            <ArrowLeft className="size-5" />
            <span>സാധാരണ വെബ്‌സൈറ്റിലേക്ക് മടങ്ങുക (Return)</span>
          </button>
        </div>
      </main>

      {/* MODAL 1: BOOKING CONFIRMATION SUCCESS */}
      {bookingSuccessModal && activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-[32px] border-4 border-emerald-500 bg-white p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-inner">
              <CheckCircle2 className="size-12 stroke-[2.5]" />
            </div>

            <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-black text-emerald-800">
              ടോക്കൺ ലഭിച്ചു! (Success)
            </span>

            <h3 className="text-2xl font-black text-stone-900">
              ടോക്കൺ നമ്പർ #{activeBooking.queueNumber}
            </h3>

            <div className="rounded-2xl bg-emerald-50 p-3 border border-emerald-200 text-xs font-bold text-emerald-950 space-y-1">
              <p>കേന്ദ്രം: <strong>{getCentreMalayalamTitle(activeBooking.centreName)}</strong></p>
              <p>വിള: <strong>{activeBooking.crop} · {activeBooking.quantityKg} kg</strong></p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-3 border border-amber-200 text-xs font-bold text-amber-900">
              ഇപ്പോൾ വിളിക്കുന്നത് #{nowServing} · നിങ്ങളുടെ ഊഴം വരുമ്പോൾ അറിയിക്കും.
            </div>

            <button
              onClick={() => setBookingSuccessModal(false)}
              className="w-full rounded-2xl bg-emerald-700 py-4 text-lg font-black text-white shadow-lg hover:bg-emerald-800 active:scale-95 transition-all"
            >
              ശരി, മനസ്സിലായി (OK)
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: CANCEL TOKEN CONFIRMATION */}
      {showCancelModal && activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-[32px] border-4 border-red-500 bg-white p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-inner">
              <AlertCircle className="size-10" />
            </div>

            <h3 className="text-xl font-black text-stone-900">
              ടോക്കൺ റദ്ദാക്കണമോ?
            </h3>

            <p className="text-sm font-bold text-stone-600">
              ടോക്കൺ #{activeBooking.queueNumber} ഒഴിവാക്കിയാൽ ക്യൂവിൽ നിങ്ങളുടെ സ്ഥാനം നഷ്ടപ്പെടും.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 rounded-2xl border-2 border-stone-300 bg-white py-3 font-bold text-stone-800 hover:bg-stone-100"
              >
                വേണ്ട (Keep)
              </button>
              <button
                onClick={() => {
                  cancelBooking(activeBooking.id);
                  setShowCancelModal(false);
                  speakText(
                    "നിങ്ങളുടെ ടോക്കൺ വിജയകരമായി റദ്ദാക്കി.",
                    "Your token has been successfully cancelled."
                  );
                }}
                className="flex-1 rounded-2xl bg-red-600 py-3 font-black text-white shadow hover:bg-red-700 active:scale-95"
              >
                അതെ, റദ്ദാക്കുക
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
