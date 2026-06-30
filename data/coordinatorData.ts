export interface PendingFarmer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cooperative: string;
  cooperativeId: string;
  farmSize: string;
  address: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected";
  documents: { name: string; uploaded: boolean }[];
  rejectionReason?: string;
}

export interface EscalatedChat {
  id: string;
  farmerId: string;
  farmer: string;
  buyerId: string;
  buyer: string;
  issue: string;
  date: string;
  priority: "high" | "medium" | "low";
  status: "open" | "resolved";
  lastMessage: string;
  lastMessageTime: string;
  escalatedAt: string;
  triggerReason: "no_response_6h" | "no_response_1h_market_day" | "buyer_complaint";
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "farmer" | "buyer" | "coordinator";
  text: string;
  timestamp: string;
  isInternalNote?: boolean;
}

export interface SystemActivity {
  id: string;
  action: string;
  user: string;
  role: string;
  date: string;
  detail: string;
}

export interface MarketEvent {
  id: string;
  name: string;
  type: "Regular Market Day" | "Special Event" | "Pop-Up Market";
  location: string;
  date: string;
  time: string;
  description: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  farmerCount: number;
  mapPin: { lat: number; lng: number };
}

export interface FarmerMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  cooperative: string;
  farmSize: string;
  address: string;
  status: "active" | "inactive" | "suspended";
  memberSince: string;
  activeListings: number;
  totalTransactions: number;
}

export interface CropInfoEntry {
  id: string;
  name: string;
  description: string;
  commonUses: string;
  harvestSeason: string;
  nutritionalValue: string;
  tags: string[];
  status: "draft" | "published";
  createdAt: string;
  aiDraft?: string;
}

export const mockCoordinator = {
  name: "Atty. Robert Lim",
  email: "robert.lim@agrilink.ph",
  cooperative: "Benguet Farmers Cooperative",
};

export const mockPendingFarmers: PendingFarmer[] = [
  {
    id: "pf1", name: "Benito Reyes", email: "benito.reyes@email.com", phone: "+63 912 345 6789",
    cooperative: "Benguet Farmers Cooperative", cooperativeId: "BFC-2026-0042", farmSize: "2.5 ha",
    address: "BarangayAmbiong, La Trinidad, Benguet", submittedDate: "2026-06-25", status: "pending",
    documents: [{ name: "Cooperative Membership ID", uploaded: true }, { name: "Barangay Clearance", uploaded: true }],
  },
  {
    id: "pf2", name: "Luzviminda Cruz", email: "luz.cruz@email.com", phone: "+63 917 890 1234",
    cooperative: "Nueva Ecija Rice Growers", cooperativeId: "NERG-2026-0117", farmSize: "4.0 ha",
    address: "Barangay San Ricardo, Cabanatuan City", submittedDate: "2026-06-24", status: "pending",
    documents: [{ name: "Cooperative Membership ID", uploaded: true }, { name: "Proof of Land Ownership", uploaded: true }],
  },
  {
    id: "pf3", name: "Ramon Diaz", email: "ramon.diaz@email.com", phone: "+63 908 765 4321",
    cooperative: "Pampanga Corn Producers", cooperativeId: "PCP-2026-0083", farmSize: "3.0 ha",
    address: "Barangay San Matias, San Fernando, Pampanga", submittedDate: "2026-06-23", status: "pending",
    documents: [{ name: "Cooperative Membership ID", uploaded: true }, { name: "Barangay Clearance", uploaded: true }],
  },
  {
    id: "pf4", name: "Cecilia Tan", email: "cecilia.tan@email.com", phone: "+63 915 234 5678",
    cooperative: "Bukidnon Vegetable Farmers", cooperativeId: "BVF-2026-0056", farmSize: "1.8 ha",
    address: "Barangay Kisolon, Sumilao, Bukidnon", submittedDate: "2026-06-22", status: "pending",
    documents: [{ name: "Cooperative Membership ID", uploaded: true }, { name: "Supporting Document", uploaded: false }],
  },
  {
    id: "pf5", name: "Felipe Gonzales", email: "felipe.g@email.com", phone: "+63 920 111 2222",
    cooperative: "Davao Fruit Growers", cooperativeId: "DFG-2026-0031", farmSize: "5.0 ha",
    address: "Barangay Malagos, Davao City", submittedDate: "2026-06-20", status: "approved",
    documents: [{ name: "Cooperative Membership ID", uploaded: true }, { name: "Barangay Clearance", uploaded: true }],
  },
];

