import { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantidade'> & { quantidade?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantidade: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (newItem: Omit<CartItem, 'quantidade'> & { quantidade?: number }) => {
    const quantidade = newItem.quantidade || 1;
    
    setItems(current => {
      const existingItem = current.find(item => item.id_produto === newItem.id_produto);
      
      if (existingItem) {
        return current.map(item =>
          item.id_produto === newItem.id_produto
            ? { ...item, quantidade: Math.min(item.quantidade + quantidade, item.quantidade_estoque) }
            : item
        );
      }
      
      return [...current, { ...newItem, quantidade }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(current => current.filter(item => item.id_produto !== productId));
  };

  const updateQuantity = (productId: string, quantidade: number) => {
    if (quantidade <= 0) {
      removeItem(productId);
      return;
    }

    setItems(current =>
      current.map(item =>
        item.id_produto === productId
          ? { ...item, quantidade: Math.min(quantidade, item.quantidade_estoque) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantidade, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}