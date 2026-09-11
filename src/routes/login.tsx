import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import { useKisanQueue } from "@/lib/store";
import { User, Language } from "@/lib/types";
import { SUPPORTED_LANGUAGES, t } from "@/lib/translations";
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  UserCheck,
  Volume2,
  Languages,
  ChevronRight,
  ArrowLeft,
  Sprout,
  HelpCircle,
  KeyRound,
  IdCard,
} from "lucide-react";
import heroImage from "@/assets/smartprocure-home.jpg";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Farmer Login (കർഷക ലോഗിൻ) — KisanQueue" },
      {
        name: "description",
        content: "Secure farmer authentication via Mobile OTP, Kerala Farmer ID, or Aadhaar for KisanQueue procurement portal.",
      },
    ],
  }),
  component: FarmerLoginPage,
});

const DEMO_FARMERS: User[] = [
  {
    id: "usr-01",
    name: "Arun Kumar",
    role: "farmer",
    mobile: "+91 94471 28930",
    farmerId: "KL-KTM-26047",
    village: "Kumarakom",
    district: "Kottayam",
    state: "Kerala",
    primaryCrop: "Paddy & Coconut",
    bankAccount: "SBI A/C **** 4891",
    ifsc: "SBIN0070114",
  },
  {
    id: "usr-02",
    name: "Mathew Joseph",
    role: "farmer",
    mobile: "+91 94472 15678",
    farmerId: "KL-KTM-19034",
    village: "Pala",
    district: "Kottayam",
    state: "Kerala",
    primaryCrop: "Rubber & Pepper",
    bankAccount: "Federal Bank A/C **** 9102",
    ifsc: "FDRL0001234",
  },
  {
    id: "usr-03",
    name: "K. Bhavani Amma",
    role: "farmer",
    mobile: "+91 94473 88921",
    farmerId: "KL-ALP-15022",
    village: "Kuttanad",
    district: "Alappuzha",
    state: "Kerala",
    primaryCrop: "Paddy (Kuttanad Rice)",
    bankAccount: "Canara Bank A/C **** 3321",
    ifsc: "CNRB0002145",
  },
];

