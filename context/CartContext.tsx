import { createContext, useContext, useState, ReactNode } from "react";
import { Crop } from "@/data/crops";

export interface CartItem {
  crop: Crop;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (crop: Crop, quantity: number) => void;
  removeItem: (cropId: string) => void;
  updateQuantity: (cropId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (crop: Crop, quantity: number) => {
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

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.crop.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
