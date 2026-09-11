import React, { useState } from "react";
import {
  Building2,
  UsersRound,
  TrendingUp,
  IndianRupee,
  AlertTriangle,
  Sparkles,
  Download,
  CheckCircle2,
  Clock,
  Wheat,
  Activity,
  BarChart3,
  Calendar,
  FileSpreadsheet,
  Check,
  RefreshCw,
  Eye,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useKisanQueue } from "@/lib/store";
import { useTranslation } from "@/lib/translations";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const HOURLY_FLOW_DATA = [
  { time: "08:30", kottayam: 14, pala: 8, changanassery: 18, alappuzha: 5 },
  { time: "10:00", kottayam: 28, pala: 32, changanassery: 42, alappuzha: 14 },
  { time: "11:30", kottayam: 36, pala: 48, changanassery: 56, alappuzha: 22 },
  { time: "01:00", kottayam: 24, pala: 38, changanassery: 35, alappuzha: 16 },
  { time: "02:30", kottayam: 18, pala: 25, changanassery: 28, alappuzha: 12 },
  { time: "04:00", kottayam: 10, pala: 14, changanassery: 12, alappuzha: 6 },
];

const CROP_VOLUME_DATA = [
  { name: "Paddy", volumeMT: 68.4, valueLakhs: 21.88, fill: "#2e7d32" },
  { name: "Coconut", volumeMT: 24.2, valueLakhs: 9.19, fill: "#e65100" },
  { name: "Rubber RSS4", volumeMT: 12.8, valueLakhs: 23.04, fill: "#1565c0" },
  { name: "Black Pepper", volumeMT: 3.6, volumeLakhs: 18.72, fill: "#6a1b9a" },
];

const DAILY_TREND_DATA = [
  { day: "Mon", scheduled: 380, processed: 372, waitMin: 22 },
  { day: "Tue", scheduled: 420, processed: 405, waitMin: 26 },
  { day: "Wed", scheduled: 490, processed: 460, waitMin: 34 },
  { day: "Thu (Today)", scheduled: 515, processed: 488, waitMin: 28 },
  { day: "Fri (Proj)", scheduled: 560, processed: 530, waitMin: 25 },
  { day: "Sat (Proj)", scheduled: 620, processed: 590, waitMin: 30 },
];

