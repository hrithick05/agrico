import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Cart item interfaces
export interface OrderCartItem {
  id: number;
  title: string;
  pricePerUnit: number;
  quantity: number;
  category: string;
  type: 'order';
}

export interface EquipmentCartItem {
  id: number;
  name: string;
  equipmentType: string;
  pricePerDay: number;
  quantity: number;
  category: 'equipment';
  type: 'equipment';
}

export type CartItem = OrderCartItem | EquipmentCartItem;

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, itemType: 'order' | 'equipment') => void;
  updateQuantity: (id: number, itemType: 'order' | 'equipment', quantity: number) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
  getCartTotal: () => number;
  getOrderItems: () => OrderCartItem[];
  getEquipmentItems: () => EquipmentCartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('agricultural-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('agricultural-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => 
        cartItem.id === item.id && cartItem.type === item.type
      );
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id && cartItem.type === item.type
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        return [...prevCart, item];
      }
    });
  };

  const removeFromCart = (id: number, itemType: 'order' | 'equipment') => {
    setCart(prevCart => 
      prevCart.filter(item => !(item.id === id && item.type === itemType))
    );
  };

  const updateQuantity = (id: number, itemType: 'order' | 'equipment', quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, itemType);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id && item.type === itemType
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      if (item.type === 'order') {
        return total + ((item.pricePerUnit || 0) * item.quantity);
      } else {
        return total + ((item.pricePerDay || 0) * item.quantity);
      }
    }, 0);
  };

  const getOrderItems = (): OrderCartItem[] => {
    return cart.filter((item): item is OrderCartItem => item.type === 'order');
  };

  const getEquipmentItems = (): EquipmentCartItem[] => {
    return cart.filter((item): item is EquipmentCartItem => item.type === 'equipment');
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    getCartTotal,
    getOrderItems,
    getEquipmentItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
