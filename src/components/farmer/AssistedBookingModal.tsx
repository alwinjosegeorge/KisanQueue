import React from "react";
import { IVRCallSimulator } from "@/components/ivr/IVRCallSimulator";
import { X, Headphones } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function AssistedBookingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg my-auto rounded-[36px] bg-white border border-stone-200 shadow-2xl p-4 sm:p-5 text-stone-900">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Headphones className="size-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-stone-900">Toll-Free IVR Call Booking (1800-425-1661)</h2>
              <p className="text-[11px] text-stone-500">Interactive voice simulation for non-smartphone farmers</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Embedded Call Simulator */}
        <div className="flex justify-center">
          <IVRCallSimulator
            isModal={true}
            onClose={onClose}
            onNavigateToDashboard={() => {
              onClose();
              navigate({ to: "/" });
            }}
            onNavigateToQueue={() => {
              onClose();
              navigate({ to: "/" });
            }}
          />
        </div>
      </div>
    </div>
  );
}
