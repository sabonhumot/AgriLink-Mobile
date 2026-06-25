export type OrderStatus = "Pending" | "Accepted" | "Rejected" | "Delivered";

export interface OrderItem {
  cropId: string;
  cropName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  date: string;
  farmer: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  orderId?: string;
}

export const mockBuyer = {
  name: "Maria Santos",
  email: "maria.santos@email.com",
  phone: "+63 917 123 4567",
  address: "123 Rizal Avenue, Makati City",
  memberSince: "January 2026",
};

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    items: [
      { cropId: "1", cropName: "Fresh White Rice", quantity: 50, unit: "kg", pricePerUnit: 45 },
      { cropId: "3", cropName: "Organic Tomatoes", quantity: 10, unit: "kg", pricePerUnit: 80 },
    ],
    totalPrice: 3050,
    status: "Delivered",
    date: "2026-06-15",
    farmer: "Juan Dela Cruz",
  },
  {
    id: "ORD-002",
    items: [
      { cropId: "4", cropName: "Ripe Mangoes", quantity: 20, unit: "kg", pricePerUnit: 120 },
    ],
    totalPrice: 2400,
    status: "Accepted",
    date: "2026-06-20",
    farmer: "Ana Garcia",
  },
  {
    id: "ORD-003",
    items: [
      { cropId: "2", cropName: "Sweet Corn", quantity: 30, unit: "kg", pricePerUnit: 35 },
      { cropId: "7", cropName: "Fresh Eggplant", quantity: 15, unit: "kg", pricePerUnit: 60 },
    ],
    totalPrice: 1950,
    status: "Pending",
    date: "2026-06-24",
    farmer: "Pedro Reyes",
  },
  {
    id: "ORD-004",
    items: [
      { cropId: "8", cropName: "Red Onions", quantity: 25, unit: "kg", pricePerUnit: 65 },
    ],
    totalPrice: 1625,
    status: "Rejected",
    date: "2026-06-22",
    farmer: "Elena Cruz",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "Order Accepted",
    message: "Your order ORD-002 has been accepted by Ana Garcia.",
    date: "2026-06-21",
    read: false,
    orderId: "ORD-002",
  },
  {
    id: "n2",
    title: "Order Delivered",
    message: "Your order ORD-001 has been delivered. Thank you!",
    date: "2026-06-18",
    read: true,
    orderId: "ORD-001",
  },
  {
    id: "n3",
    title: "Order Rejected",
    message: "Your order ORD-004 was rejected. Please contact the farmer.",
    date: "2026-06-23",
    read: false,
    orderId: "ORD-004",
  },
  {
    id: "n4",
    title: "New Crops Available",
    message: "Fresh Organic Tomatoes are now available from Benguet farmers.",
    date: "2026-06-24",
    read: true,
  },
];
