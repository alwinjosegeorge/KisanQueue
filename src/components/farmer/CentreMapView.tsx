import React, { useState, useEffect, useRef } from "react";
import { useKisanQueue } from "@/lib/store";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Clock,
  UsersRound,
  Sparkles,
  ExternalLink,
  Layers,
  LocateFixed,
  Maximize2,
  CalendarDays,
} from "lucide-react";

interface CentreMapViewProps {
  onBack: () => void;
  onSelectCentre: (name: string) => void;
}

// Precise geographic coordinates for Central Travancore / Kerala cluster
const CENTRE_COORDS: Record<string, { lat: number; lng: number; area: string }> = {
  "centre-ktm": { lat: 9.5916, lng: 76.5222, area: "Nagampadam, Kottayam" },
  "centre-pala": { lat: 9.7117, lng: 76.6841, area: "Main Road, Pala" },
  "centre-cgry": { lat: 9.4442, lng: 76.5413, area: "Market Road, Changanassery" },
  "centre-alpy": { lat: 9.4981, lng: 76.3388, area: "Kuttanad Canal Road, Alappuzha" },
};

const FARMER_LOCATION = {
  lat: 9.593,
  lng: 76.4312,
  name: "Your Farm (Kumarakom / Kottayam)",
};

export function CentreMapView({ onBack, onSelectCentre }: CentreMapViewProps) {
  const { centres, getRecommendedCentre } = useKisanQueue();
  const recommendedCentre = getRecommendedCentre();
  const [selectedId, setSelectedId] = useState(recommendedCentre.id);
  const [mapType, setMapType] = useState<"street" | "satellite">("street");
  const [isMapReady, setIsMapReady] = useState(false);

  const activeCentre = centres.find((c) => c.id === selectedId) || centres[0];

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [id: string]: any }>({});
  const routeLineRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const leafletModuleRef = useRef<any>(null);

  // Initialize interactive Leaflet map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = await import("leaflet");
      if (!isMounted || !mapContainerRef.current) return;
      leafletModuleRef.current = L;

      // Create Leaflet instance centered on Kerala cluster
      const map = L.map(mapContainerRef.current, {
        center: [9.58, 76.51],
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
      });
      mapInstanceRef.current = map;

      // Add default tile layer (Carto Voyager - crisp, fast, modern map)
      const streetLayer = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          subdomains: "abcd",
        }
      );
      streetLayer.addTo(map);
      tileLayerRef.current = streetLayer;

      // 1. Add Farmer Origin Marker
      const farmerIcon = L.divIcon({
        className: "custom-farmer-pin",
        html: `
          <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -50%);">
            <div style="position:relative; display:flex; align-items:center; justify-content:center;">
              <span style="position:absolute; width:28px; height:28px; border-radius:50%; background-color:rgba(18,61,53,0.35); animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></span>
              <div style="position:relative; display:flex; width:22px; height:22px; border-radius:50%; background-color:#123D35; border:2px solid white; box-shadow:0 4px 6px -1px rgba(0,0,0,0.3); align-items:center; justify-content:center; color:white; font-size:10px;">
                🚜
              </div>
            </div>
            <span style="margin-top:3px; font-weight:800; font-size:9px; background:white; color:#123D35; padding:2px 6px; border-radius:6px; box-shadow:0 2px 4px rgba(0,0,0,0.15); border:1px solid #e5e7eb; white-space:nowrap;">
              Your Farm
            </span>
          </div>
        `,
        iconSize: [30, 42],
        iconAnchor: [15, 21],
      });

      L.marker([FARMER_LOCATION.lat, FARMER_LOCATION.lng], { icon: farmerIcon })
        .addTo(map)
        .bindPopup(
          `<strong>🚜 Your Farm</strong><br><span style="font-size:11px; color:#6b7280;">Kumarakom Agricultural Belt</span>`
        );

      // 2. Add Centre Pins
      centres.forEach((c) => {
        const coords = CENTRE_COORDS[c.id] || { lat: 9.58, lng: 76.52 };
        const isRec = c.id === recommendedCentre.id;
        const color =
          c.status === "normal" ? "#16a34a" : c.status === "busy" ? "#d97706" : "#dc2626";

        const centreIcon = L.divIcon({
          className: `custom-centre-pin-${c.id}`,
          html: `
            <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%); cursor:pointer;">
              <div style="background-color:${color}; color:white; padding:4px 8px; border-radius:12px; font-size:10px; font-weight:700; box-shadow:0 4px 8px rgba(0,0,0,0.25); border:2px solid white; display:flex; align-items:center; gap:4px; white-space:nowrap;">
                ${isRec ? "⭐" : "🌾"} <span>${c.name.replace(" Procurement Centre", "")}</span>
                <span style="background:rgba(0,0,0,0.25); border-radius:9999px; padding:1px 5px; font-size:8px;">${c.currentQueueLength} in line</span>
              </div>
              <div style="width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:7px solid ${color}; margin-top:-1px;"></div>
            </div>
          `,
          iconSize: [120, 36],
          iconAnchor: [60, 36],
        });

        const marker = L.marker([coords.lat, coords.lng], { icon: centreIcon })
          .addTo(map)
          .on("click", () => {
            setSelectedId(c.id);
          });

        markersRef.current[c.id] = marker;
      });

      // Force size recomputation
      setTimeout(() => {
        map.invalidateSize();
        setIsMapReady(true);
      }, 150);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [centres, recommendedCentre.id]);

  // Handle map type toggle (Street vs Satellite)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = leafletModuleRef.current;
    if (!map || !L) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    if (mapType === "satellite") {
      const satLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 19,
          attribution: "Esri Satellite",
        }
      );
      satLayer.addTo(map);
      tileLayerRef.current = satLayer;
    } else {
      const streetLayer = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          subdomains: "abcd",
          attribution: "Carto / OSM",
        }
      );
      streetLayer.addTo(map);
      tileLayerRef.current = streetLayer;
    }
  }, [mapType]);

  // Reactively pan, highlight, and draw route polyline to selected centre
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = leafletModuleRef.current;
    if (!map || !L) return;

    const coords = CENTRE_COORDS[selectedId];
    if (!coords) return;

    // Smoothly fly to selected centre
    map.flyTo([coords.lat, coords.lng], 12.5, {
      duration: 1.2,
    });

    // Remove existing route line
    if (routeLineRef.current) {
      map.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }

    // Draw connecting dashed route polyline from Farmer -> Centre
    const latlngs = [
      [FARMER_LOCATION.lat, FARMER_LOCATION.lng],
      [coords.lat, coords.lng],
    ];

    const polyline = L.polyline(latlngs, {
      color: "#123D35",
      weight: 3.5,
      dashArray: "8, 10",
      opacity: 0.85,
    }).addTo(map);

    routeLineRef.current = polyline;
  }, [selectedId]);

  // Zoom control helpers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleFitAll = () => {
    const map = mapInstanceRef.current;
    const L = leafletModuleRef.current;
    if (!map || !L) return;

    const points: [number, number][] = [
      [FARMER_LOCATION.lat, FARMER_LOCATION.lng],
      ...Object.values(CENTRE_COORDS).map((c) => [c.lat, c.lng] as [number, number]),
    ];

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40] });
  };

  return (
    <div className="content-stack pt-2 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-muted"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold">Procurement Map</h1>
            <p className="text-xs text-muted-foreground">Live GPS Telemetry & Kerala Centre Grid</p>
          </div>
        </div>

        {/* Satellite / Street view switch */}
        <div className="flex items-center rounded-xl border border-border bg-card p-1 shadow-sm text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMapType("street")}
            className={`rounded-lg px-2.5 py-1 text-[11px] transition-all ${
              mapType === "street" ? "bg-primary text-primary-foreground font-bold shadow-sm" : "text-muted-foreground"
            }`}
          >
            Map
          </button>
          <button
            type="button"
            onClick={() => setMapType("satellite")}
            className={`rounded-lg px-2.5 py-1 text-[11px] transition-all ${
              mapType === "satellite" ? "bg-primary text-primary-foreground font-bold shadow-sm" : "text-muted-foreground"
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* Real Interactive Map Container */}
      <div className="relative h-80 w-full overflow-hidden rounded-3xl border border-border bg-muted shadow-md">
        <div ref={mapContainerRef} className="h-full w-full z-0" />

        {/* Floating Custom Map Controls */}
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5 shadow-md">
          <button
            type="button"
            onClick={handleZoomIn}
            className="flex size-8 items-center justify-center rounded-xl bg-card/95 border border-border font-bold text-foreground hover:bg-muted shadow-sm transition-colors text-sm"
            title="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="flex size-8 items-center justify-center rounded-xl bg-card/95 border border-border font-bold text-foreground hover:bg-muted shadow-sm transition-colors text-sm"
            title="Zoom out"
          >
            -
          </button>
          <button
            type="button"
            onClick={handleFitAll}
            className="flex size-8 items-center justify-center rounded-xl bg-card/95 border border-border text-foreground hover:bg-muted shadow-sm transition-colors"
            title="Fit All Kerala Centres"
          >
            <Maximize2 className="size-3.5 text-primary" />
          </button>
        </div>

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-10 rounded-xl bg-card/95 border border-border/80 px-2.5 py-1.5 backdrop-blur-sm shadow-md text-[10px] space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#123D35]" />
            <span className="font-semibold text-foreground">🚜 Your Farm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-600" />
            <span className="text-muted-foreground">🟢 Normal Queue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">🟡 Busy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-rose-600" />
            <span className="text-muted-foreground">🔴 Delayed (+25m)</span>
          </div>
        </div>
      </div>

      {/* Quick Centre Selector Carousel Pills */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Select Centre to Inspect & Route
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {centres.map((c) => {
            const isSelected = c.id === selectedId;
            const isRec = c.id === recommendedCentre.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                className={`flex flex-col items-start rounded-2xl border p-2.5 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/40"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-xs font-bold truncate">
                    {c.name.replace(" Procurement Centre", "")}
                  </span>
                  {isRec && <span className="text-[10px]">⭐</span>}
                </div>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  {c.distanceKm} km · {c.currentQueueLength} in line
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Centre Details Card */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-foreground">{activeCentre.name}</h3>
              {activeCentre.id === recommendedCentre.id && (
                <span className="rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                  <Sparkles className="size-3" /> Recommended
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{activeCentre.location}</p>
          </div>

          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
              activeCentre.status === "normal"
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : activeCentre.status === "busy"
                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                : "bg-rose-500/15 text-rose-700 dark:text-rose-300"
            }`}
          >
            {activeCentre.status === "normal"
              ? "Normal"
              : activeCentre.status === "busy"
              ? "Busy"
              : "Delayed"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-3 text-xs">
          <div>
            <span className="text-[10px] text-muted-foreground block">Road Distance</span>
            <strong className="text-foreground">{activeCentre.distanceKm} km</strong>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Active Queue</span>
            <strong className="text-foreground">{activeCentre.currentQueueLength} farmers</strong>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Est Turnaround</span>
            <strong className={activeCentre.activeDelayMinutes > 0 ? "text-rose-600 font-bold" : "text-foreground"}>
              ~{activeCentre.currentQueueLength * activeCentre.avgProcessingMinutes + activeCentre.activeDelayMinutes} mins
            </strong>
          </div>
        </div>

        <div className="flex gap-2 border-t border-border/60 pt-3">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(activeCentre.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2.5 text-xs font-bold text-foreground hover:bg-muted transition-colors shadow-sm"
          >
            <Navigation className="size-3.5 text-primary" /> Directions <ExternalLink className="size-3 text-muted-foreground" />
          </a>

          <button
            type="button"
            onClick={() => onSelectCentre(activeCentre.name)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:opacity-90 transition-opacity"
          >
            <CalendarDays className="size-3.5" /> Book at this Centre
          </button>
        </div>
      </div>
    </div>
  );
}