export const mockEscalatedChats: EscalatedChat[] = [
  {
    id: "e1", farmerId: "f1", farmer: "Juan Dela Cruz", buyerId: "b1", buyer: "Maria Santos",
    issue: "Price dispute on Fresh White Rice — buyer claims pre-order price was lower than listed",
    date: "2026-06-26", priority: "high", status: "open",
    lastMessage: "I clearly said the price would be 45/kg upon delivery.",
    lastMessageTime: "2026-06-26 09:15 AM", escalatedAt: "2026-06-26 10:00 AM",
    triggerReason: "no_response_6h",
  },
  {
    id: "e2", farmerId: "f3", farmer: "Pedro Reyes", buyerId: "b3", buyer: "Jose Bautista",
    issue: "Delivery delay — Organic Tomatoes not delivered on agreed date",
    date: "2026-06-25", priority: "medium", status: "open",
    lastMessage: "I need the tomatoes today for my restaurant.",
    lastMessageTime: "2026-06-25 02:30 PM", escalatedAt: "2026-06-25 03:00 PM",
    triggerReason: "no_response_1h_market_day",
  },
  {
    id: "e3", farmerId: "f4", farmer: "Ana Garcia", buyerId: "b4", buyer: "Luisa Martinez",
    issue: "Quality concern — Ripe Mangoes arrived with bruises",
    date: "2026-06-24", priority: "high", status: "open",
    lastMessage: "Half of the mangoes were damaged. I want a refund.",
    lastMessageTime: "2026-06-24 04:20 PM", escalatedAt: "2026-06-24 04:45 PM",
    triggerReason: "buyer_complaint",
  },
];

export const mockChatMessages: Record<string, ChatMessage[]> = {
  e1: [
    { id: "m1", senderId: "b1", senderName: "Maria Santos", senderRole: "buyer", text: "Hi Juan, I'd like to order 50kg of Fresh White Rice at 40/kg as we discussed last week.", timestamp: "2026-06-24 08:00 AM" },
    { id: "m2", senderId: "f1", senderName: "Juan Dela Cruz", senderRole: "farmer", text: "Good day Maria! The price is 45/kg as listed. I don't recall discussing 40/kg.", timestamp: "2026-06-24 08:30 AM" },
    { id: "m3", senderId: "b1", senderName: "Maria Santos", senderRole: "buyer", text: "But you said 40/kg during the market day last week. I have it in my notes.", timestamp: "2026-06-24 09:00 AM" },
    { id: "m4", senderId: "b1", senderName: "Maria Santos", senderRole: "buyer", text: "Juan? Are you there?", timestamp: "2026-06-25 10:00 AM" },
    { id: "m5", senderId: "b1", senderName: "Maria Santos", senderRole: "buyer", text: "I clearly said the price would be 45/kg upon delivery.", timestamp: "2026-06-26 09:15 AM" },
  ],
  e2: [
    { id: "m6", senderId: "b3", senderName: "Jose Bautista", senderRole: "buyer", text: "Pedro, it's market day and my tomatoes haven't arrived.", timestamp: "2026-06-25 01:00 PM" },
    { id: "m7", senderId: "b3", senderName: "Jose Bautista", senderRole: "buyer", text: "I need the tomatoes today for my restaurant. Please respond.", timestamp: "2026-06-25 02:30 PM" },
  ],
  e3: [
    { id: "m8", senderId: "b4", senderName: "Luisa Martinez", senderRole: "buyer", text: "Ana, the mangoes arrived but many are bruised. This is not the quality I expected.", timestamp: "2026-06-24 03:00 PM" },
    { id: "m9", senderId: "f4", senderName: "Ana Garcia", senderRole: "farmer", text: "I'm sorry about that. They were in good condition when I packed them. Let me check with my harvester.", timestamp: "2026-06-24 03:30 PM" },
    { id: "m10", senderId: "b4", senderName: "Luisa Martinez", senderRole: "buyer", text: "Half of the mangoes were damaged. I want a refund.", timestamp: "2026-06-24 04:20 PM" },
  ],
};

