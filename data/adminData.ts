export interface SystemLog {
  id: string;
  action: string;
  user: string;
  role: string;
  date: string;
  detail: string;
  type: "info" | "warning" | "error";
}

export interface UserStats {
  total: number;
  buyers: number;
  farmers: number;
  cooperatives: number;
  coordinators: number;
  admins: number;
}

export const mockAdmin = {
  name: "Admin User",
  email: "admin@agrilink.ph",
};

export const mockUserStats: UserStats = {
  total: 1248,
  buyers: 892,
  farmers: 286,
  cooperatives: 42,
  coordinators: 18,
  admins: 10,
};

export const mockSystemOverview = {
  totalActiveListings: 198,
  totalCompletedTransactions: 3402,
  pendingReports: 7,
  flaggedAccounts: 12,
};

export const mockSystemLogs: SystemLog[] = [
  { id: "l1", action: "User Account Flagged", user: "John Smith", role: "Buyer", date: "2026-06-26 10:15 AM", detail: "Multiple cancelled orders — account flagged for review", type: "warning" },
  { id: "l2", action: "System Backup", user: "System", role: "System", date: "2026-06-26 03:00 AM", detail: "Daily backup completed successfully. 1.2 GB", type: "info" },
  { id: "l3", action: "New Report Filed", user: "Maria Santos", role: "Buyer", date: "2026-06-25 08:45 PM", detail: "Reported farmer for non-delivery of pre-ordered crops", type: "warning" },
  { id: "l4", action: "Coordinator Assigned", user: "Atty. Robert Lim", role: "Admin", date: "2026-06-25 02:30 PM", detail: "Assigned as coordinator for Benguet Farmers Cooperative", type: "info" },
  { id: "l5", action: "Database Error", user: "System", role: "System", date: "2026-06-24 11:20 PM", detail: "Connection timeout on analytics query — retry succeeded", type: "error" },
  { id: "l6", action: "New User Registration Spike", user: "System", role: "System", date: "2026-06-24 09:00 AM", detail: "47 new registrations in the last hour — unusually high traffic", type: "info" },
  { id: "l7", action: "Payment Gateway Sync", user: "System", role: "System", date: "2026-06-23 06:00 PM", detail: "Manual sync triggered for 12 pending transaction records", type: "info" },
  { id: "l8", action: "Account Suspended", user: "Admin User", role: "Admin", date: "2026-06-23 03:15 PM", detail: "Suspended farmer account for repeated listing violations", type: "error" },
];
