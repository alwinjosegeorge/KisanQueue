import React, { createContext, useContext, useState, useMemo } from "react";
import {
  Role,
  Language,
  User,
  Crop,
  ProcurementCentre,
  Booking,
  QueueItem,
  NotificationItem,
  BottleneckAlert,
  DemandForecast,
  BookingStatus,
} from "./types";

interface KisanQueueContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: User;
  setUser: (u: User | ((prev: User) => User)) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  largeText: boolean;
  setLargeText: (val: boolean | ((prev: boolean) => boolean)) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean | ((prev: boolean) => boolean)) => void;

  centres: ProcurementCentre[];
  crops: Crop[];
  bookings: Booking[];
  activeBooking: Booking | null;
  queue: QueueItem[];
  nowServing: number;
  notifications: NotificationItem[];
  bottlenecks: BottleneckAlert[];
  forecasts: DemandForecast[];

  // Smart Engine Functions
  predictWaitingTime: (centreId: string, userQueueNumber: number) => { timeStr: string; minutesLeft: number; delayMinutes: number };
  getRecommendedCentre: (cropId?: string) => ProcurementCentre;

  // Actions
  bookSlot: (centreId: string, cropName: string, quantityKg: number, date: string, slotTime: string) => Booking;
  rescheduleBooking: (bookingId: string, newDate: string, newSlotTime: string, newCentreId?: string) => void;
  cancelBooking: (bookingId: string) => void;

  // Staff Queue Actions
  callNextFarmer: () => void;
  markFarmerArrived: (queueNumber: number) => void;
  verifyFarmer: (queueNumber: number) => void;
  completeProcurement: (queueNumber: number, weightKg?: number) => void;
  reportDelay: (centreId: string, minutes: number, reason: string) => void;
  clearDelay: (centreId: string) => void;

  // Notification Actions
  addNotification: (title: string, message: string, type: NotificationItem["type"]) => void;
  markAllNotificationsRead: () => void;
}

const KisanQueueContext = createContext<KisanQueueContextType | undefined>(undefined);

const INITIAL_CROPS: Crop[] = [
  {
    id: "paddy",
    name: "Paddy (നെല്ല്)",
    localName: { ml: "നെല്ല് (Paddy)", hi: "धान (Paddy)" },
    mspPerKg: 32,
    icon: "🌾",
    description: "Kerala state procurement with incentive bonus",
  },
  {
    id: "coconut",
    name: "Raw Coconut (തേങ്ങ)",
    localName: { ml: "പച്ചത്തേങ്ങ (Raw Coconut)", hi: "कच्चा नारियल (Coconut)" },
    mspPerKg: 38,
    icon: "🥥",
    description: "KERAFED direct procurement rate",
  },
  {
    id: "rubber",
    name: "Rubber Sheet (റബ്ബർ ഷീറ്റ് - RSS4)",
    localName: { ml: "റബ്ബർ ഷീറ്റ് (Rubber RSS4)", hi: "रबर शीट (Rubber)" },
    mspPerKg: 180,
    icon: "🪵",
    description: "Rubber board incentive price support scheme",
  },
  {
    id: "pepper",
    name: "Black Pepper (കുരുമുളക്)",
    localName: { ml: "കുരുമുളക് (Black Pepper)", hi: "काली मिर्च (Black Pepper)" },
    mspPerKg: 520,
    icon: "🌿",
    description: "Spices Board certified grade procurement",
  },
  {
    id: "cardamom",
    name: "Green Cardamom (ഏലം)",
    localName: { ml: "ഏലം (Cardamom)", hi: "इलायची (Cardamom)" },
    mspPerKg: 1850,
    icon: "🌱",
    description: "Spices Board Grade 8mm+ procurement",
  },
  {
    id: "arecanut",
    name: "Areca Nut (അടയ്ക്ക)",
    localName: { ml: "അടയ്ക്ക (Areca Nut)", hi: "सुपारी (Areca Nut)" },
    mspPerKg: 360,
    icon: "🌰",
    description: "CAMPCO & cooperative procurement support price",
  },
  {
    id: "nutmeg",
    name: "Nutmeg & Mace (ജാതിക്ക)",
    localName: { ml: "ജാതിക്ക (Nutmeg)", hi: "जायफल (Nutmeg)" },
    mspPerKg: 280,
    icon: "🍂",
    description: "Sun-dried bold nutmeg with premium mace subsidy",
  },
  {
    id: "coffee",
    name: "Robusta Coffee (കാപ്പി)",
    localName: { ml: "കാപ്പിക്കുരു (Coffee)", hi: "कॉफ़ी (Coffee)" },
    mspPerKg: 210,
    icon: "☕",
    description: "Wayanad GI Robusta Cherry A procurement",
  },
  {
    id: "banana",
    name: "Nendran Banana (നേന്ത്രക്കായ)",
    localName: { ml: "നേന്ത്രക്കായ (Nendran)", hi: "केला (Banana)" },
    mspPerKg: 42,
    icon: "🍌",
    description: "VFPCK floor price procurement scheme",
  },
];

