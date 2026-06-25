export type CropType =
  | "Rice"
  | "Corn"
  | "Vegetables"
  | "Fruits"
  | "Root Crops"
  | "Legumes";

export type Availability = "In Stock" | "Limited" | "Pre-order";

export interface Crop {
  id: string;
  name: string;
  type: CropType;
  quantity: string;
  price: number;
  unit: string;
  harvestDate: string;
  availability: Availability;
  farmer: string;
  location: string;
  image: string;
}

export const crops: Crop[] = [
  {
    id: "1",
    name: "Fresh White Rice",
    type: "Rice",
    quantity: "500 kg",
    price: 45,
    unit: "kg",
    harvestDate: "2026-06-20",
    availability: "In Stock",
    farmer: "Juan Dela Cruz",
    location: "Nueva Ecija",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
  },
  {
    id: "2",
    name: "Sweet Corn",
    type: "Corn",
    quantity: "200 kg",
    price: 35,
    unit: "kg",
    harvestDate: "2026-06-22",
    availability: "In Stock",
    farmer: "Maria Santos",
    location: "Pampanga",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400",
  },
  {
    id: "3",
    name: "Organic Tomatoes",
    type: "Vegetables",
    quantity: "50 kg",
    price: 80,
    unit: "kg",
    harvestDate: "2026-06-24",
    availability: "Limited",
    farmer: "Pedro Reyes",
    location: "Benguet",
    image: "https://images.unsplash.com/photo-1546470427-f22d2c7c2053?w=400",
  },
  {
    id: "4",
    name: "Ripe Mangoes",
    type: "Fruits",
    quantity: "100 kg",
    price: 120,
    unit: "kg",
    harvestDate: "2026-06-21",
    availability: "In Stock",
    farmer: "Ana Garcia",
    location: "Guimaras",
    image: "https://images.unsplash.com/photo-1534483509719-891398772614?w=400",
  },
  {
    id: "5",
    name: "Sweet Potatoes",
    type: "Root Crops",
    quantity: "150 kg",
    price: 55,
    unit: "kg",
    harvestDate: "2026-06-19",
    availability: "In Stock",
    farmer: "Carlos Mendoza",
    location: "Cagayan",
    image: "https://images.unsplash.com/photo-1596097635121-14b63a7e6e64?w=400",
  },
  {
    id: "6",
    name: "Green Mung Beans",
    type: "Legumes",
    quantity: "80 kg",
    price: 90,
    unit: "kg",
    harvestDate: "2026-06-18",
    availability: "Pre-order",
    farmer: "Rosa Lim",
    location: "Isabela",
    image: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400",
  },
  {
    id: "7",
    name: "Fresh Eggplant",
    type: "Vegetables",
    quantity: "70 kg",
    price: 60,
    unit: "kg",
    harvestDate: "2026-06-23",
    availability: "In Stock",
    farmer: "Jose Bautista",
    location: "Quezon",
    image: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400",
  },
  {
    id: "8",
    name: "Red Onions",
    type: "Root Crops",
    quantity: "120 kg",
    price: 65,
    unit: "kg",
    harvestDate: "2026-06-17",
    availability: "In Stock",
    farmer: "Elena Cruz",
    location: "Nueva Vizcaya",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400",
  },
  {
    id: "9",
    name: "Green Papaya",
    type: "Fruits",
    quantity: "90 kg",
    price: 40,
    unit: "kg",
    harvestDate: "2026-06-22",
    availability: "Limited",
    farmer: "Miguel Torres",
    location: "Davao",
    image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400",
  },
  {
    id: "10",
    name: "String Beans",
    type: "Vegetables",
    quantity: "60 kg",
    price: 50,
    unit: "kg",
    harvestDate: "2026-06-24",
    availability: "In Stock",
    farmer: "Liza Pascual",
    location: "Bukidnon",
    image: "https://images.unsplash.com/photo-1563746924237-f0e78b2fc57c?w=400",
  },
  {
    id: "11",
    name: "Jasmine Rice",
    type: "Rice",
    quantity: "300 kg",
    price: 55,
    unit: "kg",
    harvestDate: "2026-06-20",
    availability: "In Stock",
    farmer: "Antonio Ramos",
    location: "Tarlac",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
  },
  {
    id: "12",
    name: "Bananas",
    type: "Fruits",
    quantity: "200 kg",
    price: 30,
    unit: "kg",
    harvestDate: "2026-06-23",
    availability: "In Stock",
    farmer: "Grace Villanueva",
    location: "Laguna",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400",
  },
];

export const cropTypes: CropType[] = [
  "Rice",
  "Corn",
  "Vegetables",
  "Fruits",
  "Root Crops",
  "Legumes",
];