function FarmerLoginPage() {
  const { language, setLanguage, setUser, setRole, addNotification } = useKisanQueue();
  const navigate = useNavigate();

  const [authMethod, setAuthMethod] = useState<"otp" | "id" | "demo">("otp");
  const [mobileNumber, setMobileNumber] = useState("9447128930");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [farmerIdInput, setFarmerIdInput] = useState("KL-KTM-26047");
  const [aadhaarInput, setAadhaarInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // Audio Speech assistance
  const playVoiceInstruction = () => {
    const text =
      language === "ml"
        ? "കിസാൻ ക്യൂ കർഷക ലോഗിനിലേക്ക് സ്വാഗതം. നിങ്ങളുടെ മൊബൈൽ നമ്പറോ ഫാർമർ ഐഡിയോ നൽകി ലോഗിൻ ചെയ്യുക."
        : "Welcome to KisanQueue Farmer Login. Please enter your mobile number or Farmer ID to sign in.";
    const audio = new Audio(
      `https://translate.google.com/translate_tts?ie=UTF-8&tl=${language}&client=tw-ob&q=${encodeURIComponent(text)}`
    );
    audio.referrerPolicy = "no-referrer";
    audio.play().catch(() => {});
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setOtpCode("2604");
      addNotification(
        "OTP Sent 📲",
        `Verification code 2604 sent to +91 ${mobileNumber}. Auto-filled for quick demo access.`,
        "sms"
      );
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const matchedFarmer = DEMO_FARMERS[0];
      setUser({
        ...matchedFarmer,
        mobile: `+91 ${mobileNumber}`,
      });
      setRole("farmer");
      addNotification("Login Successful 🎉", `Welcome back, ${matchedFarmer.name}! Verified session active.`, "booking");
      navigate({ to: "/" });
    }, 500);
  };

  const handleFarmerIdLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const matchedFarmer =
        DEMO_FARMERS.find((f) => f.farmerId?.toLowerCase() === farmerIdInput.trim().toLowerCase()) || DEMO_FARMERS[0];
      setUser({
        ...matchedFarmer,
        farmerId: farmerIdInput.trim().toUpperCase(),
      });
      setRole("farmer");
      addNotification("Farmer ID Verified 🌾", `Logged in with verified Kerala Farmer ID: ${farmerIdInput.toUpperCase()}`, "booking");
      navigate({ to: "/" });
    }, 500);
  };

  const handleQuickLogin = (farmer: User) => {
    setUser(farmer);
    setRole("farmer");
    addNotification("Instant Login ✓", `Logged in as ${farmer.name} (${farmer.primaryCrop}).`, "booking");
    navigate({ to: "/" });
  };

  return (
    <div className="relative min-h-screen bg-stone-950 text-white flex flex-col justify-between overflow-x-hidden">
      {/* Background with golden hour overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center pointer-events-none opacity-40 scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/70 to-stone-950/95 pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 flex items-center justify-between p-4 sm:p-6 border-b border-white/10 backdrop-blur-md bg-black/25">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex size-10 items-center justify-center rounded-2xl bg-white/15 hover:bg-white/25 transition-all text-white border border-white/20 shadow-sm"
            title="Go to Home"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg sm:text-xl font-black text-white tracking-tight">
                KisanQueue
              </span>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-[10px] font-extrabold text-emerald-300">
                കർഷക പോർട്ടൽ
              </span>
            </div>
            <p className="text-[11px] text-white/70">Kerala Agricultural Procurement System</p>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={playVoiceInstruction}
            className="flex size-10 items-center justify-center rounded-2xl bg-white/15 hover:bg-white/25 transition-all text-amber-300 border border-white/20"
            title="Audio Guidance / ശബ്ദ സഹായം"
          >
            <Volume2 className="size-5" />
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLanguageMenu((p) => !p)}
              className="flex items-center gap-1.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 px-3 py-2 text-xs font-bold text-white transition-all shadow-sm"
            >
              <Languages className="size-4 text-emerald-300" />
              <span>{SUPPORTED_LANGUAGES.find((l) => l.code === language)?.label || "മലയാളം"}</span>
            </button>

            {showLanguageMenu && (
              <div className="absolute right-0 top-12 z-50 w-44 rounded-2xl border border-white/20 bg-stone-900/95 backdrop-blur-xl p-1.5 shadow-2xl space-y-1">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code as Language);
                      setShowLanguageMenu(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all text-left ${
                      language === l.code ? "bg-emerald-600 text-white shadow" : "text-white/80 hover:bg-white/10"
                    }`}
                  >
                    <span>{l.label}</span>
                    {language === l.code && <CheckCircle2 className="size-3.5 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md rounded-[32px] border border-white/20 bg-stone-900/80 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl text-white">
          {/* Brand Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-emerald-700/80 text-white shadow-lg border border-emerald-400/40">
              <Sprout className="size-8 text-emerald-300" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              {language === "ml" ? "കർഷക ലോഗിൻ" : "Farmer Login"}
            </h1>
            <p className="text-xs sm:text-sm text-white/75">
              {language === "ml"
                ? "ടോക്കൺ ബുക്കിംഗിനും പേയ്‌മെന്റ് പരിശോധനയ്ക്കും ലോഗിൻ ചെയ്യുക"
                : "Sign in to book queue tokens, track payments & inspect MSP rates"}
            </p>
          </div>

          {/* Auth Method Tabs */}
          <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-black/40 p-1.5 border border-white/15 mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => setAuthMethod("otp")}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all ${
                authMethod === "otp" ? "bg-emerald-600 text-white shadow-md" : "text-white/70 hover:text-white"
              }`}
            >
              <Phone className="size-3.5" />
              <span>Mobile OTP</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod("id")}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all ${
                authMethod === "id" ? "bg-emerald-600 text-white shadow-md" : "text-white/70 hover:text-white"
              }`}
            >
              <IdCard className="size-3.5" />
              <span>Farmer ID</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod("demo")}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all ${
                authMethod === "demo" ? "bg-emerald-600 text-white shadow-md" : "text-white/70 hover:text-white"
              }`}
            >
              <Sparkles className="size-3.5 text-amber-300" />
              <span>1-Tap Demo</span>
            </button>
          </div>

          {/* TAB 1: MOBILE NUMBER & OTP */}
          {authMethod === "otp" && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/75">
                      {language === "ml" ? "മൊബൈൽ നമ്പർ" : "Mobile Number"}
                    </label>
                    <div className="flex items-center rounded-2xl border border-white/20 bg-black/40 px-3 py-3 focus-within:border-emerald-400 transition-all">
                      <span className="font-bold text-sm text-emerald-400 border-r border-white/20 pr-3 mr-3">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                        placeholder="94471 28930"
                        className="w-full bg-transparent text-sm sm:text-base font-bold text-white placeholder-white/40 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || mobileNumber.length < 10}
                    className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 transition-all py-3.5 px-4 text-sm font-black text-white shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>Sending OTP...</span>
                    ) : (
                      <>
                        <span>{language === "ml" ? "ഒ.ടി.പി അയക്കുക" : "Get Verification Code"}</span>
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
                  <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-3.5 text-xs text-emerald-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Code sent to +91 {mobileNumber}</p>
                      <p className="text-[11px] text-emerald-300">Auto-filled simulated code: 2604</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[11px] font-bold underline text-white hover:text-emerald-300"
                    >
                      Change
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/75">
                      {language === "ml" ? "4 അക്ക ഒ.ടി.പി നൽകുക" : "Enter 4-digit Code"}
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      required
                      autoFocus
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="2604"
                      className="w-full text-center tracking-[0.6em] text-2xl font-black rounded-2xl border border-white/20 bg-black/40 p-3 text-white placeholder-white/30 outline-none focus:border-emerald-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length < 4}
                    className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 transition-all py-3.5 px-4 text-sm font-black text-white shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>Verifying...</span>
                    ) : (
                      <>
                        <ShieldCheck className="size-5" />
                        <span>{language === "ml" ? "ലോഗിൻ ചെയ്യുക" : "Verify & Enter Portal"}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: KERALA FARMER ID */}
          {authMethod === "id" && (
            <form onSubmit={handleFarmerIdLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-white/75">
                  {language === "ml" ? "കേരള കർഷക ഐഡി" : "Kerala Farmer Registration ID"}
                </label>
                <div className="flex items-center rounded-2xl border border-white/20 bg-black/40 px-3.5 py-3 focus-within:border-emerald-400 transition-all">
                  <IdCard className="size-5 text-emerald-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    required
                    value={farmerIdInput}
                    onChange={(e) => setFarmerIdInput(e.target.value.toUpperCase())}
                    placeholder="KL-KTM-26047"
                    className="w-full bg-transparent text-sm sm:text-base font-bold text-white uppercase placeholder-white/40 outline-none"
                  />
                </div>
                <p className="text-[11px] text-white/60">
                  Example: <code className="text-emerald-300 font-bold">KL-KTM-26047</code>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-white/75">
                  {language === "ml" ? "ആധാർ നമ്പർ (ഐച്ഛികം)" : "Aadhaar Number (Optional)"}
                </label>
                <input
                  type="password"
                  maxLength={12}
                  value={aadhaarInput}
                  onChange={(e) => setAadhaarInput(e.target.value.replace(/\D/g, ""))}
                  placeholder="•••• •••• 4891"
                  className="w-full rounded-2xl border border-white/20 bg-black/40 px-3.5 py-3 text-sm font-bold text-white placeholder-white/40 outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !farmerIdInput}
                className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 transition-all py-3.5 px-4 text-sm font-black text-white shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <UserCheck className="size-5" />
                    <span>{language === "ml" ? "ഐഡി വഴി ലോഗിൻ ചെയ്യുക" : "Login with Farmer ID"}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: 1-TAP DEMO PROFILES */}
          {authMethod === "demo" && (
            <div className="space-y-2.5">
              <p className="text-xs text-white/75 text-center mb-3">
                Select an authentic pre-configured farmer profile to test the app instantly:
              </p>
              {DEMO_FARMERS.map((farmer) => (
                <button
                  key={farmer.id}
                  type="button"
                  onClick={() => handleQuickLogin(farmer)}
                  className="w-full flex items-center justify-between rounded-2xl border border-white/15 bg-black/40 p-3.5 hover:bg-emerald-800/40 hover:border-emerald-400/50 transition-all text-left group shadow-sm active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-700/60 text-white font-black text-sm border border-emerald-400/40">
                      🌾
                    </div>
                    <div>
                      <p className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
                        {farmer.name}
                      </p>
                      <p className="text-[11px] text-white/70">
                        {farmer.farmerId} · {farmer.primaryCrop}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-white/50 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          )}

          {/* Senior Citizen Shortcut */}
          <div className="mt-6 pt-5 border-t border-white/15 flex items-center justify-between text-xs">
            <span className="text-white/70">മുതിർന്ന കർഷകർക്കാണോ?</span>
            <button
              type="button"
              onClick={() => navigate({ to: "/old" })}
              className="font-bold text-amber-300 hover:underline flex items-center gap-1"
            >
              👵 60+ Senior Mode →
            </button>
          </div>
        </div>
      </main>

      {/* Footer Support */}
      <footer className="relative z-10 p-4 text-center text-xs text-white/60 border-t border-white/10 bg-black/30 backdrop-blur-md flex flex-wrap items-center justify-center gap-4">
        <span>🌾 Kisan Call Centre Toll-Free: <strong className="text-white">1800-425-1661</strong></span>
        <span>·</span>
        <span>Kottayam Centre Helpline: <strong className="text-white">+91 94471 23456</strong></span>
      </footer>
    </div>
  );
}
