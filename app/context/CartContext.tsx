"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
  id: string;
  variantId: string;
  title: string;
  price: string;
  quantity: number;
  image: string;
  handle: string;
}

interface CartContextType {
  cart: CartItem[];
  cartId: string | null;
  addToCart: (item: Omit<CartItem, "id">) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  getCartTotal: () => number;
  cartCount: number;
  checkoutUrl: string | null;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedCartId = localStorage.getItem("shopify_cart_id");
    if (savedCartId) {
      setCartId(savedCartId);
      fetchCart(savedCartId);
    }
  }, []);

  const createCart = async () => {
    const response = await fetch("/api/cart/create", { method: "POST" });
    const data = await response.json();
    setCartId(data.cartId);
    setCheckoutUrl(data.checkoutUrl);
    localStorage.setItem("shopify_cart_id", data.cartId);
    return data.cartId;
  };

  const fetchCart = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/cart?cartId=${id}`);
      const data = await response.json();
      setCart(data.items || []);
      setCheckoutUrl(data.checkoutUrl);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (item: Omit<CartItem, "id">) => {
    setIsLoading(true);
    try {
      let currentCartId = cartId;
      if (!currentCartId) {
        currentCartId = await createCart();
      }

      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: currentCartId,
          variantId: item.variantId,
          quantity: item.quantity,
        }),
      });

      const data = await response.json();
      setCart(data.items);
      setCheckoutUrl(data.checkoutUrl);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (lineId: string) => {
    if (!cartId) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, lineId }),
      });
      const data = await response.json();
      setCart(data.items);
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cartId) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, lineId, quantity }),
      });
      const data = await response.json();
      setCart(data.items);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        cartCount,
        checkoutUrl,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}