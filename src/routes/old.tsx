import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect, useRef } from "react";
import { useKisanQueue } from "@/lib/store";
import { t, SUPPORTED_LANGUAGES } from "@/lib/translations";
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
  Calendar,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Ticket,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  X,
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

const PRESET_QUANTITIES = [100, 250, 500, 1000];

function SeniorCitizenModePage() {
  const navigate = useNavigate();
  const {
    user,
    language,
    setLanguage,
    activeBooking,
    nowServing,
    predictWaitingTime,
    centres,
    bookSlot,
    cancelBooking,
    queue,
  } = useKisanQueue();

  // Accessibility state
  const [fontScale, setFontScale] = useState<"normal" | "large" | "huge">("large");
  const [highContrast, setHighContrast] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechNotice, setSpeechNotice] = useState<string>("");

  // Booking selection state
  const [selectedCrop, setSelectedCrop] = useState(CROP_ITEMS[0]);
  const [quantity, setQuantity] = useState<number>(250);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);
  const [recentBookingId, setRecentBookingId] = useState<string | null>(null);

  // Cancellation confirm modal
  const [showCancelModal, setShowCancelModal] = useState(false);

  const activeCentre = centres[0] || {
    id: "centre-ktm",
    name: "കോട്ടയം സംഭരണ കേന്ദ്രം (Kottayam Centre)",
    address: "സിവിൽ സ്റ്റേഷൻ റോഡ്, കളക്ടറേറ്റിന് സമീപം, കോട്ടയം",
    phone: "+91 94471 23456",
  };

  const prediction = activeBooking
    ? predictWaitingTime(activeBooking.centreId || activeCentre.id, activeBooking.queueNumber)
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

    utterance.rate = 0.85; // Slower, clearer cadence for elderly citizens
    utterance.pitch = 1.0;

    // Try finding Malayalam or Indian English voice
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

  // Handle instant 1-tap booking
  const handleInstantBook = () => {
    const todayStr = "Today (ഇന്ന്)";
    const slotStr = "Immediate Slot (തൽക്ഷണം)";

    const newBooking = bookSlot(
      activeCentre.id,
      selectedCrop.nameEn,
      quantity,
      todayStr,
      slotStr
    );

    setRecentBookingId(newBooking.id);
    setBookingSuccessModal(true);

    // Speak aloud confirmation
    const mlSpeech = `നിങ്ങളുടെ ടോക്കൺ നമ്പർ ${newBooking.queueNumber} വിജയകരമായി എടുത്തു. വിള: ${selectedCrop.nameMl}, തൂക്കം ${quantity} കിലോ. ഇപ്പോൾ വിളിക്കുന്നത് ${nowServing}. നിങ്ങളുടെ ഊഴത്തിനായി കാത്തിരിക്കുക.`;
    const enSpeech = `Your Token Number ${newBooking.queueNumber} is booked successfully for ${selectedCrop.nameEn}, ${quantity} kilograms. Now serving is ${nowServing}.`;
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
    <div
      className={`min-h-screen pb-20 ${
        highContrast
          ? "bg-black text-white"
          : "bg-amber-50/40 text-stone-900 dark:bg-stone-950 dark:text-stone-100"
      } ${scaleClass}`}
    >
      {/* Top Banner: Easy Exit & Senior Mode Title */}
      <header
        className={`sticky top-0 z-40 border-b px-4 py-3 shadow-md backdrop-blur-md transition-colors ${
          highContrast
            ? "border-yellow-400 bg-black text-yellow-300"
            : "border-amber-200 bg-amber-100/95 dark:border-stone-800 dark:bg-stone-900/95"
        }`}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          {/* Back to normal portal */}
          <button
            onClick={() => navigate({ to: "/" })}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 font-bold shadow-sm transition-all active:scale-95 ${
              highContrast
                ? "bg-yellow-400 text-black hover:bg-yellow-300"
                : "bg-white text-stone-800 border border-amber-300 hover:bg-amber-50 dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700"
            }`}
            title="സാധാരണ വെബ്‌സൈറ്റിലേക്ക് മടങ്ങുക"
          >
            <ArrowLeft className="size-6 shrink-0 text-amber-700 dark:text-amber-400" />
            <span className="text-base font-extrabold sm:text-lg">
              സാധാരണ മോഡ് (Exit)
            </span>
          </button>

          {/* Senior badge */}
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-black text-white shadow">
              👵 60+ ജ്യേഷ്ഠ കിസാൻ
            </span>
            <p className="text-[12px] font-bold text-stone-600 dark:text-stone-400 mt-0.5">
              ലളിതമായ സേവനം
            </p>
          </div>
        </div>

        {/* Accessibility Toolbar: Text Size + Voice Narration + Language */}
        <div className="mx-auto mt-2 flex max-w-2xl flex-wrap items-center justify-between gap-2 pt-1 border-t border-amber-200/60 dark:border-stone-800">
          {/* Text Size Stepper */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
              അക്ഷരങ്ങൾ:
            </span>
            <button
              onClick={() => setFontScale("normal")}
              className={`rounded-xl px-2.5 py-1 text-sm font-bold transition-colors ${
                fontScale === "normal"
                  ? "bg-stone-900 text-white dark:bg-white dark:text-black"
                  : "bg-white/80 border border-stone-300 text-stone-800 dark:bg-stone-800 dark:text-white"
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontScale("large")}
              className={`rounded-xl px-3 py-1 text-base font-extrabold transition-colors ${
                fontScale === "large"
                  ? "bg-stone-900 text-white dark:bg-white dark:text-black"
                  : "bg-white/80 border border-stone-300 text-stone-800 dark:bg-stone-800 dark:text-white"
              }`}
            >
              A+
            </button>
            <button
              onClick={() => setFontScale("huge")}
              className={`rounded-xl px-3 py-1 text-lg font-black transition-colors ${
                fontScale === "huge"
                  ? "bg-stone-900 text-white dark:bg-white dark:text-black"
                  : "bg-white/80 border border-stone-300 text-stone-800 dark:bg-stone-800 dark:text-white"
              }`}
            >
              A++
            </button>
          </div>

          {/* Voice Reading Trigger */}
          <button
            onClick={() => {
              if (activeBooking) {
                const mlMsg = `നിങ്ങളുടെ ടോക്കൺ നമ്പർ ${activeBooking.queueNumber} ആണ്. ഇപ്പോൾ വിളിക്കുന്നത് ${nowServing}. നിങ്ങളുടെ മുന്നിൽ ${farmersAhead} കർഷകരുണ്ട്. പ്രതീക്ഷിക്കുന്ന കാത്തിരിപ്പ് സമയം ${prediction.minutesLeft} മിനിറ്റ്.`;
                const enMsg = `Your Token Number is ${activeBooking.queueNumber}. Now serving is ${nowServing}. There are ${farmersAhead} farmers ahead of you. Estimated wait is ${prediction.minutesLeft} minutes.`;
                speakText(mlMsg, enMsg);
              } else {
                const mlMsg = `നിങ്ങൾക്ക് നിലവിൽ ടോക്കൺ ഇല്ല. താഴെയുള്ള വിളകളിൽ നിന്ന് നെല്ല്, തേങ്ങ അല്ലെങ്കിൽ റബ്ബർ തിരഞ്ഞെടുത്ത് പച്ച ബട്ടൺ അമർത്തി ടോക്കൺ എടുക്കുക. സഹായത്തിന് 1800 425 1661 എന്ന നമ്പറിലേക്ക് വിളിക്കാം.`;
                const enMsg = `You have no active token. Select your crop below and tap the green button to book a token, or call toll-free 1800-425-1661.`;
                speakText(mlMsg, enMsg);
              }
            }}
            className={`flex items-center gap-2 rounded-2xl px-3.5 py-1.5 text-sm font-extrabold shadow-sm transition-transform active:scale-95 ${
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
          <div className="mx-auto mt-2 max-w-2xl rounded-xl bg-emerald-950 p-2 text-center text-xs font-bold text-emerald-200 shadow-inner">
            🔊 {speechNotice}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-2xl px-4 pt-4 space-y-6">
        {/* Welcome Greeting Banner */}
        <section className="rounded-3xl bg-gradient-to-r from-emerald-800 to-emerald-950 p-5 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                നമസ്കാരം, {user.name} ചേട്ടാ
              </span>
              <h1 className="text-2xl font-black sm:text-3xl">
                കിസാൻ ക്യൂ സഹായി
              </h1>
              <p className="text-sm text-emerald-100/90 font-medium">
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
          <section className="relative overflow-hidden rounded-[32px] border-4 border-emerald-500 bg-white p-6 shadow-2xl dark:border-emerald-600 dark:bg-stone-900">
            <div className="flex items-center justify-between border-b pb-4 border-stone-200 dark:border-stone-800">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-sm font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 className="size-5 text-emerald-600" />
                നിങ്ങളുടെ ടോക്കൺ സജീവം (Active)
              </span>
              <span className="text-sm font-bold text-stone-500 font-mono">
                {activeBooking.date}
              </span>
            </div>

            {/* Giant Token Metric */}
            <div className="my-6 text-center">
              <p className="text-base font-bold text-stone-600 dark:text-stone-400">
                നിങ്ങളുടെ ടോക്കൺ നമ്പർ
              </p>
              <div className="my-2 inline-block rounded-3xl bg-emerald-50 border-2 border-emerald-500 px-8 py-4 shadow-sm dark:bg-emerald-950/50">
                <p className="font-display text-6xl font-black text-emerald-800 dark:text-emerald-300 tracking-tight sm:text-7xl">
                  #{activeBooking.queueNumber}
                </p>
              </div>
              <p className="text-sm font-extrabold text-stone-700 dark:text-stone-300">
                {activeBooking.crop} · {activeBooking.quantityKg} kg
              </p>
            </div>

            {/* Queue Metrics Comparison */}
            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-amber-50 p-4 border border-amber-200 dark:bg-stone-800 dark:border-stone-700">
              <div className="text-center border-r border-amber-300 dark:border-stone-700 pr-2">
                <span className="text-xs font-extrabold text-stone-600 dark:text-stone-400 block">
                  ഇപ്പോൾ വിളിക്കുന്നത്
                </span>
                <span className="font-display text-3xl font-black text-amber-800 dark:text-amber-400">
                  #{nowServing}
                </span>
                <span className="text-[11px] font-bold text-stone-500 block">
                  (ഗേറ്റ് 1 ൽ)
                </span>
              </div>
              <div className="text-center pl-2">
                <span className="text-xs font-extrabold text-stone-600 dark:text-stone-400 block">
                  നിങ്ങളുടെ മുന്നിൽ
                </span>
                <span className="font-display text-3xl font-black text-stone-800 dark:text-white">
                  {farmersAhead} പേർ
                </span>
                <span className="text-[11px] font-bold text-stone-500 block">
                  ~{prediction.minutesLeft} മിനിറ്റ് കാത്തിരിപ്പ്
                </span>
              </div>
            </div>

            {/* Centre Location */}
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-stone-100 p-3.5 text-stone-800 dark:bg-stone-800/80 dark:text-stone-200">
              <MapPin className="size-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-base font-extrabold">
                  {activeBooking.centreName}
                </strong>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {activeCentre.address}
                </p>
              </div>
            </div>

            {/* Voice & Action Buttons */}
            <div className="mt-5 space-y-3">
              <button
                onClick={() => {
                  const mlMsg = `നിങ്ങളുടെ ടോക്കൺ നമ്പർ ${activeBooking.queueNumber} ആണ്. ഇപ്പോൾ കൗണ്ടറിൽ വിളിക്കുന്നത് നമ്പർ ${nowServing}. നിങ്ങളുടെ മുന്നിൽ ${farmersAhead} കർഷകരുണ്ട്. ഏകദേശം ${prediction.minutesLeft} മിനിറ്റിനകം നിങ്ങളുടെ ഊഴം എത്തും. കോട്ടയം സംഭരണ കേന്ദ്രത്തിലേക്ക് എത്തിച്ചേരുക.`;
                  const enMsg = `Your Token Number is ${activeBooking.queueNumber}. Currently serving token is ${nowServing}. There are ${farmersAhead} farmers ahead of you. Estimated wait is ${prediction.minutesLeft} minutes.`;
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
                    activeBooking.centreName + " Kottayam"
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-stone-300 bg-white py-3.5 font-bold text-stone-800 hover:bg-stone-50 shadow-sm dark:bg-stone-800 dark:text-white dark:border-stone-700"
                >
                  <MapPin className="size-5 text-emerald-600" />
                  <span>വഴി അറിയുക (Map)</span>
                </a>

                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center justify-center gap-1.5 rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3.5 font-bold text-red-700 hover:bg-red-100 transition-colors dark:bg-red-950/40 dark:text-red-300 dark:border-red-900"
                >
                  <X className="size-5" />
                  <span>റദ്ദാക്കുക</span>
                </button>
              </div>
            </div>
          </section>
        ) : (
          /* NO TOKEN NOTICE */
          <div className="rounded-3xl border-2 border-dashed border-stone-300 bg-white p-5 text-center dark:border-stone-700 dark:bg-stone-900">
            <Ticket className="mx-auto size-12 text-stone-400" />
            <h2 className="mt-2 text-xl font-black text-stone-800 dark:text-stone-100">
              ഇപ്പോൾ നിങ്ങളുടെ പക്കൽ ടോക്കൺ ഇല്ല
            </h2>
            <p className="mt-1 text-sm font-medium text-stone-600 dark:text-stone-400">
              താഴെ നിങ്ങളുടെ വിളയും തൂക്കവും തിരഞ്ഞെടുത്ത് ഒറ്റ അമർത്തലിൽ ടോക്കൺ എടുക്കാം.
            </p>
          </div>
        )}

        {/* SECTION 2: 1-TAP INSTANT TOKEN BOOKING */}
        <section className="rounded-[32px] border-2 border-amber-300/80 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-stone-900 space-y-6">
          <div className="flex items-center justify-between border-b pb-4 border-stone-200 dark:border-stone-800">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                സ്റ്റെപ്പ് 1 & 2
              </span>
              <h2 className="text-2xl font-black text-stone-900 dark:text-white">
                🌾 പുതിയ ടോക്കൺ എടുക്കുക
              </h2>
            </div>
            <button
              onClick={() => {
                const mlMsg = `പുതിയ ടോക്കൺ എടുക്കുന്നതിനായി ആദ്യം നിങ്ങളുടെ വിള തിരഞ്ഞെടുക്കുക. നെല്ല്, തേങ്ങ, റബ്ബർ തുടങ്ങിയവ താഴെയുണ്ട്. തുടർന്ന് എത്ര കിലോ ഉണ്ടെന്ന് തിരഞ്ഞെടുത്ത് ഏറ്റവും താഴെയുള്ള വലിയ പച്ച ബട്ടൺ അമർത്തുക.`;
                const enMsg = `To book a new token, first select your crop from below, choose the weight in kilograms, and then tap the big green button at the bottom.`;
                speakText(mlMsg, enMsg);
              }}
              className="flex items-center gap-1.5 rounded-2xl bg-amber-100 border border-amber-300 px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-200 dark:bg-stone-800 dark:text-amber-300 dark:border-stone-700"
            >
              <Volume2 className="size-4" />
              <span>സഹായം കേൾക്കുക</span>
            </button>
          </div>

          {/* Crop Selector with Big Images */}
          <div className="space-y-2.5">
            <label className="block text-base font-extrabold text-stone-800 dark:text-stone-200">
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
                        ? "border-emerald-600 bg-emerald-50 ring-4 ring-emerald-500/20 shadow-md dark:bg-emerald-950/40 dark:border-emerald-500"
                        : "border-stone-200 bg-stone-50 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800"
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
                    <span className="mt-2 text-center text-sm font-black text-stone-900 dark:text-white leading-tight">
                      {crop.nameMl}
                    </span>
                    <span className="mt-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      ₹{crop.msp} / {crop.unit}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector with Giant Stepper & Presets */}
          <div className="space-y-3 pt-2">
            <label className="block text-base font-extrabold text-stone-800 dark:text-stone-200">
              2. തൂക്കം എത്ര കിലോഗ്രാം? (Quantity in kg):
            </label>

            {/* Stepper */}
            <div className="flex items-center justify-between gap-4 rounded-3xl bg-stone-100 p-3 dark:bg-stone-800 border border-stone-300 dark:border-stone-700">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(50, q - 50))}
                className="flex size-14 items-center justify-center rounded-2xl bg-white text-stone-900 shadow-md hover:bg-stone-200 active:scale-90 font-black text-3xl border border-stone-300 dark:bg-stone-700 dark:text-white"
                title="50 കിലോ കുറയ്ക്കുക"
              >
                <Minus className="size-8 stroke-[3]" />
              </button>

              <div className="text-center">
                <span className="font-display text-4xl font-black text-emerald-800 dark:text-emerald-300 sm:text-5xl">
                  {quantity}
                </span>
                <span className="ml-1.5 text-lg font-bold text-stone-600 dark:text-stone-300">
                  kg
                </span>
              </div>

              <button
                type="button"
                onClick={() => setQuantity((q) => q + 50)}
                className="flex size-14 items-center justify-center rounded-2xl bg-white text-stone-900 shadow-md hover:bg-stone-200 active:scale-90 font-black text-3xl border border-stone-300 dark:bg-stone-700 dark:text-white"
                title="50 കിലോ കൂട്ടുക"
              >
                <Plus className="size-8 stroke-[3]" />
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
                      : "bg-white text-stone-800 border-stone-300 hover:bg-stone-100 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700"
                  }`}
                >
                  {val} kg
                </button>
              ))}
            </div>

            {/* Calculated Estimated MSP Payout */}
            <div className="flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 p-4 dark:bg-emerald-950/50 dark:border-emerald-800">
              <div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                  കണക്കാക്കിയ തുക (Estimated MSP Bank Credit)
                </span>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {quantity} kg × ₹{selectedCrop.msp} / kg
                </p>
              </div>
              <div className="text-right">
                <span className="font-display text-2xl font-black text-emerald-800 dark:text-emerald-300">
                  ₹{(quantity * selectedCrop.msp).toLocaleString("en-IN")}
                </span>
                <span className="block text-[10px] font-bold text-stone-500">
                  നേരിട്ട് ബാങ്കിലേക്ക് (DBT)
                </span>
              </div>
            </div>
          </div>

          {/* GIANT 1-TAP CONFIRM BUTTON */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleInstantBook}
              className="flex w-full items-center justify-center gap-3 rounded-3xl bg-emerald-600 py-5 px-6 font-black text-white shadow-2xl hover:bg-emerald-700 active:scale-95 transition-all text-xl sm:text-2xl border-4 border-emerald-400/50"
            >
              <Ticket className="size-8" />
              <span>✅ ടോക്കൺ എടുക്കുക (CONFIRM)</span>
            </button>
            <p className="mt-2 text-center text-xs font-bold text-stone-500 dark:text-stone-400">
              അമർത്തുമ്പോൾ തന്നെ ഇന്നത്തെ തീയതിയിൽ ടോക്കൺ നമ്പർ നൽകും
            </p>
          </div>
        </section>

        {/* SECTION 3: DIRECT TOLL-FREE CALL HELPLINE CARD */}
        <section className="rounded-3xl border-2 border-emerald-300 bg-emerald-50 p-5 shadow-lg dark:border-stone-700 dark:bg-stone-900 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow">
              <Phone className="size-7" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                സഹായം വേണോ? (Need Assistance?)
              </span>
              <h3 className="text-xl font-black text-stone-900 dark:text-white">
                ഫോണിൽ വിളിച്ച് ടോക്കൺ എടുക്കാം
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">
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
              href={`tel:${activeCentre.phone}`}
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-stone-300 bg-white py-4 px-4 font-black text-stone-800 shadow-sm hover:bg-stone-100 active:scale-95 transition-all text-base dark:bg-stone-800 dark:text-white dark:border-stone-700"
            >
              <Phone className="size-5 text-emerald-600" />
              <span>കോട്ടയം കേന്ദ്രം: 9447123456</span>
            </a>
          </div>
        </section>

        {/* SECTION 4: PROCUREMENT CENTRE LOCATION & TIMINGS */}
        <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900 space-y-3">
          <h3 className="text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
            <MapPin className="size-5 text-emerald-600" />
            <span>സംഭരണ കേന്ദ്രം വിവരങ്ങൾ (Centre Details)</span>
          </h3>

          <div className="space-y-2 text-sm text-stone-700 dark:text-stone-300">
            <div className="rounded-2xl bg-stone-50 p-3 dark:bg-stone-800">
              <strong className="block font-black text-stone-900 dark:text-white">
                {activeCentre.name}
              </strong>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                {activeCentre.address}
              </p>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-stone-50 p-3 text-xs font-bold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
              <span className="flex items-center gap-1.5">
                <Clock className="size-4 text-emerald-600" />
                പ്രവർത്തന സമയം:
              </span>
              <span>രാവിലെ 8:30 മുതൽ വൈകിട്ട് 5:00 വരെ</span>
            </div>
          </div>
        </section>

        {/* Bottom Back Button */}
        <div className="pt-4 text-center">
          <button
            onClick={() => navigate({ to: "/" })}
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-stone-300 bg-white px-6 py-3 font-extrabold text-stone-800 shadow-sm hover:bg-stone-100 active:scale-95 transition-all dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700 text-base"
          >
            <ArrowLeft className="size-5" />
            <span>സാധാരണ വെബ്‌സൈറ്റിലേക്ക് മടങ്ങുക (Return)</span>
          </button>
        </div>
      </main>

      {/* MODAL 1: BOOKING CONFIRMATION SUCCESS */}
      {bookingSuccessModal && activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-[32px] border-4 border-emerald-500 bg-white p-6 shadow-2xl dark:bg-stone-900 text-center space-y-4">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner dark:bg-emerald-950">
              <CheckCircle2 className="size-12 stroke-[2.5]" />
            </div>

            <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              ടോക്കൺ ലഭിച്ചു! (Success)
            </span>

            <h3 className="text-2xl font-black text-stone-900 dark:text-white">
              ടോക്കൺ നമ്പർ #{activeBooking.queueNumber}
            </h3>

            <p className="text-sm font-bold text-stone-600 dark:text-stone-300">
              {activeBooking.crop} · {activeBooking.quantityKg} kg
            </p>

            <div className="rounded-2xl bg-amber-50 p-3 border border-amber-200 text-xs font-bold text-amber-900 dark:bg-stone-800 dark:border-stone-700 dark:text-amber-300">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-[32px] border-4 border-red-500 bg-white p-6 shadow-2xl dark:bg-stone-900 text-center space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-inner dark:bg-red-950">
              <AlertCircle className="size-10" />
            </div>

            <h3 className="text-xl font-black text-stone-900 dark:text-white">
              ടോക്കൺ റദ്ദാക്കണമോ?
            </h3>

            <p className="text-sm font-bold text-stone-600 dark:text-stone-300">
              ടോക്കൺ #{activeBooking.queueNumber} ഒഴിവാക്കിയാൽ ക്യൂവിൽ നിങ്ങളുടെ സ്ഥാനം നഷ്ടപ്പെടും.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 rounded-2xl border-2 border-stone-300 bg-white py-3 font-bold text-stone-800 hover:bg-stone-100 dark:bg-stone-800 dark:text-white dark:border-stone-700"
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
