import React, { useState } from "react";
import { useKisanQueue } from "@/lib/store";
import { ArrowLeft, MapPin, Navigation, Clock, UsersRound, Sparkles, Check, ExternalLink } from "lucide-react";

export function CentreMapView({
  onBack,
  onSelectCentre,
}: {
  onBack: () => void;
  onSelectCentre: (name: string) => void;
}) {
  const { centres, getRecommendedCentre } = useKisanQueue();
  const recommendedCentre = getRecommendedCentre();
  const [selectedId, setSelectedId] = useState(recommendedCentre.id);

  const activeCentre = centres.find((c) => c.id === selectedId) || centres[0];

  return (
    <div className="content-stack pt-2 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold">Procurement Centres Map</h1>
          <p className="text-xs text-muted-foreground">Kottayam & Central Travancore District Cluster</p>
        </div>
      </div>

      {/* Stylized Interactive Map Panel */}
      <div className="relative h-64 overflow-hidden rounded-3xl border border-border bg-muted shadow-inner">
        {/* Abstract road grid & water bodies styling */}
        <div className="absolute inset-0 bg-[radial-gradient(#123D35_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
        <div className="absolute -left-10 top-20 h-4 w-[120%] rotate-[-12deg] bg-secondary/30 rounded-full" />
        <div className="absolute left-10 -top-10 h-[140%] w-4 rotate-[25deg] bg-primary/20 rounded-full" />
        <div className="absolute bottom-6 right-6 h-16 w-28 rounded-full bg-emerald-500/10 blur-xl" />

        {/* User Location Pulse */}
        <div className="absolute left-[38%] top-[55%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <span className="relative flex size-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-4 rounded-full bg-primary ring-2 ring-white" />
          </span>
          <span className="mt-1 rounded-md bg-background/90 px-1.5 py-0.5 text-[9px] font-bold shadow-sm">
            You (Farm)
          </span>
        </div>

        {/* Centre Pins */}
        {centres.map((c, i) => {
          const isSelected = c.id === selectedId;
          const isRec = c.id === recommendedCentre.id;
          // Preset coordinates on the stylized map
          const positions = [
            { left: "48%", top: "35%" },
            { left: "75%", top: "25%" },
            { left: "30%", top: "70%" },
            { left: "18%", top: "42%" },
          ];
          const pos = positions[i % positions.length];

          return (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              style={{ left: pos.left, top: pos.top }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all ${
                isSelected ? "scale-110 z-20" : "scale-95 opacity-85 hover:scale-105 z-10"
              }`}
            >
              <div
                className={`flex size-8 items-center justify-center rounded-full shadow-md transition-all ${
                  isRec
                    ? "bg-amber-500 text-white ring-4 ring-amber-300/40"
                    : isSelected
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/30"
                    : "bg-card text-foreground border border-border"
                }`}
              >
                <MapPin className="size-4" />
              </div>
              <span className="mt-1 whitespace-nowrap rounded-md bg-card/95 border border-border/80 px-1.5 py-0.5 text-[9px] font-bold shadow-sm">
                {c.name.replace(" Procurement Centre", "")} ({c.distanceKm} km)
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Centre Details Card */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm">{activeCentre.name}</h3>
              {activeCentre.id === recommendedCentre.id && (
                <span className="rounded-full bg-amber-500/15 text-amber-700 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                  <Sparkles className="size-3" /> Recommended
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{activeCentre.location}</p>
          </div>

          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
              activeCentre.status === "normal"
                ? "bg-emerald-500/15 text-emerald-700"
                : activeCentre.status === "busy"
                ? "bg-amber-500/15 text-amber-700"
                : "bg-destructive/15 text-destructive"
            }`}
          >
            {activeCentre.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-3 text-xs">
          <div>
            <span className="text-[10px] text-muted-foreground block">Distance</span>
            <strong>{activeCentre.distanceKm} km</strong>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Current Queue</span>
            <strong>{activeCentre.currentQueueLength} farmers</strong>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Est Wait Time</span>
            <strong>~{activeCentre.currentQueueLength * activeCentre.avgProcessingMinutes} mins</strong>
          </div>
        </div>

        <div className="flex gap-2 border-t border-border/60 pt-3">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(activeCentre.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-sm"
          >
            <Navigation className="size-4" /> Get Directions <ExternalLink className="size-3" />
          </a>

          <button
            type="button"
            onClick={() => onSelectCentre(activeCentre.name)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2.5 text-xs font-bold hover:bg-muted"
          >
            Select for Booking
          </button>
        </div>
      </div>
    </div>
  );
}
