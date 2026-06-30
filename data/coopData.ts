export interface CoopMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  farmSize: string;
  address: string;
  barangay: string;
  joinDate: string;
  activeListings: number;
  totalTransactions: number;
  status: "active" | "inactive";
}

export interface CoopTransaction {
  id: string;
  buyerName: string;
  farmerName: string;
  crop: string;
  quantity: string;
  totalAmount: number;
  date: string;
  status: "completed" | "pending" | "cancelled";
}

export interface CoopNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: "alert" | "info" | "success";
}

export const mockCoopProfile = {
  name: "Nueva Ecija Farmers Cooperative",
  address: "Barangay San Isidro, Cabanatuan City, Nueva Ecija",
  phone: "+63 44 123 4567",
  email: "info@nefc.coop",
  foundingDate: "March 2018",
  memberCount: 24,
  totalFarmArea: "45.5 hectares",
};

export const mockCoopMembers: CoopMember[] = [
  { id: "cm1", name: "Juan Dela Cruz", email: "juan@email.com", phone: "+63 918 765 4321", farmSize: "3.5 ha", address: "Brgy. San Isidro", barangay: "San Isidro", joinDate: "2024-01-15", activeListings: 4, totalTransactions: 28, status: "active" },
  { id: "cm2", name: "Maria Santos", email: "maria@email.com", phone: "+63 917 654 3210", farmSize: "2.0 ha", address: "Brgy. San Juan", barangay: "San Juan", joinDate: "2024-02-20", activeListings: 2, totalTransactions: 15, status: "active" },
  { id: "cm3", name: "Pedro Reyes", email: "pedro@email.com", phone: "+63 916 543 2109", farmSize: "4.0 ha", address: "Brgy. Mabuhay", barangay: "Mabuhay", joinDate: "2024-03-10", activeListings: 5, totalTransactions: 42, status: "active" },
  { id: "cm4", name: "Ana Garcia", email: "ana@email.com", phone: "+63 915 432 1098", farmSize: "1.5 ha", address: "Brgy. Maligaya", barangay: "Maligaya", joinDate: "2024-04-05", activeListings: 1, totalTransactions: 9, status: "inactive" },
  { id: "cm5", name: "Carlos Mendoza", email: "carlos@email.com", phone: "+63 914 321 0987", farmSize: "5.0 ha", address: "Brgy. San Isidro", barangay: "San Isidro", joinDate: "2024-01-25", activeListings: 3, totalTransactions: 35, status: "active" },
  { id: "cm6", name: "Rosa Lim", email: "rosa@email.com", phone: "+63 913 210 9876", farmSize: "2.5 ha", address: "Brgy. Nueva", barangay: "Nueva", joinDate: "2024-05-12", activeListings: 2, totalTransactions: 11, status: "active" },
  { id: "cm7", name: "Jose Bautista", email: "jose@email.com", phone: "+63 912 109 8765", farmSize: "3.0 ha", address: "Brgy. San Juan", barangay: "San Juan", joinDate: "2024-06-01", activeListings: 3, totalTransactions: 19, status: "active" },
];

export const mockCoopTransactions: CoopTransaction[] = [
  { id: "trx-001", buyerName: "Ramon Lopez", farmerName: "Juan Dela Cruz", crop: "Fresh White Rice", quantity: "50 kg", totalAmount: 2250, date: "2026-06-15", status: "completed" },
  { id: "trx-002", buyerName: "Sofia Martinez", farmerName: "Maria Santos", crop: "Sweet Corn", quantity: "20 kg", totalAmount: 700, date: "2026-06-15", status: "completed" },
  { id: "trx-003", buyerName: "Benito Reyes", farmerName: "Pedro Reyes", crop: "Organic Tomatoes", quantity: "10 kg", totalAmount: 800, date: "2026-06-14", status: "completed" },
  { id: "trx-004", buyerName: "Luzviminda Cruz", farmerName: "Carlos Mendoza", crop: "Sweet Potatoes", quantity: "25 kg", totalAmount: 1375, date: "2026-06-14", status: "pending" },
  { id: "trx-005", buyerName: "Fernando Tan", farmerName: "Rosa Lim", crop: "Green Mung Beans", quantity: "15 kg", totalAmount: 1350, date: "2026-06-13", status: "completed" },
  { id: "trx-006", buyerName: "Elena Santos", farmerName: "Jose Bautista", crop: "Fresh Eggplant", quantity: "8 kg", totalAmount: 480, date: "2026-06-13", status: "cancelled" },
  { id: "trx-007", buyerName: "Gregorio Villar", farmerName: "Juan Dela Cruz", crop: "Jasmine Rice", quantity: "30 kg", totalAmount: 1650, date: "2026-06-12", status: "completed" },
  { id: "trx-008", buyerName: "Nena Santiago", farmerName: "Pedro Reyes", crop: "Red Onions", quantity: "12 kg", totalAmount: 780, date: "2026-06-12", status: "pending" },
];

export const mockCoopNotifications: CoopNotification[] = [
  { id: "cn1", title: "New Member Request", message: "A farmer (Leonardo Cruz) has requested to join your cooperative.", date: "2026-06-15", read: false, type: "alert" },
  { id: "cn2", title: "Transaction Completed", message: "Transaction trx-001 has been completed successfully.", date: "2026-06-15", read: false, type: "success" },
  { id: "cn3", title: "Member Inactive", message: "Ana Garcia has been inactive for 30 days.", date: "2026-06-14", read: false, type: "alert" },
  { id: "cn4", title: "Market Day Reminder", message: "Upcoming market day at Cabanatuan Public Market this Saturday.", date: "2026-06-13", read: true, type: "info" },
  { id: "cn5", title: "Monthly Report Ready", message: "May 2026 cooperative performance report is now available.", date: "2026-06-10", read: true, type: "info" },
];