export function AdminDashboard() {
  const { centres, bookings, queue, nowServing, bottlenecks, forecasts, addNotification } = useKisanQueue();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "bottlenecks" | "forecast" | "reports">("overview");
  const [selectedCentreFilter, setSelectedCentreFilter] = useState<string>("all");
  const [reportExported, setReportExported] = useState(false);
  const [appliedRecommendations, setAppliedRecommendations] = useState<Record<string, boolean>>({});

  // Statewide aggregates dynamically derived from live store
  const totalCentres = centres.length;
  const totalFarmersScheduled = centres.reduce((sum, c) => sum + c.todayBookingsCount, 0);
  const activeQueuedFarmers = queue.filter((q) => q.status === "waiting" || q.status === "serving").length;
  const totalDelayedCentres = centres.filter((c) => c.status === "delayed" || c.activeDelayMinutes > 0).length;

  // Dynamic procurement tonnage
  const additionalVolumeMT = bookings.reduce((sum, b) => sum + (b.quantityKg || 0), 0) / 1000;
  const totalVolumeMT = Number((105.0 + additionalVolumeMT).toFixed(1));

  // Dynamic MSP Disbursed (PFMS DBT settlement)
  const completedBookingsPayout = bookings
    .filter((b) => b.status === "completed" || b.paymentStatus === "completed")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalDisbursedAmount = 7000000 + completedBookingsPayout;
  const totalDisbursedLakhs = `₹${(totalDisbursedAmount / 100000).toFixed(2)} Lakhs`;

  const handleApplyRecommendation = (centreId: string, title: string) => {
    setAppliedRecommendations((prev) => ({ ...prev, [centreId]: true }));
    addNotification(
      "Admin Directive Dispatched 🚀",
      `System recommendation applied for ${title}. Resource reallocation instruction transmitted to centre coordinator.`,
      "delay"
    );
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Centre ID,Centre Name,District,Status,Queue Length,Today Bookings,Active Delay (min),Avg Processing (min)\n" +
      centres
        .map(
          (c) =>
            `"${c.id}","${c.name}","${c.district}","${c.status}",${c.currentQueueLength},${c.todayBookingsCount},${c.activeDelayMinutes},${c.avgProcessingMinutes}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KisanQueue_Statewide_Procurement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setReportExported(true);
    addNotification("Report Downloaded ✓", "Daily Statewide KisanQueue Procurement report exported successfully.", "procurement");
    setTimeout(() => setReportExported(false), 3500);
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Header Banner */}
      <div className="border-b bg-background px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <ShieldCheck className="size-3.5" /> Department of Agriculture & Farmers Welfare
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <Activity className="size-3.5 animate-pulse" /> Live Telemetry
                </span>
              </div>
              <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Statewide Procurement Command Center
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Centralized queue load balancing, real-time bottleneck detection, and direct MSP settlement oversight.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 active:scale-95 transition-all"
              >
                {reportExported ? <Check className="size-4" /> : <Download className="size-4" />}
                {reportExported ? "Exported Successfully" : "Export Daily Report (CSV)"}
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex border-b border-border text-sm font-medium">
            <button
              onClick={() => setActiveTab("overview")}
              className={`border-b-2 px-4 py-2.5 transition-colors ${
                activeTab === "overview"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Centres Overview ({centres.length})
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`border-b-2 px-4 py-2.5 transition-colors ${
                activeTab === "analytics"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Visual Analytics
            </button>
            <button
              onClick={() => setActiveTab("bottlenecks")}
              className={`relative border-b-2 px-4 py-2.5 transition-colors ${
                activeTab === "bottlenecks"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              AI Bottlenecks
              {bottlenecks.length > 0 && (
                <span className="ml-2 rounded-full bg-rose-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                  {bottlenecks.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("forecast")}
              className={`border-b-2 px-4 py-2.5 transition-colors ${
                activeTab === "forecast"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Demand Forecast
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`border-b-2 px-4 py-2.5 transition-colors ${
                activeTab === "reports"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Audit & Reports
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Centres</span>
              <Building2 className="size-4 text-primary" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold sm:text-3xl">{totalCentres}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {totalDelayedCentres > 0 ? (
                <span className="font-semibold text-amber-600">{totalDelayedCentres} centre delayed</span>
              ) : (
                <span className="text-emerald-600 font-semibold">100% On-schedule</span>
              )}
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Scheduled Today</span>
              <UsersRound className="size-4 text-blue-600" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold sm:text-3xl">{totalFarmersScheduled}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              <span className="font-semibold text-primary">{activeQueuedFarmers}</span> currently in queue
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Procured Volume</span>
              <Wheat className="size-4 text-amber-600" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold sm:text-3xl">{totalVolumeMT} <span className="text-sm font-normal text-muted-foreground">MT</span></p>
            <p className="mt-1 text-xs text-emerald-600 font-semibold">+18.4% vs yesterday</p>
          </div>

          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Direct MSP Payout</span>
              <IndianRupee className="size-4 text-emerald-600" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold sm:text-3xl">{totalDisbursedLakhs}</p>
            <p className="mt-1 text-xs text-muted-foreground">PFMS DBT auto-settlement</p>
          </div>
        </div>

        {/* Tab 1: Overview (Live Centre Grid & Quick Actions) */}
        {activeTab === "overview" && (
          <div className="mt-6 space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Filter District:</span>
                <select
                  value={selectedCentreFilter}
                  onChange={(e) => setSelectedCentreFilter(e.target.value)}
                  className="rounded-lg border bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Districts (Kottayam & Alappuzha)</option>
                  <option value="Kottayam">Kottayam District</option>
                  <option value="Alappuzha">Alappuzha District</option>
                </select>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500" /> Normal Flow
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-amber-500" /> High Volume
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-rose-500" /> Operational Delay
                </span>
              </div>
            </div>

            {/* Centres Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {centres
                .filter((c) => selectedCentreFilter === "all" || c.district === selectedCentreFilter)
                .map((centre) => {
                  const isDelayed = centre.status === "delayed" || (centre.activeDelayMinutes || 0) > 0;
                  const isBusy = centre.status === "busy";

                  return (
                    <div
                      key={centre.id}
                      className={`relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md ${
                        isDelayed ? "border-amber-400/80 ring-1 ring-amber-400/50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-lg font-bold text-foreground">{centre.name}</h3>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                                isDelayed
                                  ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                  : isBusy
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              }`}
                            >
                              {isDelayed ? `Delayed (+${centre.activeDelayMinutes}m)` : isBusy ? "Busy" : "Optimal"}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{centre.location} • {centre.district}</p>
                        </div>
                      </div>

                      {/* Delay reason notice if active */}
                      {centre.delayReason && (
                        <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-2.5 text-xs text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
                          <AlertTriangle className="size-4 shrink-0 text-amber-600 mt-0.5" />
                          <div>
                            <strong>Active Cause:</strong> {centre.delayReason}
                          </div>
                        </div>
                      )}

                      {/* Metric Pills */}
                      <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-4 text-center">
                        <div className="rounded-xl bg-muted/40 p-2">
                          <span className="text-[10px] uppercase text-muted-foreground font-semibold">Queue Size</span>
                          <p className="font-display text-lg font-bold text-foreground">{centre.currentQueueLength}</p>
                          <small className="text-[10px] text-muted-foreground">farmers waiting</small>
                        </div>
                        <div className="rounded-xl bg-muted/40 p-2">
                          <span className="text-[10px] uppercase text-muted-foreground font-semibold">Est. Wait Time</span>
                          <p className="font-display text-lg font-bold text-foreground">
                            {centre.currentQueueLength * centre.avgProcessingMinutes + centre.activeDelayMinutes}m
                          </p>
                          <small className="text-[10px] text-muted-foreground">~{centre.avgProcessingMinutes}m / farmer</small>
                        </div>
                        <div className="rounded-xl bg-muted/40 p-2">
                          <span className="text-[10px] uppercase text-muted-foreground font-semibold">Today's Total</span>
                          <p className="font-display text-lg font-bold text-primary">{centre.todayBookingsCount}</p>
                          <small className="text-[10px] text-muted-foreground">slots scheduled</small>
                        </div>
                      </div>

                      {/* Slot Capacity mini progress */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                          <span>Slot Utilization</span>
                          <span className="font-medium text-foreground">
                            {Math.min(100, Math.round((centre.todayBookingsCount / 180) * 100))}% Capacity
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full ${
                              isDelayed ? "bg-rose-500" : isBusy ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(100, Math.round((centre.todayBookingsCount / 180) * 100))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Tab 2: Visual Analytics (Recharts) */}
        {activeTab === "analytics" && (
          <div className="mt-6 space-y-6">
            {/* Chart 1: Hourly Arrival Load Across Centres */}
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                    <TrendingUp className="size-5 text-primary" /> Hourly Arrival Flow & Congestion Curve
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Number of farmer arrivals monitored every 90 minutes across all four procurement centres.
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                  Peak Window: 10:30 AM – 01:00 PM
                </span>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={HOURLY_FLOW_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorKtm" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#2e7d32" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="colorPala" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d32f2f" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#d32f2f" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="colorCgry" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f57c00" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f57c00" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="colorAlpy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#1976d2" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="kottayam" name="Kottayam Centre" stroke="#2e7d32" fillOpacity={1} fill="url(#colorKtm)" />
                    <Area type="monotone" dataKey="pala" name="Pala Centre" stroke="#d32f2f" fillOpacity={1} fill="url(#colorPala)" />
                    <Area type="monotone" dataKey="changanassery" name="Changanassery" stroke="#f57c00" fillOpacity={1} fill="url(#colorCgry)" />
                    <Area type="monotone" dataKey="alappuzha" name="Alappuzha Lake" stroke="#1976d2" fillOpacity={1} fill="url(#colorAlpy)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Grid with 2 Charts: Crop Distribution & Daily Trend */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Chart 2: Daily Scheduled vs Completed Trend */}
              <div className="rounded-2xl border bg-card p-5 shadow-sm">
                <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="size-5 text-blue-600" /> Daily Throughput vs Average Wait
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Weekly procurement volume throughput and statewide average wait time (minutes).
                </p>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DAILY_TREND_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="scheduled" name="Scheduled Slots" fill="#90caf9" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="processed" name="Completed Farmers" fill="#2e7d32" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 3: Crop Distribution by Weight */}
              <div className="rounded-2xl border bg-card p-5 shadow-sm">
                <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                  <Wheat className="size-5 text-amber-600" /> Commodity Procurement Breakdown
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Volume distribution (Metric Tons) across major Kerala crops this season.
                </p>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CROP_VOLUME_DATA} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis type="number" tick={{ fontSize: 11 }} unit=" MT" />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="volumeMT" name="Procured (Metric Tons)" radius={[0, 4, 4, 0]}>
                        {CROP_VOLUME_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: AI Bottleneck Detection Engine */}
        {activeTab === "bottlenecks" && (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-amber-300 bg-amber-50/70 p-4 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-amber-600" />
                <h3 className="font-display font-bold">Autonomous Bottleneck Detection Engine</h3>
              </div>
              <p className="mt-1 text-xs leading-relaxed">
                The KisanQueue AI engine monitors queue velocities, weighbridge cycle times, and moisture grading lags.
                When queue delay surpasses +20% standard deviation, corrective recommendations are generated for administrators.
              </p>
            </div>

            {bottlenecks.map((item) => {
              const isApplied = appliedRecommendations[item.centreId];
              return (
                <div
                  key={item.centreId}
                  className="rounded-2xl border bg-card p-5 shadow-sm transition-all hover:border-primary/50"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`rounded-xl p-2.5 ${
                          item.severity === "high" ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        <AlertTriangle className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-base font-bold text-foreground">{item.title}</h4>
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              item.severity === "high"
                                ? "bg-rose-500 text-white"
                                : "bg-amber-500 text-white"
                            }`}
                          >
                            +{item.increasePercentage}% Delay Spike
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Centre: <strong className="text-foreground">{item.centreName}</strong> • Critical Chokepoint:{" "}
                          <strong className="text-foreground">{item.bottleneckArea}</strong>
                        </p>
                        <p className="mt-2 text-sm text-foreground/90">{item.message}</p>
                      </div>
                    </div>

                    <div className="shrink-0 sm:self-center">
                      <button
                        onClick={() => handleApplyRecommendation(item.centreId, item.title)}
                        disabled={isApplied}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                          isApplied
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-primary text-primary-foreground shadow hover:opacity-90 active:scale-95"
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle2 className="size-4" /> Recommendation Applied
                          </>
                        ) : (
                          <>
                            <Zap className="size-4" /> Execute Recommended Action
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Recommendation Box */}
                  <div className="mt-4 rounded-xl bg-muted/60 p-3 text-xs">
                    <span className="font-semibold text-primary">💡 Prescribed Solution:</span>{" "}
                    <span className="text-foreground">{item.recommendedAction}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 4: Demand Forecasting */}
        {activeTab === "forecast" && (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="size-5 text-primary" />
                <h3 className="font-display text-lg font-bold">Predictive Harvest & Demand Projections</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                By integrating agricultural satellite vegetation indices and local panchayat harvest schedules, KisanQueue
                anticipates upcoming surge volumes 7 days in advance to reallocate weighbridge operators and logistics.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {forecasts.map((f) => (
                  <div key={f.centreId} className="rounded-xl border bg-background p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-base">{f.centreName}</h4>
                      <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        {f.expectedDemand.toUpperCase()} DEMAND SURGE
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{f.reason}</p>

                    <div className="mt-4 grid grid-cols-2 gap-2 border-t pt-3 text-center">
                      <div className="rounded-lg bg-muted/50 p-2">
                        <small className="text-[10px] text-muted-foreground uppercase font-semibold">Projected Arrivals</small>
                        <p className="font-display text-lg font-bold text-foreground">~{f.projectedBookings}</p>
                        <small className="text-[10px] text-muted-foreground">farmers / day</small>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2">
                        <small className="text-[10px] text-muted-foreground uppercase font-semibold">Recommended Staff</small>
                        <p className="font-display text-lg font-bold text-primary">{f.recommendedStaffCount} Officers</p>
                        <small className="text-[10px] text-emerald-600 font-semibold">+2 additional</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Audit & Reports */}
        {activeTab === "reports" && (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h3 className="font-display text-lg font-bold flex items-center gap-2">
                    <FileSpreadsheet className="size-5 text-emerald-600" /> Daily Compliance & Procurement Logs
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Cryptographically verifiable record of slot bookings, farmer arrivals, grading notes, and bank settlements.
                  </p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow hover:opacity-90"
                >
                  <Download className="size-4" /> Export CSV Data
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/60 text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Centre Name</th>
                      <th className="px-4 py-3 font-semibold">District</th>
                      <th className="px-4 py-3 font-semibold">Active Status</th>
                      <th className="px-4 py-3 font-semibold">Today's Bookings</th>
                      <th className="px-4 py-3 font-semibold">Queue Count</th>
                      <th className="px-4 py-3 font-semibold">Delay Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {centres.map((c) => (
                      <tr key={c.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{c.district}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              c.status === "delayed"
                                ? "bg-rose-100 text-rose-800"
                                : c.status === "busy"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {c.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-foreground">{c.todayBookingsCount} farmers</td>
                        <td className="px-4 py-3 text-foreground">{c.currentQueueLength} in line</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {c.activeDelayMinutes > 0 ? (
                            <span className="font-semibold text-rose-600">+{c.activeDelayMinutes} min</span>
                          ) : (
                            <span className="text-emerald-600">None</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
