"use client";

import { useCart } from "../context/CartContext";
import Image from "next/image";

export default function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { cart, removeFromCart, updateQuantity, getCartTotal, checkoutUrl, isLoading } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={onClose} aria-hidden="true" />
      <div className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart">
        <div className="cart-header">
          <h2>Cart ({cart.length})</h2>
          <button onClick={onClose} className="cart-close" aria-label="Close cart">
            ✕
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="cart-empty">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={80}
                      height={100}
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </div>

                <div className="cart-item-details">
                  <h3>{item.title}</h3>
                  <p className="cart-item-price">${parseFloat(item.price).toFixed(2)}</p>

                  <div className="cart-item-quantity">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      disabled={isLoading}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={isLoading}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="cart-item-remove"
                  disabled={isLoading}
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <a
              href={checkoutUrl || "#"}
              className="cart-checkout"
              target="_blank"
              rel="noopener noreferrer"
            >
              Checkout
            </a>
          </div>
        )}
      </div>
    </>
  );
}