export const mockSystemActivities: SystemActivity[] = [
  { id: "s1", action: "Farmer Registered", user: "Benito Reyes", role: "Farmer", date: "2026-06-25 09:32 AM", detail: "Pending coordinator approval" },
  { id: "s2", action: "Crop Listed", user: "Juan Dela Cruz", role: "Farmer", date: "2026-06-25 08:15 AM", detail: "Fresh White Rice — 500 kg" },
  { id: "s3", action: "New Escalation", user: "Maria Santos", role: "Buyer", date: "2026-06-24 04:20 PM", detail: "Price dispute escalated to coordinator" },
  { id: "s4", action: "Order Reserved", user: "Ana Garcia", role: "Farmer", date: "2026-06-24 02:10 PM", detail: "Ripe Mangoes reserved by Luisa Martinez" },
  { id: "s5", action: "Farmer Approved", user: "Felipe Gonzales", role: "Coordinator", date: "2026-06-23 11:00 AM", detail: "Membership approved — Davao Fruit Growers" },
  { id: "s6", action: "Transaction Completed", user: "Pedro Reyes", role: "Farmer", date: "2026-06-23 10:30 AM", detail: "Sweet Corn — 30 kg delivered" },
  { id: "s7", action: "Event Created", user: "Atty. Robert Lim", role: "Coordinator", date: "2026-06-22 02:00 PM", detail: "Benguet Farmers Market Day — July 4, 2026" },
  { id: "s8", action: "Crop Info Published", user: "Atty. Robert Lim", role: "Coordinator", date: "2026-06-21 11:30 AM", detail: "Rice — nutritional info published" },
];

export const mockMarketEvents: MarketEvent[] = [
  {
    id: "me1", name: "Benguet Farmers Market Day", type: "Regular Market Day",
    location: "La Trinidad Municipal Plaza, Benguet", date: "2026-07-04", time: "06:00 AM - 12:00 PM",
    description: "Weekly market day featuring fresh produce from Benguet farmers. Special focus on organic vegetables this month.",
    status: "upcoming", farmerCount: 24,
    mapPin: { lat: 16.4556, lng: 120.5878 },
  },
  {
    id: "me2", name: "Cooperative Store Opening", type: "Special Event",
    location: "Nueva Ecija AgriHub, Cabanatuan City", date: "2026-07-12", time: "08:00 AM - 05:00 PM",
    description: "Grand opening of the cooperative store with discounted rates for members. Free tasting booths available.",
    status: "upcoming", farmerCount: 15,
    mapPin: { lat: 15.4867, lng: 120.9678 },
  },
  {
    id: "me3", name: "Emergency Vegetable Distribution", type: "Pop-Up Market",
    location: "Barangay Hall Parking Lot, San Fernando", date: "2026-06-28", time: "07:00 AM - 11:00 AM",
    description: "Pop-up market to address vegetable shortage in the area. Direct from farmers.",
    status: "upcoming", farmerCount: 8,
    mapPin: { lat: 15.0286, lng: 120.6922 },
  },
  {
    id: "me4", name: "June Regular Market Day", type: "Regular Market Day",
    location: "La Trinidad Municipal Plaza, Benguet", date: "2026-06-20", time: "06:00 AM - 12:00 PM",
    description: "Weekly market day. Record turnout of 28 farmers.",
    status: "completed", farmerCount: 28,
    mapPin: { lat: 16.4556, lng: 120.5878 },
  },
];