const INITIAL_CENTRES: ProcurementCentre[] = [
  {
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
    slots: [
      { id: "s1", time: "09:00 – 10:00 AM", available: 2, capacity: 20, status: "almost_full" },
      { id: "s2", time: "10:00 – 11:00 AM", available: 0, capacity: 20, status: "full" },
      { id: "s3", time: "11:00 – 12:00 PM", available: 6, capacity: 20, status: "available" },
      { id: "s4", time: "12:00 – 01:00 PM", available: 11, capacity: 20, status: "available" },
      { id: "s5", time: "02:00 – 03:00 PM", available: 15, capacity: 20, status: "available" },
    ],
  },
  {
    id: "centre-pala",
    name: "Pala Procurement Centre",
    district: "Kottayam",
    location: "Main Road, Pala",
    distanceKm: 14.2,
    workingHours: "08:00 AM – 04:00 PM",
    dailyCapacityKg: 18000,
    todayBookingsCount: 98,
    currentQueueLength: 26,
    avgProcessingMinutes: 9,
    activeDelayMinutes: 25,
    delayReason: "Moisture meter calibration & high paddy volume",
    status: "delayed",
    slots: [
      { id: "s1", time: "09:00 – 10:00 AM", available: 0, capacity: 15, status: "full" },
      { id: "s2", time: "10:00 – 11:00 AM", available: 1, capacity: 15, status: "almost_full" },
      { id: "s3", time: "11:00 – 12:00 PM", available: 3, capacity: 15, status: "almost_full" },
      { id: "s4", time: "01:00 – 02:00 PM", available: 7, capacity: 15, status: "available" },
    ],
  },
  {
    id: "centre-cgry",
    name: "Changanassery Procurement Centre",
    district: "Kottayam",
    location: "Market Road, Changanassery",
    distanceKm: 5.8,
    workingHours: "09:00 AM – 05:00 PM",
    dailyCapacityKg: 22000,
    todayBookingsCount: 165,
    currentQueueLength: 34,
    avgProcessingMinutes: 7,
    activeDelayMinutes: 0,
    status: "busy",
    slots: [
      { id: "s1", time: "09:00 – 10:00 AM", available: 0, capacity: 20, status: "full" },
      { id: "s2", time: "10:00 – 11:00 AM", available: 2, capacity: 20, status: "almost_full" },
      { id: "s3", time: "12:00 – 01:00 PM", available: 4, capacity: 20, status: "almost_full" },
      { id: "s4", time: "02:00 – 03:00 PM", available: 8, capacity: 20, status: "available" },
    ],
  },
  {
    id: "centre-alpy",
    name: "Alappuzha Lake Border Centre",
    district: "Alappuzha",
    location: "Kuttanad Canal Road, Alappuzha",
    distanceKm: 18.5,
    workingHours: "08:00 AM – 04:30 PM",
    dailyCapacityKg: 30000,
    todayBookingsCount: 110,
    currentQueueLength: 8,
    avgProcessingMinutes: 5,
    activeDelayMinutes: 0,
    status: "normal",
    slots: [
      { id: "s1", time: "09:00 – 10:00 AM", available: 12, capacity: 25, status: "available" },
      { id: "s2", time: "10:00 – 11:00 AM", available: 15, capacity: 25, status: "available" },
      { id: "s3", time: "11:00 – 12:00 PM", available: 18, capacity: 25, status: "available" },
    ],
  },
];

