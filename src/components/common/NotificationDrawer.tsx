import React, { useState } from "react";
import { useKisanQueue } from "@/lib/store";
import { X, Check, Bell, MessageSquare, AlertTriangle, IndianRupee, Clock } from "lucide-react";

export function NotificationDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { notifications, markAllNotificationsRead } = useKisanQueue();
  const [tab, setTab] = useState<"app" | "sms">("app");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 p-4 backdrop-blur-sm sm:items-center">
      <div className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-[24px] border border-border bg-card text-foreground shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Bell className="size-4" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Smart Alerts & Updates</h3>
              <p className="text-xs text-muted-foreground">Real-time queue alerts & SMS broadcasts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Tab switch: In-App vs SMS */}
        <div className="grid grid-cols-2 border-b border-border bg-muted/40 p-1 text-xs font-semibold">
          <button
            onClick={() => setTab("app")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all ${
              tab === "app" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
            }`}
          >
            <Bell className="size-3.5" /> App Notifications ({notifications.length})
          </button>
          <button
            onClick={() => setTab("sms")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all ${
              tab === "sms" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
            }`}
          >
            <MessageSquare className="size-3.5" /> SMS Alerts (Live)
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {tab === "app" ? (
            notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No notifications right now
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`relative flex gap-3 rounded-xl border p-3 transition-colors ${
                    notif.type === "delay"
                      ? "border-amber-500/40 bg-amber-500/10"
                      : notif.type === "payment"
                      ? "border-emerald-500/40 bg-emerald-500/10"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="shrink-0 pt-0.5">
                    {notif.type === "delay" ? (
                      <AlertTriangle className="size-4 text-amber-600" />
                    ) : notif.type === "payment" ? (
                      <IndianRupee className="size-4 text-emerald-600" />
                    ) : (
                      <Clock className="size-4 text-primary" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold">{notif.title}</h4>
                      <span className="text-[10px] text-muted-foreground shrink-0">{notif.timestamp}</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{notif.message}</p>
                  </div>
                </div>
              ))
            )
          ) : (
            // SMS Feed Simulator (SIH Digital Literacy Demonstration)
            <div className="space-y-3">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary">
                📱 <strong>Direct SMS Relay Active</strong>: For non-smartphone users, all queue movements and delay alerts are sent to registered mobile <span className="font-mono font-bold">+91 94471 28930</span>.
              </div>

              {notifications.map((notif, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-muted/30 p-3 font-mono text-[11px] leading-relaxed">
                  <div className="flex justify-between text-muted-foreground text-[10px] border-b border-border/60 pb-1 mb-1.5">
                    <span>FROM: KERALA-AGRI (Govt of Kerala)</span>
                    <span>{notif.timestamp}</span>
                  </div>
                  <p className="text-foreground">
                    "KisanQueue Update: {notif.title}. {notif.message} - Agri Dept, GoK"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {tab === "app" && notifications.length > 0 && (
          <div className="border-t border-border p-3 bg-card flex justify-end">
            <button
              onClick={markAllNotificationsRead}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <Check className="size-3.5" /> Mark all as read
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