export const mockFarmerMembers: FarmerMember[] = [
  { id: "fm1", name: "Juan Dela Cruz", email: "juan.delacruz@email.com", phone: "+63 918 765 4321", cooperative: "Nueva Ecija Farmers Cooperative", farmSize: "3.5 ha", address: "Barangay San Isidro, Nueva Ecija", status: "active", memberSince: "March 2026", activeListings: 2, totalTransactions: 18 },
  { id: "fm2", name: "Ana Garcia", email: "ana.garcia@email.com", phone: "+63 917 654 3210", cooperative: "Guimaras Mango Growers", farmSize: "2.0 ha", address: "Barangay San Miguel, Guimaras", status: "active", memberSince: "April 2026", activeListings: 1, totalTransactions: 9 },
  { id: "fm3", name: "Pedro Reyes", email: "pedro.reyes@email.com", phone: "+63 916 543 2109", cooperative: "Benguet Vegetable Farmers", farmSize: "1.2 ha", address: "Barangay Balili, La Trinidad, Benguet", status: "active", memberSince: "February 2026", activeListings: 1, totalTransactions: 14 },
  { id: "fm4", name: "Elena Cruz", email: "elena.cruz@email.com", phone: "+63 915 432 1098", cooperative: "Nueva Vizcaya Onion Producers", farmSize: "4.0 ha", address: "Barangay Malasin, Nueva Vizcaya", status: "active", memberSince: "January 2026", activeListings: 0, totalTransactions: 25 },
  { id: "fm5", name: "Benito Reyes", email: "benito.reyes@email.com", phone: "+63 912 345 6789", cooperative: "Benguet Farmers Cooperative", farmSize: "2.5 ha", address: "Barangay Ambiong, La Trinidad, Benguet", status: "suspended", memberSince: "June 2026", activeListings: 0, totalTransactions: 0 },
  { id: "fm6", name: "Carlos Mendoza", email: "carlos.m@email.com", phone: "+63 914 321 0987", cooperative: "Cagayan Root Crop Association", farmSize: "5.0 ha", address: "Barangay San Juan, Cagayan", status: "active", memberSince: "May 2026", activeListings: 1, totalTransactions: 7 },
  { id: "fm7", name: "Luzviminda Cruz", email: "luz.cruz@email.com", phone: "+63 917 890 1234", cooperative: "Nueva Ecija Rice Growers", farmSize: "4.0 ha", address: "Barangay San Ricardo, Cabanatuan City", status: "inactive", memberSince: "June 2026", activeListings: 0, totalTransactions: 0 },
];

export const mockCropInfoEntries: CropInfoEntry[] = [
  {
    id: "ci1", name: "Rice", description: "Rice is a staple food crop in the Philippines, cultivated across all regions. It is the primary source of carbohydrates for the majority of the population.", commonUses: "Cooked as steamed rice for daily meals; used in rice-based dishes such as sinangag (garlic rice), bibingka (rice cakes), and palitaw.", harvestSeason: "June to July (wet season) and December to January (dry season) in most lowland areas.", nutritionalValue: "High in carbohydrates (80%), provides energy, contains B vitamins (thiamine, niacin), iron, and small amounts of protein and fiber.", tags: ["Staple", "Grains", "Carbohydrates"], status: "published", createdAt: "2026-06-15", aiDraft: "Rice (Oryza sativa) is a cereal grain and the most widely consumed staple food in the Philippines..." },
  {
    id: "ci2", name: "Mango", description: "The Philippine mango is known as one of the sweetest mangoes in the world. The Carabao variety is the most popular.", commonUses: "Eaten fresh as ripe fruit; used in desserts like mango float, ice cream, and smoothies; green mangoes are eaten with bagoong (shrimp paste).", harvestSeason: "March to June (peak season in most regions)", nutritionalValue: "Rich in Vitamin C (67% DV), Vitamin A, folate, copper, and fiber. Contains antioxidants like beta-carotene and polyphenols.", tags: ["Fruits", "Vitamin C", "Desserts"], status: "published", createdAt: "2026-06-10" },
  {
    id: "ci3", name: "Tomato", description: "Tomatoes are widely grown across the Philippines, particularly in Benguet and Bukidnon. Both the red ripe and green varieties are used in Filipino cooking.", commonUses: "Used in sawsawan (dipping sauces), sinigang, and as a base for many stews and sauces. Fresh tomatoes are also used in salads.", harvestSeason: "Year-round in highland areas, peak from December to May", nutritionalValue: "Excellent source of lycopene (antioxidant), Vitamin C (28% DV), potassium, Vitamin K, and folate.", tags: ["Vegetables", "Vitamin C", "Cooking Essential"], status: "draft", createdAt: "2026-06-20", aiDraft: "The tomato (Solanum lycopersicum) is an edible berry of the nightshade family, widely cultivated in the Philippines..." },
];