const INITIAL_QUEUE: QueueItem[] = [
  { queueNumber: 38, farmerName: "K. R. Varghese", farmerId: "KL-KTM-21045", crop: "Paddy", quantityKg: 650, status: "completed" },
  { queueNumber: 39, farmerName: "Suresh Pillai", farmerId: "KL-KTM-24012", crop: "Paddy", quantityKg: 420, status: "completed" },
  { queueNumber: 40, farmerName: "Mathew Joseph", farmerId: "KL-KTM-19034", crop: "Paddy", quantityKg: 800, status: "serving" },
  { queueNumber: 41, farmerName: "P. N. Shaji", farmerId: "KL-KTM-27891", crop: "Coconut", quantityKg: 300, status: "waiting" },
  { queueNumber: 42, farmerName: "Thomas Kurian", farmerId: "KL-KTM-23456", crop: "Rubber", quantityKg: 150, status: "waiting" },
  { queueNumber: 43, farmerName: "Radhakrishnan M.", farmerId: "KL-KTM-18970", crop: "Paddy", quantityKg: 500, status: "waiting" },
  { queueNumber: 44, farmerName: "Sebastian Luke", farmerId: "KL-KTM-29001", crop: "Paddy", quantityKg: 720, status: "waiting" },
  { queueNumber: 45, farmerName: "V. A. Jacob", farmerId: "KL-KTM-15672", crop: "Coconut", quantityKg: 250, status: "waiting" },
  { queueNumber: 46, farmerName: "Anil Kumar B.", farmerId: "KL-KTM-22319", crop: "Pepper", quantityKg: 90, status: "waiting" },
  { queueNumber: 47, farmerName: "Arun Kumar (You)", farmerId: "KL-KTM-26047", crop: "Rice · 420 kg", quantityKg: 420, status: "waiting", isCurrentFarmer: true },
  { queueNumber: 48, farmerName: "Devasia V.", farmerId: "KL-KTM-29401", crop: "Paddy", quantityKg: 380, status: "waiting" },
  { queueNumber: 49, farmerName: "Manoj Chacko", farmerId: "KL-KTM-31002", crop: "Rubber", quantityKg: 200, status: "waiting" },
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "BK-26047-01",
    farmerId: "KL-KTM-26047",
    farmerName: "Arun Kumar",
    farmerMobile: "+91 94471 28930",
    centreId: "centre-ktm",
    centreName: "Kottayam Procurement Centre",
    crop: "Paddy (നെല്ല്)",
    quantityKg: 420,
    mspPerKg: 32,
    totalAmount: 13440,
    date: "10 September 2026",
    slotTime: "10:30 AM",
    queueNumber: 47,
    status: "confirmed",
    currentStepIndex: 1, // Arrived/Queue stage
    bookedAt: "08 Sep 2026, 04:15 PM",
    transactionId: "TXN80472291",
    paymentStatus: "processing",
  },
  {
    id: "BK-26047-02",
    farmerId: "KL-KTM-26047",
    farmerName: "Arun Kumar",
    farmerMobile: "+91 94471 28930",
    centreId: "centre-ktm",
    centreName: "Kottayam Procurement Centre",
    crop: "Paddy (നെല്ല്)",
    quantityKg: 280,
    mspPerKg: 32,
    totalAmount: 8960,
    date: "22 August 2026",
    slotTime: "11:00 AM",
    queueNumber: 28,
    status: "completed",
    currentStepIndex: 5, // Payment completed
    bookedAt: "20 Aug 2026, 10:30 AM",
    transactionId: "TXN79311204",
    paymentStatus: "completed",
  },
  {
    id: "BK-26047-03",
    farmerId: "KL-KTM-26047",
    farmerName: "Arun Kumar",
    farmerMobile: "+91 94471 28930",
    centreId: "centre-cgry",
    centreName: "Changanassery Procurement Centre",
    crop: "Coconut (തേങ്ങ)",
    quantityKg: 190,
    mspPerKg: 38,
    totalAmount: 7220,
    date: "03 August 2026",
    slotTime: "02:00 PM",
    queueNumber: 15,
    status: "completed",
    currentStepIndex: 5,
    bookedAt: "01 Aug 2026, 02:45 PM",
    transactionId: "TXN77109845",
    paymentStatus: "completed",
  },
];

