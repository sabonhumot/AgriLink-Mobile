import { createContext, useContext, useState, ReactNode } from "react";
import { Crop } from "@/data/crops";

export interface ReservationItem {
  crop: Crop;
  quantity: number;
}

interface ReservationContextType {
  items: ReservationItem[];
  reserve: (crop: Crop, quantity: number) => void;
  removeItem: (cropId: string) => void;
  updateQuantity: (cropId: string, quantity: number) => void;
  clearReservations: () => void;
  totalItems: number;
  totalPrice: number;
}

const ReservationContext = createContext<ReservationContextType>({
  items: [],
  reserve: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearReservations: () => {},
  totalItems: 0,
  totalPrice: 0,
});

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ReservationItem[]>([]);

  const reserve = (crop: Crop, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.crop.id === crop.id);
      if (existing) {
        return prev.map((i) =>
          i.crop.id === crop.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { crop, quantity }];
    });
  };

  const removeItem = (cropId: string) => {
    setItems((prev) => prev.filter((i) => i.crop.id !== cropId));
  };

  const updateQuantity = (cropId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cropId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.crop.id === cropId ? { ...i, quantity } : i))
    );
  };

  const clearReservations = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.crop.price * i.quantity, 0);

  return (
    <ReservationContext.Provider
      value={{ items, reserve, removeItem, updateQuantity, clearReservations, totalItems, totalPrice }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

export const useReservation = () => useContext(ReservationContext);
