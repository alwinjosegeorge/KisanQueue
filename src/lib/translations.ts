import { Language } from "./types";

export const translations = {
  en: {
    appName: "KisanQueue",
    tagline: "Fair & Fast Agricultural Procurement Queue",
    subTagline: "A calm, predictable journey from slot booking to bank settlement.",
    farmerApp: "Farmer App",
    staffDashboard: "Procurement Staff",
    adminDashboard: "Government Admin",
    switchRole: "Switch Role",
    notifications: "Notifications",
    smsAlerts: "SMS Alerts",
    markAllRead: "Mark all as read",
    noNotifications: "No new notifications",

    // Navigation
    home: "Home",
    bookings: "Bookings",
    queue: "Live Queue",
    procurement: "Procurement",
    payments: "Payments",
    profile: "Profile",

    // Farmer Home
    goodMorning: "Good Morning, Farmer 👋",
    upcomingBooking: "Your Next Procurement",
    liveStatus: "Live Queue Active",
    tokenNumber: "Token",
    nowServing: "Now Serving",
    farmersAhead: "Farmers ahead",
    estWait: "Estimated wait",
    quickActions: "Quick Actions",
    bookSlot: "Book Slot",
    liveQueue: "Live Queue",
    myBookings: "My Bookings",
    paymentStatus: "Payment Status",
    assistedBooking: "Assisted Booking",
    needHelp: "Need help booking? Call toll-free 1800-425-1661 or ask centre staff.",

    // Smart Centre Recommendation
    recommendedCentre: "Recommended Centre",
    recommendedReason: "Shortest queue & fastest estimated processing",
    congestionLow: "Low congestion",
    congestionMed: "Moderate flow",
    congestionHigh: "High congestion",
    delayReported: "Operational Delay",

    // Booking Flow
    stepCrop: "Select Crop",
    stepCentre: "Select Centre",
    stepDate: "Select Date",
    stepSlot: "Choose Time Slot",
    confirmBooking: "Confirm Slot",
    slotAvailable: "Available",
    slotAlmostFull: "Filling fast",
    slotFull: "Full",

    // Live Queue
    queuePipeline: "Queue Pipeline",
    yourToken: "Your Token",
    approxTime: "Expected turn at",
    getDirections: "Get Directions",
    rescheduleSlot: "Reschedule Slot",
    cancelSlot: "Cancel Slot",

    // Staff
    todayBookings: "Today's Bookings",
    waitingInYard: "Waiting in Yard",
    centreCapacity: "Yard Capacity",
    avgProcessingTime: "Avg Processing",
    callNext: "Call Next Farmer",
    markArrived: "Mark Arrived",
    verifyFarmer: "Verify & Grade",
    completeProcure: "Complete Procurement",
    reportDelay: "Report Operational Delay",
    clearDelay: "Clear Delay",
    activeDelays: "Active Delays",

    // Admin
    statewideOverview: "Kerala Agricultural Procurement Directorate",
    totalCentres: "Total Centres",
    todayFarmers: "Today's Farmers",
    completedProcurement: "Completed Volume",
    totalPayout: "Direct Payouts (MSP)",
    bottleneckAlert: "Smart Bottleneck Alert",
    demandForecast: "Demand Forecast",
    downloadReport: "Download Report (PDF/CSV)",
  },
  ml: {
    appName: "കിസാൻക്യൂ (KisanQueue)",
    tagline: "കർഷകർക്കായി വേഗത്തിലും സുതാര്യവുമായ ക്യൂ സമ്പ്രദായം",
    subTagline: "സ്ലോട്ട് ബുക്കിംഗ് മുതൽ ബാങ്ക് പേയ്മെന്റ് വരെ തടസ്സമില്ലാത്ത അനുഭവം.",
    farmerApp: "കർഷക ആപ്പ്",
    staffDashboard: "സെന്റർ സ്റ്റാഫ്",
    adminDashboard: "സർക്കാർ അഡ്മിൻ",
    switchRole: "റോൾ മാറ്റുക",
    notifications: "അറിയിപ്പുകൾ",
    smsAlerts: "എസ്.എം.എസ് സന്ദേശങ്ങൾ",
    markAllRead: "എല്ലാം വായിച്ചതായി അടയാളപ്പെടുത്തുക",
    noNotifications: "പുതിയ അറിയിപ്പുകളില്ല",

    // Navigation
    home: "ഹോം",
    bookings: "ബുക്കിംഗുകൾ",
    queue: "തത്സമയ ക്യൂ",
    procurement: "സംഭരണം",
    payments: "പേയ്‌മെന്റുകൾ",
    profile: "പ്രൊഫൈൽ",

    // Farmer Home
    goodMorning: "സുപ്രഭാതം, കർഷക സുഹൃത്തേ 👋",
    upcomingBooking: "അടുത്ത സംഭരണ സ്ലോട്ട്",
    liveStatus: "ക്യൂ തത്സമയം സജീവം",
    tokenNumber: "ടോക്കൺ",
    nowServing: "ഇപ്പോൾ വിളിക്കുന്നത്",
    farmersAhead: "മുന്നിലുള്ള കർഷകർ",
    estWait: "പ്രതീക്ഷിക്കുന്ന കാത്തിരിപ്പ്",
    quickActions: "ദ്രുത സേവനങ്ങൾ",
    bookSlot: "സ്ലോട്ട് ബുക്ക് ചെയ്യുക",
    liveQueue: "ലൈവ് ക്യൂ ട്രാക്കിംഗ്",
    myBookings: "എന്റെ ബുക്കിംഗുകൾ",
    paymentStatus: "പേയ്‌മെന്റ് വിവരങ്ങൾ",
    assistedBooking: "സഹായത്തോടെയുള്ള ബുക്കിംഗ്",
    needHelp: "ബുക്ക് ചെയ്യാൻ സഹായം വേണമോ? 1800-425-1661 എന്ന നമ്പറിൽ വിളിക്കുക.",

    // Smart Centre Recommendation
    recommendedCentre: "ഏറ്റവും അനുയോജ്യമായ കേന്ദ്രം",
    recommendedReason: "കുറഞ്ഞ ക്യൂവും ഏറ്റവും വേഗത്തിലുള്ള സേവനവും",
    congestionLow: "കുറഞ്ഞ തിരക്ക്",
    congestionMed: "മിതമായ തിരക്ക്",
    congestionHigh: "കൂടിയ തിരക്ക്",
    delayReported: "സെന്ററിൽ താമസം നേരിടുന്നു",

    // Booking Flow
    stepCrop: "വിള തിരഞ്ഞെടുക്കുക",
    stepCentre: "സംഭരണ കേന്ദ്രം തിരഞ്ഞെടുക്കുക",
    stepDate: "തീയതി തിരഞ്ഞെടുക്കുക",
    stepSlot: "സമയം തിരഞ്ഞെടുക്കുക",
    confirmBooking: "സ്ലോട്ട് ഉറപ്പാക്കുക",
    slotAvailable: "ലഭ്യമാണ്",
    slotAlmostFull: "വേഗത്തിൽ നിറയുന്നു",
    slotFull: "പൂർണ്ണമായി",

    // Live Queue
    queuePipeline: "തത്സമയ ക്യൂ ലൈൻ",
    yourToken: "നിങ്ങളുടെ ടോക്കൺ",
    approxTime: "പ്രതീക്ഷിക്കുന്ന സമയം",
    getDirections: "വഴി കാട്ടുക (Directions)",
    rescheduleSlot: "സമയം മാറ്റുക",
    cancelSlot: "റദ്ദാക്കുക",

    // Staff
    todayBookings: "ഇന്നത്തെ ബുക്കിംഗുകൾ",
    waitingInYard: "കാത്തിരിക്കുന്നവർ",
    centreCapacity: "യാർഡ് കപ്പാസിറ്റി",
    avgProcessingTime: "ശരാശരി സമയം",
    callNext: "അടുത്ത കർഷകനെ വിളിക്കുക",
    markArrived: "എത്തിയതായി രേഖപ്പെടുത്തുക",
    verifyFarmer: "പരിശോധിച്ച് അംഗീകരിക്കുക",
    completeProcure: "സംഭരണം പൂർത്തിയാക്കുക",
    reportDelay: "താമസം റിപ്പോർട്ട് ചെയ്യുക",
    clearDelay: "താമസം പരിഹരിച്ചു",
    activeDelays: "നിലവിലെ താമസം",

    // Admin
    statewideOverview: "കേരള കാർഷിക വികസന-കർഷകക്ഷേമ വകുപ്പ്",
    totalCentres: "ആകെ കേന്ദ്രങ്ങൾ",
    todayFarmers: "ഇന്നത്തെ കർഷകർ",
    completedProcurement: "സംഭരിച്ച അളവ്",
    totalPayout: "കർഷകർക്ക് നൽകിയ തുക (MSP)",
    bottleneckAlert: "തടസ്സ കണ്ടെത്തൽ മുന്നറിയിപ്പ് (Bottleneck)",
    demandForecast: "ഡിമാൻഡ് പ്രവചനം",
    downloadReport: "റിപ്പോർട്ട് ഡൗൺലോഡ് ചെയ്യുക (PDF/CSV)",
  },
  hi: {
    appName: "किसानक्यू (KisanQueue)",
    tagline: "किसानों के लिए पारदर्शी और त्वरित खरीद कतार प्रणाली",
    subTagline: "स्लॉट बुकिंग से लेकर बैंक भुगतान तक सहज डिजिटल अनुभव।",
    farmerApp: "किसान ऐप",
    staffDashboard: "केंद्र स्टाफ",
    adminDashboard: "सरकारी व्यवस्थापक",
    switchRole: "रोल बदलें",
    notifications: "सूचनाएं",
    smsAlerts: "एसएमएस अलर्ट",
    markAllRead: "सभी को पढ़ा हुआ चिह्नित करें",
    noNotifications: "कोई नई सूचना नहीं",

    // Navigation
    home: "होम",
    bookings: "बुकिंग",
    queue: "लाइव कतार",
    procurement: "खरीद",
    payments: "भुगतान",
    profile: "प्रोफ़ाइल",

    // Farmer Home
    goodMorning: "शुभ प्रभात, किसान साथी 👋",
    upcomingBooking: "आपकी अगली खरीद बुकिंग",
    liveStatus: "कतार लाइव सक्रिय",
    tokenNumber: "टोकन",
    nowServing: "वर्तमान सेवा टोकन",
    farmersAhead: "आगे कतार में किसान",
    estWait: "अनुमानित प्रतीक्षा समय",
    quickActions: "त्वरित सेवाएं",
    bookSlot: "स्लॉट बुक करें",
    liveQueue: "लाइव कतार देखें",
    myBookings: "मेरी बुकिंग्स",
    paymentStatus: "भुगतान स्थिति",
    assistedBooking: "सहायता प्राप्त बुकिंग",
    needHelp: "बुकिंग में मदद चाहिए? टोल-फ्री 1800-425-1661 पर कॉल करें।",

    // Smart Centre Recommendation
    recommendedCentre: "अनुशंसित केंद्र",
    recommendedReason: "सबसे कम कतार और त्वरित खरीद सुविधा",
    congestionLow: "कम भीड़",
    congestionMed: "मध्यम भीड़",
    congestionHigh: "अधिक भीड़",
    delayReported: "प्रक्रिया में विलंब",

    // Booking Flow
    stepCrop: "फसल चुनें",
    stepCentre: "खरीद केंद्र चुनें",
    stepDate: "तारीख चुनें",
    stepSlot: "समय स्लॉट चुनें",
    confirmBooking: "स्लॉट पक्का करें",
    slotAvailable: "उपलब्ध",
    slotAlmostFull: "तेजी से भर रहा है",
    slotFull: "फुल",

    // Live Queue
    queuePipeline: "लाइव कतार पाइपलाइन",
    yourToken: "आपका टोकन",
    approxTime: "अनुमानित समय",
    getDirections: "दिशा-निर्देश प्राप्त करें",
    rescheduleSlot: "समय बदलें",
    cancelSlot: "रद्द करें",

    // Staff
    todayBookings: "आज की कुल बुकिंग",
    waitingInYard: "कतार में प्रतीक्षारत",
    centreCapacity: "यार्ड क्षमता",
    avgProcessingTime: "औसत समय",
    callNext: "अगले किसान को बुलाएं",
    markArrived: "उपस्थित दर्ज करें",
    verifyFarmer: "सत्यापित एवं ग्रेडिंग करें",
    completeProcure: "खरीद पूर्ण करें",
    reportDelay: "विलंब दर्ज करें",
    clearDelay: "विलंब समाप्त",
    activeDelays: "सक्रिय विलंब",

    // Admin
    statewideOverview: "कृषि विभाग खरीद निगरानी निदेशालय",
    totalCentres: "कुल खरीद केंद्र",
    todayFarmers: "आज के कुल किसान",
    completedProcurement: "कुल खरीद मात्रा",
    totalPayout: "प्रत्यक्ष बैंक भुगतान (MSP)",
    bottleneckAlert: "रुकावट चेतावनी (Bottleneck)",
    demandForecast: "मांग पूर्वानुमान",
    downloadReport: "रिपोर्ट डाउनलोड करें (PDF/CSV)",
  },
} as const;

import { useKisanQueue } from "./store";

export function t(lang: Language, key: keyof typeof translations.en): string {
  return (translations[lang] as any)?.[key] ?? (translations.en as any)[key] ?? key;
}

export function useTranslation() {
  const { language } = useKisanQueue();
  return {
    t: (key: keyof typeof translations.en) => t(language, key),
    language,
  };
}