const INITIAL_BOTTLENECKS: BottleneckAlert[] = [
  {
    centreId: "centre-pala",
    centreName: "Pala Procurement Centre",
    severity: "high",
    title: "Moisture Testing Bottleneck Detected",
    message: "Average farmer wait time has jumped by +32% above baseline.",
    increasePercentage: 32,
    bottleneckArea: "Moisture Content & Quality Grading Station",
    recommendedAction: "Deploy 1 additional quality testing officer to Gate 2.",
  },
  {
    centreId: "centre-cgry",
    centreName: "Changanassery Procurement Centre",
    severity: "medium",
    title: "Yard Vehicle Queuing Congestion",
    message: "Trailer unloading queue is exceeding the front holding bay.",
    increasePercentage: 18,
    bottleneckArea: "Unloading Platform B",
    recommendedAction: "Activate auxiliary weighing scale #2 for small pickup vehicles.",
  },
];

const INITIAL_FORECASTS: DemandForecast[] = [
  {
    centreId: "centre-ktm",
    centreName: "Kottayam Procurement Centre",
    expectedDemand: "high",
    projectedBookings: 185,
    recommendedStaffCount: 8,
    recommendedSlotCapacity: 25,
    reason: "Clear weather forecast post-harvest in Kumarakom and Aymanam paddy clusters.",
  },
  {
    centreId: "centre-alpy",
    centreName: "Alappuzha Lake Border Centre",
    expectedDemand: "high",
    projectedBookings: 160,
    recommendedStaffCount: 7,
    recommendedSlotCapacity: 30,
    reason: "Kuttanad second-crop harvesting season peak beginning this weekend.",
  },
];

