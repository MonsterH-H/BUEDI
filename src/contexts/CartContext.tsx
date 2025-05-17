import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
  seller: string;
  stock: number;
  category: string;
  description?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  total: number;
  itemCount: number;
  deliveryFee: number;
  setDeliveryMethod: (method: 'standard' | 'express') => void;
  deliveryMethod: 'standard' | 'express';
  applyPromoCode: (code: string) => void;
  discount: number;
  promoCode: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Charger le panier depuis le localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    }
  }, []);

  // Sauvegarder le panier dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.id === item.id);
      
      if (existingItem) {
        if (existingItem.quantity + 1 > item.stock) {
          toast.error(`Stock insuffisant. Maximum disponible: ${item.stock}`);
          return currentItems;
        }
        
        return currentItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      
      return [...currentItems, { ...item, quantity: 1 }];
    });
    
    toast.success(`${item.name} ajouté au panier`);
  };

  const removeItem = (id: number) => {
    setItems(currentItems => {
      const item = currentItems.find(i => i.id === id);
      if (item) {
        toast.success(`${item.name} retiré du panier`);
      }
      return currentItems.filter(i => i.id !== id);
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    setItems(currentItems => {
      const item = currentItems.find(i => i.id === id);
      if (!item) return currentItems;

      if (quantity > item.stock) {
        toast.error(`Stock insuffisant. Maximum disponible: ${item.stock}`);
        return currentItems;
      }

      if (quantity < 1) {
        removeItem(id);
        return currentItems.filter(i => i.id !== id);
      }

      return currentItems.map(i =>
        i.id === id ? { ...i, quantity } : i
      );
    });
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
    setDiscount(0);
    toast.success('Panier vidé');
  };

  const applyPromoCode = (code: string) => {
    // Simuler la validation d'un code promo
    const validCodes: { [key: string]: number } = {
      'WELCOME10': 10,
      'SUMMER20': 20,
      'SPECIAL15': 15
    };

    if (validCodes[code]) {
      setPromoCode(code);
      setDiscount(validCodes[code]);
      toast.success(`Code promo appliqué: ${validCodes[code]}% de réduction`);
    } else {
      toast.error('Code promo invalide');
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryMethod === 'express' ? 5000 : 2000;
  const total = subtotal + deliveryFee - (subtotal * (discount / 100));
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      total,
      itemCount,
      deliveryFee,
      setDeliveryMethod,
      deliveryMethod,
      applyPromoCode,
      discount,
      promoCode
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart doit être utilisé à l\'intérieur d\'un CartProvider');
  }
  return context;
}; 