import React, { useState } from "react";
import { useKisanQueue } from "@/lib/store";
import { t } from "@/lib/translations";
import {
  UsersRound,
  CalendarCheck,
  Clock,
  Gauge,
  AlertTriangle,
  Megaphone,
  CheckCircle2,
  ShieldCheck,
  Scale,
  UserX,
  RefreshCw,
  Sliders,
  X,
  Check,
} from "lucide-react";

export function StaffDashboard() {
  const {
    centres,
    nowServing,
    queue,
    callNextFarmer,
    markFarmerArrived,
    verifyFarmer,
    completeProcurement,
    reportDelay,
    clearDelay,
    language,
  } = useKisanQueue();

  const [selectedCentreId, setSelectedCentreId] = useState<string>("centre-ktm");
  const currentCentre = centres.find((c) => c.id === selectedCentreId) || centres[0];

  const [showDelayModal, setShowDelayModal] = useState(false);
  const [delayMinutesInput, setDelayMinutesInput] = useState(20);
  const [delayReasonInput, setDelayReasonInput] = useState("Moisture meter recalibration & high vehicle volume");
  const [showVerifyModal, setShowVerifyModal] = useState<number | null>(null);
  const [actualWeight, setActualWeight] = useState(420);
  const [moistureReading, setMoistureReading] = useState(13.5);

  const activeFarmer = queue.find((q) => q.queueNumber === nowServing) || queue[0];
  const waitingCount = queue.filter((q) => q.status === "waiting" || q.queueNumber > nowServing).length;

  const handleOpenVerify = (tokenNum: number) => {
    const item = queue.find((q) => q.queueNumber === tokenNum);
    setActualWeight(item?.quantityKg || 420);
    setShowVerifyModal(tokenNum);
  };

  const handleReportDelaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportDelay(currentCentre.id, delayMinutesInput, delayReasonInput);
    setShowDelayModal(false);
  };

  const handleVerifySubmit = (queueNum: number) => {
    verifyFarmer(queueNum);
    completeProcurement(queueNum, actualWeight);
    setShowVerifyModal(null);
  };

  // Compute a 8-item window around nowServing
  const visibleQueue = React.useMemo(() => {
    const activeIdx = queue.findIndex((q) => q.queueNumber >= nowServing);
    const start = Math.max(0, (activeIdx === -1 ? 0 : activeIdx) - 1);
    return queue.slice(start, start + 8);
  }, [queue, nowServing]);

  return (
    <div className="content-stack pt-2 space-y-4">
      {/* Staff Facility Header with Centre Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-card border border-border p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-display text-lg font-bold shrink-0">
            🏢
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
              Procurement Officer Console · Live Gate Control
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <select
                value={selectedCentreId}
                onChange={(e) => setSelectedCentreId(e.target.value)}
                className="font-display text-base font-bold bg-transparent border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {centres.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.district})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Officer P. V. Thomas (ID: STF-KTM-08)</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {currentCentre.activeDelayMinutes > 0 ? (
            <button
              onClick={() => clearDelay(currentCentre.id)}
              className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
            >
              <Check className="size-3.5" />
              {t(language, "clearDelay")} (+{currentCentre.activeDelayMinutes}m)
            </button>
          ) : (
            <button
              onClick={() => setShowDelayModal(true)}
              className="flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 transition-colors"
            >
              <AlertTriangle className="size-3.5" /> {t(language, "reportDelay")}
            </button>
          )}
        </div>
      </div>

      {/* 6 Key Operational Metrics (As Requested in SIH Spec) */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase">{t(language, "todayBookings")}</span>
            <CalendarCheck className="size-4 text-primary" />
          </div>
          <p className="font-display text-2xl font-bold mt-1.5">{currentCentre.todayBookingsCount}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">+18 from yesterday</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase">{t(language, "waitingInYard")}</span>
            <UsersRound className="size-4 text-primary" />
          </div>
          <p className="font-display text-2xl font-bold mt-1.5">{waitingCount}</p>
          <span className="text-[10px] text-muted-foreground">Active tokens in yard</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase">{t(language, "nowServing")}</span>
            <Megaphone className="size-4 text-secondary" />
          </div>
          <p className="font-display text-2xl font-bold mt-1.5 text-primary">#{nowServing}</p>
          <span className="text-[10px] text-primary font-semibold">Weighing Bay 1</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase">{t(language, "centreCapacity")}</span>
            <Gauge className="size-4 text-primary" />
          </div>
          <p className="font-display text-2xl font-bold mt-1.5">78%</p>
          <span className="text-[10px] text-muted-foreground">Holding bay optimal</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase">{t(language, "avgProcessingTime")}</span>
            <Clock className="size-4 text-primary" />
          </div>
          <p className="font-display text-2xl font-bold mt-1.5">{currentCentre.avgProcessingMinutes} min</p>
          <span className="text-[10px] text-muted-foreground">Per truck weigh-in</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-bold uppercase">{t(language, "delayReported")}</span>
            <AlertTriangle className="size-4 text-amber-500" />
          </div>
          <p className="font-display text-2xl font-bold mt-1.5 text-amber-600">
            {currentCentre.activeDelayMinutes > 0 ? `+${currentCentre.activeDelayMinutes}m` : "0m"}
          </p>
          <span className="text-[10px] text-muted-foreground">
            {currentCentre.activeDelayMinutes > 0 ? "Broadcast active" : "Normal pace"}
          </span>
        </div>
      </div>

      {/* Main Interactive Queue Controller */}
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="font-display text-base font-bold">Active Token Controller</h3>
            <p className="text-xs text-muted-foreground">Call next, verify credentials, and complete receipt</p>
          </div>
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
            Bay 1 Ready
          </span>
        </div>

        {/* Current Active Farmer Card */}
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-3xl font-extrabold text-primary">#{nowServing}</span>
              <div>
                <h4 className="font-bold text-sm">{activeFarmer?.farmerName || "Farmer at counter"}</h4>
                <p className="text-xs text-muted-foreground">
                  ID: {activeFarmer?.farmerId || "KL-KTM-26047"} · {activeFarmer?.crop || "Paddy"} ({activeFarmer?.quantityKg || 420} kg)
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenVerify(nowServing)}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:scale-[1.01]"
            >
              <ShieldCheck className="size-4" /> Verify & Complete
            </button>

            <button
              type="button"
              onClick={callNextFarmer}
              className="flex items-center gap-1.5 rounded-xl bg-secondary px-4 py-2.5 text-xs font-bold text-secondary-foreground shadow-sm hover:bg-secondary/80"
            >
              <Megaphone className="size-4" /> Call Next (#{nowServing + 1})
            </button>
          </div>
        </div>

        {/* Queue Table with Quick Staff Actions */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground uppercase text-[10px]">
                <th className="py-2.5 pr-2">Token</th>
                <th className="py-2.5 px-2">Farmer</th>
                <th className="py-2.5 px-2">Crop & Load</th>
                <th className="py-2.5 px-2">Status</th>
                <th className="py-2.5 pl-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {visibleQueue.map((item) => (
                <tr key={item.queueNumber} className={item.queueNumber === nowServing ? "bg-primary/5 font-bold" : ""}>
                  <td className="py-2.5 pr-2 font-mono font-bold">#{item.queueNumber}</td>
                  <td className="py-2.5 px-2">
                    <span className="font-semibold flex items-center gap-1.5 flex-wrap">
                      <span>{item.farmerName}</span>
                      {item.bookingSource === "ivr" && (
                        <span className="rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[9px] px-1.5 py-0.2 font-bold">
                          📞 IVR
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">{item.farmerId}</span>
                  </td>
                  <td className="py-2.5 px-2">
                    {item.crop} · {item.quantityKg} kg
                  </td>
                  <td className="py-2.5 px-2">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.queueNumber === nowServing
                          ? "bg-secondary text-secondary-foreground"
                          : item.queueNumber < nowServing
                          ? "bg-emerald-500/15 text-emerald-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.queueNumber === nowServing ? "At Desk" : item.queueNumber < nowServing ? "Cleared" : "Waiting"}
                    </span>
                  </td>
                  <td className="py-2.5 pl-2 text-right space-x-1.5">
                    {item.queueNumber >= nowServing && (
                      <>
                        <button
                          type="button"
                          onClick={() => markFarmerArrived(item.queueNumber)}
                          className="rounded-lg border border-border px-2 py-1 text-[11px] font-semibold hover:bg-muted"
                        >
                          Arrived
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenVerify(item.queueNumber)}
                          className="rounded-lg bg-primary/10 text-primary px-2 py-1 text-[11px] font-bold hover:bg-primary/20"
                        >
                          Verify
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* REPORT DELAY MODAL (Demonstrating Smart Waiting-Time Prediction Broadcast) */}
      {showDelayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-[28px] border border-border bg-card p-5 text-foreground shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="size-5" />
                <h3 className="font-display text-base font-bold text-foreground">Report Operational Delay</h3>
              </div>
              <button onClick={() => setShowDelayModal(false)} className="text-muted-foreground hover:bg-muted rounded-full p-1">
                <X className="size-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              When a delay is reported, the <strong>Smart Queue Engine</strong> immediately recalculates waiting times for all queued farmers and broadcasts SMS/app notifications.
            </p>

            <form onSubmit={handleReportDelaySubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Delay Duration (Minutes)</label>
                <div className="mt-1.5 flex gap-2">
                  {[15, 20, 30, 45].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDelayMinutesInput(m)}
                      className={`flex-1 rounded-xl border py-2 text-xs font-bold transition-all ${
                        delayMinutesInput === m ? "border-amber-500 bg-amber-500/20 text-amber-900 dark:text-amber-200" : "border-border bg-muted/40"
                      }`}
                    >
                      +{m} min
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Reason for Operational Delay</label>
                <select
                  value={delayReasonInput}
                  onChange={(e) => setDelayReasonInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs outline-none"
                >
                  <option value="Moisture meter recalibration & high vehicle volume">
                    Moisture meter recalibration & high volume
                  </option>
                  <option value="Electronic weighbridge zero-point maintenance">
                    Electronic weighbridge zero-point maintenance
                  </option>
                  <option value="Heavy rain delay during yard trailer unloading">
                    Heavy rain delay during yard trailer unloading
                  </option>
                  <option value="Power surge / server sync latency">
                    Power surge / server sync latency
                  </option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-amber-600 py-3 text-xs font-bold text-white shadow-md hover:bg-amber-700"
              >
                Broadcast Delay & Recalculate Queues 📢
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VERIFY & COMPLETE PROCUREMENT MODAL */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-[28px] border border-border bg-card p-5 text-foreground shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-base font-bold">Verification & Electronic Weighing</h3>
              <button onClick={() => setShowVerifyModal(null)} className="text-muted-foreground hover:bg-muted rounded-full p-1">
                <X className="size-4" />
              </button>
            </div>

            {(() => {
              const targetFarmer = queue.find((q) => q.queueNumber === showVerifyModal);
              const mspRate = targetFarmer?.crop?.toLowerCase().includes("coconut") ? 38 : targetFarmer?.crop?.toLowerCase().includes("rubber") ? 180 : 32;
              return (
                <>
                  <div className="rounded-xl bg-muted/40 p-3 text-xs space-y-1">
                    <p>
                      Farmer: <strong>{targetFarmer?.farmerName || "Farmer"} (Token #{showVerifyModal})</strong>
                    </p>
                    <p>
                      Commodity: <strong>{targetFarmer?.crop || "Paddy"}</strong> · Base MSP: <strong>₹{mspRate}/kg</strong>
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold uppercase text-muted-foreground">Certified Scale Weight (kg)</label>
                      <input
                        type="number"
                        value={actualWeight}
                        onChange={(e) => setActualWeight(Number(e.target.value))}
                        className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-sm font-bold outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-muted-foreground">Moisture Reading (%) — Limit 14.0%</label>
                      <input
                        type="number"
                        step="0.1"
                        value={moistureReading}
                        onChange={(e) => setMoistureReading(Number(e.target.value))}
                        className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-sm font-bold outline-none"
                      />
                      <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">✓ Quality passed standard (Grade A)</span>
                    </div>

                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs flex justify-between">
                      <span>Total MSP Payout Disbursed:</span>
                      <strong className="text-primary font-bold">₹{(actualWeight * mspRate).toLocaleString("en-IN")}</strong>
                    </div>
                  </div>
                </>
              );
            })()}

            <button
              type="button"
              onClick={() => handleVerifySubmit(showVerifyModal)}
              className="w-full rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md flex items-center justify-center gap-2"
            >
              Approve & Trigger DBT Direct Bank Transfer <CheckCircle2 className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
