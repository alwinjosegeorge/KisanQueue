import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  IndianRupee,
  Languages,
  Leaf,
  LocateFixed,
  Map,
  MapPin,
  Navigation,
  PackageCheck,
  Phone,
  Search,
  Settings2,
  Sprout,
  TicketCheck,
  UserRound,
  UsersRound,
  Wheat,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import heroImage from "@/assets/smartprocure-home.jpg";
import splashImage from "@/assets/smartprocure-splash.jpg";

type Screen =
  | "splash"
  | "onboarding"
  | "home"
  | "centres"
  | "book"
  | "confirmed"
  | "queue"
  | "procurement"
  | "payment"
  | "profile";

const NAV_ITEMS: { id: Screen; label: string; icon: typeof Leaf }[] = [
  { id: "home", label: "Home", icon: Sprout },
  { id: "book", label: "Bookings", icon: CalendarDays },
  { id: "queue", label: "Queue", icon: UsersRound },
  { id: "procurement", label: "Procurement", icon: PackageCheck },
  { id: "profile", label: "Profile", icon: UserRound },
];

const ONBOARDING = [
  {
    eyebrow: "Your time matters",
    title: "Skip the Queue",
    copy: "Spend less time waiting at procurement centres.",
    focus: "queue",
  },
  {
    eyebrow: "Plan with confidence",
    title: "Book Your Slot",
    copy: "Choose the best time to bring your produce.",
    focus: "slot",
  },
  {
    eyebrow: "Arrive right on time",
    title: "Know When to Arrive",
    copy: "Track your queue and estimated waiting time.",
    focus: "arrival",
  },
] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KisanQueue ✦ Smart Farmer Queue" },
      {
        name: "description",
        content:
          "Book procurement slots, follow live queue tokens, and track crop procurement and payments with KisanQueue.",
      },
      { property: "og:title", content: "KisanQueue ✦ Procure Smarter. Wait Less." },
      {
        property: "og:description",
        content: "A cute, calm, and fair procurement queue journey for Kerala farmers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KisanQueueApp,
});

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={inverse ? "brand-mark brand-mark-inverse shadow-sm" : "brand-mark shadow-sm"}>
        <Sprout className="size-5" strokeWidth={2.4} />
        <span />
      </span>
      <span className={inverse ? "font-display text-2xl font-bold tracking-tight text-primary-foreground" : "font-display text-2xl font-bold tracking-tight text-foreground"}>
        Kisan<span className="text-secondary font-black">Queue</span>
      </span>
      <span className="rounded-full bg-secondary/20 px-2 py-0.5 text-[10px] font-bold text-secondary">
        🌾 cute
      </span>
    </div>
  );
}