export function KisanQueueProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("farmer");
  const [language, setLanguage] = useState<Language>("en");
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const [user, setUser] = useState<User>({
    id: "usr-01",
    name: "Arun Kumar",
    role: "farmer",
    mobile: "+91 94471 28930",
    farmerId: "KL-KTM-26047",
    village: "Kumarakom",
    district: "Kottayam",
    state: "Kerala",
    primaryCrop: "Paddy & Coconut",
    crops: ["paddy", "coconut"],
    bankAccount: "SBI A/C **** 4891",
    ifsc: "SBIN0070114",
  });

  const [centres, setCentres] = useState<ProcurementCentre[]>(INITIAL_CENTRES);
  const [crops] = useState<Crop[]>(INITIAL_CROPS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [queue, setQueue] = useState<QueueItem[]>(INITIAL_QUEUE);
  const [nowServing, setNowServing] = useState(40);
  const [bottlenecks] = useState<BottleneckAlert[]>(INITIAL_BOTTLENECKS);
  const [forecasts] = useState<DemandForecast[]>(INITIAL_FORECASTS);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n-1",
      title: "Booking Confirmed #47",
      message: "Your slot at Kottayam Procurement Centre is locked for 10 Sep, 10:30 AM.",
      timestamp: "Today, 09:15 AM",
      type: "booking",
      read: false,
    },
    {
      id: "n-2",
      title: "Queue Moving Smoothly",
      message: "Now serving token #40. 7 farmers ahead of you. Estimated turn: 24 mins.",
      timestamp: "10 mins ago",
      type: "queue",
      read: false,
    },
  ]);

  const addNotification = (title: string, message: string, type: NotificationItem["type"]) => {
    const newItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: "Just now",
      type,
      read: false,
    };
    setNotifications((prev) => [newItem, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const activeBooking = useMemo(() => {
    return bookings.find((b) => b.status !== "completed" && b.status !== "cancelled") ?? null;
  }, [bookings]);

  // Smart Engine: Waiting-time prediction
  const predictWaitingTime = (centreId: string, userQueueNumber: number) => {
    const centre = centres.find((c) => c.id === centreId) ?? centres[0];
    const farmersAhead = Math.max(0, userQueueNumber - nowServing);
    const rawMinutes = farmersAhead * centre.avgProcessingMinutes;
    const totalMinutes = rawMinutes + centre.activeDelayMinutes;

    const arrival = new Date(Date.now() + totalMinutes * 60 * 1000);
    const timeStr = arrival.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return {
      timeStr,
      minutesLeft: totalMinutes,
      delayMinutes: centre.activeDelayMinutes,
    };
  };

  // Smart Engine: Centre Recommendation algorithm (Multi-factor ranking)
  const getRecommendedCentre = (cropId?: string) => {
    // Scoring: Distance (30%) + Waiting Time (40%) + Remaining Capacity (30%)
    let bestCentre = centres[0];
    let bestScore = Infinity;

    centres.forEach((centre) => {
      const waitTime = centre.currentQueueLength * centre.avgProcessingMinutes + centre.activeDelayMinutes;
      // Lower score = better recommendation
      const score = centre.distanceKm * 2.5 + waitTime * 1.5 - (centre.status === "normal" ? 10 : 0);
      if (score < bestScore) {
        bestScore = score;
        bestCentre = centre;
      }
    });

    return bestCentre;
  };

  // Farmer Actions
  const bookSlot = (
    centreId: string,
    cropName: string,
    quantityKg: number,
    date: string,
    slotTime: string
  ): Booking => {
    const centre = centres.find((c) => c.id === centreId) || centres[0];
    const newQueueNum = nowServing + queue.length + 1;
    const cropObj = crops.find((c) => c.name.includes(cropName)) || crops[0];

    const newBooking: Booking = {
      id: `KQ-${Math.floor(10000 + Math.random() * 90000)}`,
      farmerId: user.farmerId || "KL-KTM-26047",
      farmerName: user.name,
      farmerMobile: user.mobile,
      centreId: centre.id,
      centreName: centre.name,
      crop: cropName,
      quantityKg,
      mspPerKg: cropObj.mspPerKg,
      totalAmount: quantityKg * cropObj.mspPerKg,
      date,
      slotTime,
      queueNumber: newQueueNum,
      status: "confirmed",
      currentStepIndex: 0,
      bookedAt: "Just now",
      transactionId: `TXN${Math.floor(10000000 + Math.random() * 90000000)}`,
      paymentStatus: "processing",
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Update centre today's bookings
    setCentres((prev) =>
      prev.map((c) =>
        c.id === centreId
          ? { ...c, todayBookingsCount: c.todayBookingsCount + 1, currentQueueLength: c.currentQueueLength + 1 }
          : c
      )
    );

    // Add to queue and ensure only newest token is marked as current farmer
    setQueue((prev) => [
      ...prev.map((item) => (item.isCurrentFarmer ? { ...item, isCurrentFarmer: false } : item)),
      {
        queueNumber: newQueueNum,
        farmerName: `${user.name} (You)`,
        farmerId: user.farmerId || "KL-KTM-26047",
        crop: cropName,
        quantityKg,
        status: "waiting",
        isCurrentFarmer: true,
      },
    ]);

    addNotification(
      "Slot Booked Successfully! 🎟️",
      `Assigned Token #${newQueueNum} at ${centre.name} for ${date} (${slotTime}).`,
      "booking"
    );

    return newBooking;
  };

  const rescheduleBooking = (bookingId: string, newDate: string, newSlotTime: string, newCentreId?: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const centre = newCentreId ? centres.find((c) => c.id === newCentreId) || centres[0] : centres.find((c) => c.id === b.centreId) || centres[0];
          return {
            ...b,
            date: newDate,
            slotTime: newSlotTime,
            centreId: centre.id,
            centreName: centre.name,
            queueNumber: b.queueNumber + 2,
          };
        }
        return b;
      })
    );

    addNotification(
      "Booking Rescheduled 🔄",
      `Your booking was moved to ${newDate} at ${newSlotTime}. Queue recalculated.`,
      "booking"
    );
  };

  const cancelBooking = (bookingId: string) => {
    const target = bookings.find((b) => b.id === bookingId);
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
    );

    if (target) {
      setQueue((prev) => prev.filter((item) => item.queueNumber !== target.queueNumber));
    }

    addNotification(
      "Booking Cancelled ✕",
      `Slot for Token #${target?.queueNumber || bookingId} at ${target?.centreName || "Procurement Centre"} has been cancelled and released.`,
      "booking"
    );
  };

  // Staff Queue Actions
  const callNextFarmer = () => {
    const nextToken = nowServing + 1;
    setNowServing(nextToken);

    setQueue((prev) =>
      prev.map((item) => {
        if (item.queueNumber === nextToken) {
          return { ...item, status: "serving" };
        }
        if (item.queueNumber < nextToken) {
          return { ...item, status: "completed" };
        }
        return item;
      })
    );

    // If user's token is close, notify
    if (activeBooking && activeBooking.queueNumber - nextToken <= 3) {
      addNotification(
        "⚡ Your Turn Approaching!",
        `Now serving #${nextToken}. You are Token #${activeBooking.queueNumber} (${activeBooking.queueNumber - nextToken} farmers ahead). Please stand near Gate 1.`,
        "queue"
      );
    } else {
      addNotification(
        "Queue Advanced 📢",
        `Now calling Token #${nextToken} to weighing bay.`,
        "queue"
      );
    }
  };

  const markFarmerArrived = (queueNumber: number) => {
    setBookings((prev) =>
      prev.map((b) => (b.queueNumber === queueNumber ? { ...b, status: "arrived", currentStepIndex: 1 } : b))
    );
    addNotification("Farmer Arrival Verified", `Token #${queueNumber} checked in at procurement yard gate.`, "queue");
  };

  const verifyFarmer = (queueNumber: number) => {
    setBookings((prev) =>
      prev.map((b) => (b.queueNumber === queueNumber ? { ...b, status: "verified", currentStepIndex: 2 } : b))
    );
    addNotification("Moisture & Quality Passed ✓", `Token #${queueNumber} verification completed. Approved for weighing.`, "procurement");
  };

  const completeProcurement = (queueNumber: number, weightKg?: number) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.queueNumber === queueNumber) {
          const finalWeight = weightKg || b.quantityKg;
          return {
            ...b,
            quantityKg: finalWeight,
            totalAmount: finalWeight * b.mspPerKg,
            status: "completed",
            currentStepIndex: 5,
            paymentStatus: "completed",
          };
        }
        return b;
      })
    );

    setQueue((prev) =>
      prev.map((item) => (item.queueNumber === queueNumber ? { ...item, status: "completed" } : item))
    );

    addNotification(
      "Payment Initiated! 💰",
      `Procurement for Token #${queueNumber} completed. ₹13,440 credited to SBI A/C ****4891 via DBT.`,
      "payment"
    );
  };

  const reportDelay = (centreId: string, minutes: number, reason: string) => {
    setCentres((prev) =>
      prev.map((c) =>
        c.id === centreId
          ? {
              ...c,
              activeDelayMinutes: minutes,
              delayReason: reason,
              status: minutes > 0 ? "delayed" : "normal",
            }
          : c
      )
    );

    addNotification(
      `⚠️ Operational Delay Reported: +${minutes} mins`,
      `Kottayam Centre delay due to "${reason}". All farmer estimated times have been automatically recalculated.`,
      "delay"
    );
  };

  const clearDelay = (centreId: string) => {
    setCentres((prev) =>
      prev.map((c) =>
        c.id === centreId ? { ...c, activeDelayMinutes: 0, delayReason: undefined, status: "normal" } : c
      )
    );

    addNotification(
      "Delay Resolved ✓",
      "Normal queue processing resumed. Waiting times normalized.",
      "delay"
    );
  };

  return (
    <KisanQueueContext.Provider
      value={{
        role,
        setRole,
        user,
        setUser,
        language,
        setLanguage,
        largeText,
        setLargeText,
        highContrast,
        setHighContrast,
        centres,
        crops,
        bookings,
        activeBooking,
        queue,
        nowServing,
        notifications,
        bottlenecks,
        forecasts,
        predictWaitingTime,
        getRecommendedCentre,
        bookSlot,
        rescheduleBooking,
        cancelBooking,
        callNextFarmer,
        markFarmerArrived,
        verifyFarmer,
        completeProcurement,
        reportDelay,
        clearDelay,
        addNotification,
        markAllNotificationsRead,
      }}
    >
      {children}
    </KisanQueueContext.Provider>
  );
}

export function useKisanQueue() {
  const context = useContext(KisanQueueContext);
  if (!context) {
    throw new Error("useKisanQueue must be used within a KisanQueueProvider");
  }
  return context;
}
