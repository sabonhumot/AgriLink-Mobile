export type FarmerOrderStatus = "Pending" | "Accepted" | "Rejected" | "Delivered";

export interface FarmerOrderItem {
  cropId: string;
  cropName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
}

export interface FarmerOrder {
  id: string;
  buyerName: string;
  buyerLocation: string;
  items: FarmerOrderItem[];
  totalPrice: number;
  status: FarmerOrderStatus;
  date: string;
}

export interface FarmerNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Listing {
  id: string;
  name: string;
  type: string;
  quantity: string;
  price: number;
  unit: string;
  availability: "In Stock" | "Limited" | "Pre-order";
  harvestDate: string;
  image: string;
  totalSold: number;
}

export const mockFarmer = {
  name: "Juan Dela Cruz",
  email: "juan.delacruz@email.com",
  phone: "+63 918 765 4321",
  address: "Barangay San Isidro, Nueva Ecija",
  memberSince: "March 2026",
  farmSize: "3.5 hectares",
  cooperative: "Nueva Ecija Farmers Cooperative",
};

export const mockListings: Listing[] = [
  {
    id: "1",
    name: "Fresh White Rice",
    type: "Rice",
    quantity: "500 kg",
    price: 45,
    unit: "kg",
    availability: "In Stock",
    harvestDate: "2026-06-20",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    totalSold: 120,
  },
  {
    id: "11",
    name: "Jasmine Rice",
    type: "Rice",
    quantity: "300 kg",
    price: 55,
    unit: "kg",
    availability: "In Stock",
    harvestDate: "2026-06-20",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    totalSold: 85,
  },
  {
    id: "5",
    name: "Sweet Potatoes",
    type: "Root Crops",
    quantity: "150 kg",
    price: 55,
    unit: "kg",
    availability: "In Stock",
    harvestDate: "2026-06-19",
    image: "https://images.unsplash.com/photo-1596097635121-14b63a7e6e64?w=400",
    totalSold: 40,
  },
  {
    id: "8",
    name: "Red Onions",
    type: "Root Crops",
    quantity: "120 kg",
    price: 65,
    unit: "kg",
    availability: "Limited",
    harvestDate: "2026-06-17",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400",
    totalSold: 60,
  },
];

export const mockFarmerOrders: FarmerOrder[] = [
  {
    id: "ORD-001",
    buyerName: "Maria Santos",
    buyerLocation: "Makati City",
    items: [
      { cropId: "1", cropName: "Fresh White Rice", quantity: 50, unit: "kg", pricePerUnit: 45 },
    ],
    totalPrice: 2250,
    status: "Pending",
    date: "2026-06-24",
  },
  {
    id: "ORD-005",
    buyerName: "Pedro Reyes",
    buyerLocation: "Quezon City",
    items: [
      { cropId: "1", cropName: "Fresh White Rice", quantity: 30, unit: "kg", pricePerUnit: 45 },
      { cropId: "11", cropName: "Jasmine Rice", quantity: 20, unit: "kg", pricePerUnit: 55 },
    ],
    totalPrice: 2450,
    status: "Pending",
    date: "2026-06-23",
  },
  {
    id: "ORD-002",
    buyerName: "Ana Garcia",
    buyerLocation: "Manila",
    items: [
      { cropId: "5", cropName: "Sweet Potatoes", quantity: 25, unit: "kg", pricePerUnit: 55 },
    ],
    totalPrice: 1375,
    status: "Accepted",
    date: "2026-06-21",
  },
  {
    id: "ORD-006",
    buyerName: "Grace Lim",
    buyerLocation: "Pasig City",
    items: [
      { cropId: "8", cropName: "Red Onions", quantity: 40, unit: "kg", pricePerUnit: 65 },
    ],
    totalPrice: 2600,
    status: "Delivered",
    date: "2026-06-18",
  },
  {
    id: "ORD-007",
    buyerName: "Carlos Tan",
    buyerLocation: "Cebu City",
    items: [
      { cropId: "11", cropName: "Jasmine Rice", quantity: 60, unit: "kg", pricePerUnit: 55 },
    ],
    totalPrice: 3300,
    status: "Rejected",
    date: "2026-06-15",
  },
];

export const mockFarmerNotifications: FarmerNotification[] = [
  {
    id: "fn1",
    title: "New Order Received",
    message: "Maria Santos placed an order for Fresh White Rice (50 kg).",
    date: "2026-06-24",
    read: false,
  },
  {
    id: "fn2",
    title: "New Order Received",
    message: "Pedro Reyes placed an order for Rice varieties (50 kg total).",
    date: "2026-06-23",
    read: false,
  },
  {
    id: "fn3",
    title: "Order Delivered",
    message: "Order ORD-006 has been marked as delivered.",
    date: "2026-06-19",
    read: true,
  },
  {
    id: "fn4",
    title: "Cooperative Meeting",
    message: "Monthly cooperative meeting scheduled for June 30, 2026.",
    date: "2026-06-20",
    read: true,
  },
  {
    id: "fn5",
    title: "Price Update",
    message: "Rice prices in Nueva Ecija have increased by 5% this week.",
    date: "2026-06-18",
    read: true,
  },
];