function AppButton({ children, tone = "primary", onClick, className = "" }: { children: ReactNode; tone?: "primary" | "soft" | "ghost" | "danger"; onClick?: () => void; className?: string }) {
  return (
    <button className={`app-button app-button-${tone} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}

function KisanQueueApp() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [selectedCentre, setSelectedCentre] = useState("Kottayam Procurement Centre");
  const [selectedDate, setSelectedDate] = useState("10");
  const [selectedTime, setSelectedTime] = useState("12:00 – 1:00 PM");

  if (screen === "splash") return <Splash onNext={() => setScreen("onboarding")} />;
  if (screen === "onboarding") {
    return (
      <Onboarding
        step={onboardingStep}
        onSkip={() => setScreen("home")}
        onNext={() => onboardingStep < 2 ? setOnboardingStep((value) => value + 1) : setScreen("home")}
      />
    );
  }

  const page = {
    home: <Home go={setScreen} />,
    centres: <FindCentre go={setScreen} choose={(name) => { setSelectedCentre(name); setScreen("book"); }} />,
    book: <BookSlot go={setScreen} centre={selectedCentre} setCentre={setSelectedCentre} date={selectedDate} setDate={setSelectedDate} time={selectedTime} setTime={setSelectedTime} />,
    confirmed: <Confirmation go={setScreen} centre={selectedCentre} time={selectedTime} />,
    queue: <LiveQueue go={setScreen} />,
    procurement: <Procurement />,
    payment: <Payment />,
    profile: <Profile />,
    splash: null,
    onboarding: null,
  }[screen];

  return (
    <div className="app-canvas">
      <aside className="desktop-rail">
        <Logo />
        <div className="mt-10">
          <p className="eyebrow text-secondary">Kerala Farmer App ✦ 🌾</p>
          <h2 className="mt-2 font-display text-4xl font-bold leading-tight">
            Kisan<span className="text-secondary">Queue</span>.<br />
            Wait Less 🎈
          </h2>
          <p className="mt-4 max-w-56 text-sm leading-6 text-muted-foreground font-medium">
            A calm, cute, and guided journey from slot booking to bank payout.
          </p>
        </div>
        <nav className="mt-10 space-y-1.5" aria-label="Desktop navigation">
          {NAV_ITEMS.map((item) => <RailItem key={item.id} item={item} active={screen === item.id} onClick={() => setScreen(item.id)} />)}
        </nav>
        <div className="relative mt-auto overflow-hidden rounded-2xl bg-primary p-4 text-primary-foreground shadow-lg">
          <div className="pointer-events-none absolute inset-0 bg-dots text-white/10" />
          <div className="relative flex items-center justify-between">
            <p className="text-xs font-semibold text-secondary">Next procurement 🌾</p>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">Today</span>
          </div>
          <p className="relative mt-2 font-display text-3xl font-bold text-secondary">Token #47</p>
          <p className="relative mt-1 text-xs text-white/75 font-medium">Kottayam Centre · 10:30 AM</p>
        </div>
      </aside>
      <main className="phone-shell">
        <div className="phone-content">{page}</div>
        <BottomNav screen={screen} go={setScreen} />
      </main>
    </div>
  );
}

function Splash({ onNext }: { onNext: () => void }) {
  return (
    <main className="splash-screen">
      <img src={splashImage} alt="Farmer with harvested grain at a procurement centre" width={1088} height={1600} className="absolute inset-0 h-full w-full object-cover" />
      <div className="splash-shade" />
      <div className="relative z-10 flex min-h-dvh flex-col px-6 pb-7 pt-10 sm:mx-auto sm:max-w-md">
        <Logo inverse />
        <div className="mt-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-secondary backdrop-blur-sm">
            Kerala Krishi ✦ 🌾
          </span>
          <h1 className="mt-3 font-display text-6xl font-bold leading-[0.92] text-primary-foreground">
            Kisan<br /><span className="text-secondary">Queue</span> 🎈
          </h1>
          <p className="mt-4 text-sm leading-6 text-primary-foreground/85 font-medium">
            Digital tokens and fair, super-fast queue management for Kerala farmers.
          </p>
          <AppButton tone="soft" className="mt-7 w-full shadow-lg font-bold" onClick={onNext}>
            Get Started 🚜 <ChevronRight className="size-4" />
          </AppButton>
        </div>
      </div>
    </main>
  );
}

function Onboarding({ step, onNext, onSkip }: { step: number; onNext: () => void; onSkip: () => void }) {
  const item = ONBOARDING[step] ?? ONBOARDING[0];
  return (
    <main className="min-h-dvh bg-background p-4 sm:grid sm:place-items-center">
      <section className="relative mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-[2rem] bg-primary p-5 text-primary-foreground shadow-float sm:min-h-[780px]">
        <div className="pointer-events-none absolute inset-0 bg-dots text-white/10" />
        <div className="relative z-10 flex items-center justify-between"><Logo inverse /><button className="text-xs font-bold text-primary-foreground/80 hover:text-white" onClick={onSkip}>Skip</button></div>
        <div className="onboarding-visual mt-8 relative z-10">
          <img src={heroImage} alt="Farmers arriving at a procurement centre" width={1600} height={912} className="h-full w-full object-cover" />
          <div className={`journey-marker journey-${item.focus}`}><Navigation className="size-4" /></div>
          <div className="queue-ticket"><span>YOUR TOKEN</span><strong>#47</strong><small>24 min</small></div>
        </div>
        <div className="relative z-10 mt-auto pt-8">
          <p className="eyebrow text-secondary">{item.eyebrow} ✦</p>
          <h1 className="mt-3 font-display text-5xl font-bold leading-none">{item.title} 🎈</h1>
          <p className="mt-4 max-w-xs text-sm leading-6 text-primary-foreground/80 font-medium">{item.copy}</p>
          <div className="mt-8 grid grid-cols-[1fr_auto] items-center gap-4">
            <div className="flex gap-1.5">{ONBOARDING.map((_, index) => <span key={index} className={index === step ? "pager-dot pager-dot-active" : "pager-dot"} />)}</div>
            <AppButton tone="soft" className="font-bold shadow-md" onClick={onNext}>{step === 2 ? "Open KisanQueue 🌾" : "Next"}<ChevronRight className="size-4" /></AppButton>
          </div>
        </div>
      </section>
    </main>
  );
}

function AppHeader({ title, subtitle, back, action }: { title: string; subtitle?: string; back?: () => void; action?: ReactNode }) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 pb-4 pt-5">
      <div className="flex min-w-0 items-center gap-3">
        {back && <button className="icon-button shrink-0" onClick={back} aria-label="Go back"><ArrowLeft className="size-5" /></button>}
        <div className="min-w-0"><h1 className="truncate font-display text-[2rem] leading-none">{title}</h1>{subtitle && <p className="mt-1 truncate text-xs text-muted-foreground">{subtitle}</p>}</div>
      </div>
      {action}
    </header>
  );
}

function Home({ go }: { go: (screen: Screen) => void }) {
  const actions = [
    { label: "Book Slot", icon: CalendarDays, target: "book" as Screen, bg: "bg-mint text-primary", badge: "📅" },
    { label: "Live Queue", icon: UsersRound, target: "queue" as Screen, bg: "bg-lilac-soft text-primary", badge: "👥" },
    { label: "Procure", icon: PackageCheck, target: "procurement" as Screen, bg: "bg-butter text-primary", badge: "📦" },
    { label: "Payment", icon: IndianRupee, target: "payment" as Screen, bg: "bg-blush text-primary", badge: "💰" },
  ];
  return (
    <>
      <header className="home-header">
        <div className="flex min-w-0 items-center gap-3">
          <div className="avatar shadow-sm">🌾</div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-wider uppercase text-secondary">Namaskaram, Farmer ✦</p>
            <h1 className="truncate font-display text-2xl font-bold text-primary-foreground">Alwin Jose George</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground shadow-sm">
            🐣🌤️
          </div>
          <button className="icon-button icon-button-dark" aria-label="Notifications"><Bell className="size-5" /><span className="notification-dot" /></button>
        </div>
      </header>
      <div className="relative h-48 overflow-hidden">
        <img src={heroImage} alt="Kottayam farmers approaching a procurement centre" width={1600} height={912} className="h-full w-full object-cover" />
        <div className="photo-shade" />
        <div className="absolute bottom-4 left-5 text-primary-foreground"><p className="eyebrow text-secondary">Kottayam · Kerala ✦</p><p className="mt-1 font-display text-3xl font-bold">A clear path to procurement 🌾</p></div>
      </div>
      <div className="content-stack -mt-1">
        <section className="relative overflow-hidden rounded-[28px] bg-primary p-5 text-primary-foreground shadow-[0_20px_60px_-24px_color-mix(in_oklab,var(--primary)_70%,transparent)]">
          <div className="pointer-events-none absolute inset-0 bg-dots text-white/10" />
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" /> Live Token ✦ ⚡
              </span>
              <h2 className="mt-3 font-display text-[26px] font-bold leading-[1.05]">
                Token #47 Active.
                <br />
                Relax & Enjoy 🎈
              </h2>
              <p className="mt-1.5 text-xs font-medium text-white/75">
                Kottayam Centre · 8 farmers ahead (~24 min)
              </p>
            </div>
            <div className="text-5xl select-none">🐼💤</div>
          </div>

          <div className="relative mt-4 grid grid-cols-2 gap-2 border-t border-white/15 pt-3">
            <div className="rounded-xl bg-white/10 p-2 text-center">
              <p className="text-[10px] uppercase tracking-wider text-white/60 font-bold">Your Token</p>
              <p className="font-display text-2xl font-bold text-secondary">#47</p>
            </div>
            <div className="rounded-xl bg-white/10 p-2 text-center">
              <p className="text-[10px] uppercase tracking-wider text-white/60 font-bold">Est. Wait</p>
              <p className="font-display text-2xl font-bold text-white">24 min</p>
            </div>
          </div>

          <AppButton tone="soft" className="relative mt-4 w-full font-bold shadow-md" onClick={() => go("queue")}>
            Track Live Queue 🚜💨 <ChevronRight className="size-4" />
          </AppButton>
        </section>

        <SectionTitle title="Quick Actions ✦" />
        <div className="grid grid-cols-4 gap-2">
          {actions.map(({ label, icon: Icon, target, bg, badge }) => (
            <button
              className="quick-action group transition-transform active:scale-95"
              key={label}
              onClick={() => go(target)}
            >
              <span className={`${bg} relative rounded-2xl shadow-sm border border-border/50`}>
                <Icon className="size-5" />
                <span className="absolute -top-1 -right-1 text-[11px]">{badge}</span>
              </span>
              <small className="font-bold text-foreground/80">{label}</small>
            </button>
          ))}
        </div>
        <SectionTitle title="Nearby Centres 🌾" action="View map" onAction={() => go("centres")} />
        <CentreCard name="Kottayam Procurement Centre" distance="2.4 km" queue="12 farmers waiting" wait="~28 min" status="Low congestion" tone="low" onClick={() => go("centres")} />
        <CentreCard name="Changanassery Procurement Centre" distance="5.8 km" queue="42 farmers waiting" wait="~1 hr 15 min" status="High congestion" tone="high" onClick={() => go("centres")} />
      </div>
    </>
  );
}

function FindCentre({ go, choose }: { go: (screen: Screen) => void; choose: (name: string) => void }) {
  return <><AppHeader title="Find a Centre" subtitle="Choose the shortest queue near you" back={() => go("home")} action={<button className="icon-button" aria-label="Use my location"><LocateFixed className="size-5" /></button>} />
    <div className="content-stack pt-0">
      <label className="search-field"><Search className="size-4" /><input aria-label="Search procurement centres" placeholder="Search centre or village" /></label>
      <div className="map-panel" aria-label="Static map preview"><div className="map-road road-a" /><div className="map-road road-b" /><MapPin className="map-pin pin-a" /><MapPin className="map-pin pin-b" /><MapPin className="map-pin pin-c" /><span className="map-you"><Navigation className="size-3" /></span><div className="map-label">Kottayam</div></div>
      <section className="recommended-card"><div><p className="eyebrow text-primary">Recommended for you</p><h2 className="mt-1 font-display text-2xl">Kottayam Procurement Centre</h2><p className="mt-1 text-xs text-muted-foreground">2.4 km · 12 farmers · ~28 min</p></div><AppButton onClick={() => choose("Kottayam Procurement Centre")}>Select</AppButton></section>
      <SectionTitle title="All centres nearby" />
      <CentreCard name="Kottayam Procurement Centre" distance="2.4 km" queue="12 farmers waiting" wait="~28 min" status="Low congestion" tone="low" onClick={() => choose("Kottayam Procurement Centre")} />
      <CentreCard name="Changanassery Procurement Centre" distance="5.8 km" queue="42 farmers waiting" wait="~1 hr 15 min" status="High congestion" tone="high" onClick={() => choose("Changanassery Procurement Centre")} />
      <CentreCard name="Pala Collection Centre" distance="8.1 km" queue="24 farmers waiting" wait="~46 min" status="Moderate" tone="medium" onClick={() => choose("Pala Collection Centre")} />
    </div></>;
}

function BookSlot({ go, centre, setCentre, date, setDate, time, setTime }: { go: (screen: Screen) => void; centre: string; setCentre: (value: string) => void; date: string; setDate: (value: string) => void; time: string; setTime: (value: string) => void }) {
  const times = [{ time: "09:00 – 10:00", info: "12 slots available" }, { time: "10:00 – 11:00", info: "8 slots available" }, { time: "11:00 – 12:00", info: "Full", full: true }, { time: "12:00 – 1:00 PM", info: "17 slots available" }];
  return <><AppHeader title="Book a Slot" subtitle="Procurement appointment" back={() => go("home")} />
    <div className="content-stack pt-0">
      <div className="stepper">{["Centre", "Date", "Time"].map((label, index) => <div key={label} className="step"><span className="step-number">{index + 1}</span><small>{label}</small></div>)}</div>
      <SectionTitle title="Choose centre" />
      {["Kottayam Procurement Centre", "Changanassery Procurement Centre"].map((name) => <button key={name} className={centre === name ? "select-card select-card-active" : "select-card"} onClick={() => setCentre(name)}><span className="select-icon"><MapPin className="size-5" /></span><span className="min-w-0 text-left"><strong className="block truncate text-sm">{name}</strong><small className="text-muted-foreground">{name.startsWith("Kottayam") ? "2.4 km · Low congestion" : "5.8 km · High congestion"}</small></span>{centre === name && <Check className="ml-auto size-5 text-primary" />}</button>)}
      <SectionTitle title="Select date" />
      <div className="date-row">{[{ d: "09", day: "Wed" }, { d: "10", day: "Thu" }, { d: "11", day: "Fri" }, { d: "12", day: "Sat" }, { d: "13", day: "Sun" }].map((item) => <button key={item.d} className={date === item.d ? "date-chip date-chip-active" : "date-chip"} onClick={() => setDate(item.d)}><small>{item.day}</small><strong>{item.d}</strong><small>Sep</small></button>)}</div>
      <SectionTitle title="Choose time" />
      <div className="grid grid-cols-2 gap-2">{times.map((item) => <button disabled={item.full} key={item.time} className={`${time === item.time ? "time-card time-card-active" : "time-card"} ${item.full ? "time-card-full" : ""}`} onClick={() => setTime(item.time)}><strong>{item.time}</strong><small>{item.info}</small></button>)}</div>
      <section className="recommended-slot"><div className="star-mark">★</div><div className="min-w-0"><p className="eyebrow text-primary">Recommended</p><h3 className="font-display text-2xl">12:00 – 1:00 PM</h3><p className="text-xs text-muted-foreground">Expected wait: <strong className="text-foreground">18 min</strong> · Demand: <strong className="text-status-low">Low</strong></p></div></section>
      <AppButton className="w-full" onClick={() => go("confirmed")}>Confirm Slot <ChevronRight className="size-4" /></AppButton>
    </div></>;
}

function Confirmation({ go, centre, time }: { go: (screen: Screen) => void; centre: string; time: string }) {
  return (
    <div className="confirmation-screen">
      <button className="icon-button self-start" onClick={() => go("home")} aria-label="Close confirmation">
        <X className="size-5" />
      </button>
      <div className="success-seal text-3xl select-none">
        🎉
      </div>
      <p className="eyebrow text-primary">Booking confirmed ✦ 🎈</p>
      <h1 className="font-display text-4xl font-bold">You’re all set, Alwin! 🌾</h1>
      <p className="max-w-xs text-center text-sm leading-6 text-muted-foreground font-medium">
        Arrive 15 minutes before your slot. Show this pass at the centre entrance.
      </p>
      <section className="booking-pass rounded-[28px]">
        <div className="pass-top relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-dots text-white/10" />
          <div className="relative z-10">
            <p className="eyebrow text-secondary">Token</p>
            <p className="font-display text-6xl font-bold text-secondary">#47</p>
          </div>
          <div className="relative z-10">
            <Logo inverse />
          </div>
        </div>
        <div className="pass-details">
          <p><span>Centre</span><strong>{centre}</strong></p>
          <p><span>Date</span><strong>10 September 2026</strong></p>
          <p><span>Time</span><strong>{time}</strong></p>
        </div>
        <div className="qr-code" aria-label="QR code placeholder">
          {Array.from({ length: 64 }).map((_, index) => <i key={index} className={index % 3 === 0 || index % 7 === 0 ? "qr-on" : ""} />)}
        </div>
        <p className="text-center text-[10px] uppercase text-muted-foreground font-semibold">
          Booking ID · KQ26032-0047 ✦ KisanQueue
        </p>
      </section>
      <div className="grid w-full grid-cols-2 gap-2">
        <AppButton onClick={() => go("queue")} className="font-bold">Live Queue 🚜</AppButton>
        <AppButton tone="soft" onClick={() => go("book")} className="font-bold">View Booking 🎟️</AppButton>
      </div>
    </div>
  );
}

function LiveQueue({ go }: { go: (screen: Screen) => void }) {
  return (
    <>
      <AppHeader title="Live Queue ✦" subtitle="Kottayam Procurement Centre" back={() => go("home")} action={<span className="live-pill live-pill-light"><span /> Live</span>} />
      <div className="content-stack pt-1">
        <section className="queue-progress-card relative overflow-hidden rounded-[28px]">
          <div className="pointer-events-none absolute inset-0 bg-dots text-white/10" />
          <div className="queue-ring relative z-10">
            <div>
              <small>Your token</small>
              <strong>#47</strong>
              <span>~24 min</span>
            </div>
          </div>
          <div className="queue-stats relative z-10">
            <p><span>Current token</span><strong>#39 🚜</strong></p>
            <p><span>Farmers ahead</span><strong>8</strong></p>
            <p><span>Estimated wait</span><strong>24 min</strong></p>
          </div>
        </section>
        <section className="status-strip">
          <span className="status-dot" />
          <div>
            <strong>Queue moving super smooth! 🚀</strong>
            <small>Last updated: Just now · Gate B</small>
          </div>
          <Check className="ml-auto size-5 text-status-low" />
        </section>
        <SectionTitle title="Queue progress ✦" action="Gate B" />
        <div className="token-track">
          {[39,40,41,42,43,44,45,46,47].map((token) => (
            <div key={token} className={token === 47 ? "token-node token-node-you shadow-sm" : token <= 42 ? "token-node token-node-done" : "token-node"}>
              <span>{token}</span>
              {token <= 42 && <Check className="size-3" />}
              {token === 47 && <small className="font-bold">You 🌟</small>}
            </div>
          ))}
        </div>
        <div className="info-card">
          <Clock3 className="size-5 text-primary" />
          <div>
            <strong>Plan to arrive by 10:15 AM 🌾</strong>
            <p>We’ll keep updating your estimated turn as the line advances.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <AppButton className="font-bold"><Navigation className="size-4" /> Get Directions</AppButton>
          <AppButton tone="danger" className="font-bold">Cancel Slot</AppButton>
        </div>
      </div>
    </>
  );
}

function Procurement() {
  const records = [
    { crop: "Rice", weight: "420 kg", date: "10 Sep 2026", amount: "₹13,440", status: "Accepted 🌾" },
    { crop: "Paddy", weight: "280 kg", date: "22 Aug 2026", amount: "₹8,960", status: "Paid 💰" },
    { crop: "Coconut", weight: "190 kg", date: "03 Aug 2026", amount: "₹7,220", status: "Paid 💰" },
  ];
  return (
    <>
      <AppHeader title="My Harvest 🌾" subtitle="Receipts & weighing progress" />
      <div className="content-stack pt-0">
        <section className="summary-card relative overflow-hidden rounded-[28px]">
          <div className="pointer-events-none absolute inset-0 bg-dots text-white/10" />
          <div className="relative z-10">
            <p className="eyebrow text-secondary">This season ✦</p>
            <p className="mt-1 font-display text-4xl font-bold">890 kg</p>
          </div>
          <div className="relative z-10 text-right">
            <p className="text-xs text-primary-foreground/60 font-medium">Total value</p>
            <p className="mt-1 text-2xl font-bold text-secondary">₹29,620</p>
          </div>
        </section>
        <SectionTitle title="Recent Harvests 🌾" />
        {records.map((record, index) => (
          <article className={index === 0 ? "record-card record-card-active" : "record-card"} key={record.date}>
            <span className="crop-icon"><Wheat className="size-5" /></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{record.crop} · {record.weight}</h3>
                <strong className="text-primary">{record.amount}</strong>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Kottayam Centre · {record.date}</p>
              <span className="status-tag status-tag-low">{record.status}</span>
            </div>
          </article>
        ))}
        <SectionTitle title="10 Sep · Timeline ✦" />
        <div className="timeline">
          {["Booking Confirmed", "Arrived", "Weighing", "Quality Check", "Accepted", "Payment"].map((label, index) => (
            <div className={index < 5 ? "timeline-item timeline-item-done" : "timeline-item"} key={label}>
              <span>{index < 5 ? <Check className="size-3" /> : index + 1}</span>
              <div>
                <strong>{label}</strong>
                <small>{index < 5 ? ["09 Sep, 6:42 PM", "10:17 AM", "10:43 AM", "11:06 AM", "11:24 AM"][index] : "Expected by 12 Sep 🎈"}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Payment() {
  return (
    <>
      <AppHeader title="Settlements 💰" subtitle="Fast and secure bank transfers" />
      <div className="content-stack pt-0">
        <section className="payment-hero relative overflow-hidden rounded-[28px]">
          <div className="pointer-events-none absolute inset-0 bg-dots text-white/10" />
          <div className="payment-check relative z-10"><Check className="size-6" /></div>
          <div className="relative z-10">
            <p className="eyebrow text-secondary">Payment completed ✦</p>
            <p className="mt-2 font-display text-5xl font-bold text-secondary">₹13,440</p>
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-primary-foreground/15 pt-4 text-sm">
              <p><span>Quantity</span><strong>420 kg</strong></p>
              <p><span>Rate</span><strong>₹32/kg</strong></p>
              <p><span>Payment date</span><strong>12 Sep 2026</strong></p>
              <p><span>Transaction ID</span><strong>TXN80472291</strong></p>
            </div>
          </div>
        </section>
        <SectionTitle title="Payment History 📜" />
        <PaymentRow crop="Rice · 420 kg" date="12 Sep 2026" amount="₹13,440" />
        <PaymentRow crop="Paddy · 280 kg" date="24 Aug 2026" amount="₹8,960" />
        <PaymentRow crop="Coconut · 190 kg" date="05 Aug 2026" amount="₹7,220" />
        <div className="info-card">
          <CreditCard className="size-5 text-primary" />
          <div>
            <strong>Direct to registered bank 🏦✨</strong>
            <p>Settlement details appear here immediately upon centre verification.</p>
          </div>
        </div>
      </div>
    </>
  );
}

function Profile() {
  const settings = [
    { label: "Personal Details", icon: UserRound },
    { label: "Notifications", icon: Bell },
    { label: "SMS Alerts", icon: Phone },
    { label: "Language · മലയാളം / Eng", icon: Languages },
    { label: "Help & Support", icon: CircleHelp },
  ];
  return (
    <>
      <div className="profile-cover relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-dots text-white/10" />
        <div className="relative z-10 flex items-center justify-between">
          <Logo inverse />
          <button className="icon-button icon-button-dark" aria-label="Settings">
            <Settings2 className="size-5" />
          </button>
        </div>
        <div className="relative z-10 mt-8 flex items-end gap-4">
          <div className="profile-avatar shadow-lg text-3xl">🌾</div>
          <div>
            <h1 className="font-display text-3xl font-bold">Alwin Jose George</h1>
            <p className="text-xs text-primary-foreground/75 font-medium">Farmer ID · KL-KTM-26047 ✦ KisanQueue</p>
          </div>
        </div>
      </div>
      <div className="content-stack">
        <div className="profile-facts">
          <p><span>Village</span><strong>Kumarakom</strong></p>
          <p><span>Registered crop</span><strong>Rice, Coconut 🌾</strong></p>
          <p><span>Preferred centre</span><strong>Kottayam Central</strong></p>
        </div>
        <SectionTitle title="Settings ⚙️" />
        <div className="settings-list">
          {settings.map(({ label, icon: Icon }) => (
            <button key={label}>
              <span><Icon className="size-5" /></span>
              <strong>{label}</strong>
              <ChevronRight className="ml-auto size-4 text-muted-foreground" />
            </button>
          ))}
        </div>
        <AppButton tone="ghost" className="w-full font-bold">KisanQueue v2.0 ✦ Kerala Krishi 🌾</AppButton>
      </div>
    </>
  );
}

function BottomNav({ screen, go }: { screen: Screen; go: (screen: Screen) => void }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <div className="bottom-nav-pill">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = screen === id || (id === "home" && screen === "centres");
          return (
            <button
              key={id}
              type="button"
              className={active ? "bottom-nav-item bottom-nav-item-active" : "bottom-nav-item"}
              onClick={() => go(id)}
              aria-label={label}
            >
              <Icon className="size-4 shrink-0" strokeWidth={2.4} />
              {active && <span className="truncate">{label}</span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function RailItem({ item, active, onClick }: { item: (typeof NAV_ITEMS)[number]; active: boolean; onClick: () => void }) { const Icon = item.icon; return <button className={active ? "rail-item rail-item-active" : "rail-item"} onClick={onClick}><Icon className="size-5" /><span>{item.label}</span></button>; }
function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) { return <div className="section-title"><h2>{title}</h2>{action && <button onClick={onAction}>{action}<ChevronRight className="size-3.5" /></button>}</div>; }
function CentreCard({ name, distance, queue, wait, status, tone, onClick }: { name: string; distance: string; queue: string; wait: string; status: string; tone: "low" | "medium" | "high"; onClick: () => void }) { return <button className="centre-card" onClick={onClick}><span className="centre-thumb"><Wheat className="size-6" /></span><span className="min-w-0 flex-1 text-left"><strong className="block truncate">{name}</strong><small>{distance} · {queue}</small><span className={`status-tag status-tag-${tone}`}>{status}</span></span><span className="text-right"><strong className="block text-sm">{wait}</strong><small>estimated</small><ChevronRight className="ml-auto mt-2 size-4" /></span></button>; }
function PaymentRow({ crop, date, amount }: { crop: string; date: string; amount: string }) { return <div className="payment-row"><span><IndianRupee className="size-5" /></span><div><strong>{crop}</strong><small>{date} · Completed</small></div><strong className="ml-auto">{amount}</strong></div>; }