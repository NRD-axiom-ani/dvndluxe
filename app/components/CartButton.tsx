"use client";

import { useCart } from "../context/CartContext";

export default function CartButton({ onClick }: { onClick: () => void }) {
  const { cartCount } = useCart();

  return (
    <button
      onClick={onClick}
      className="cart-button"
      aria-label={`Shopping cart with ${cartCount} items`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 7M17 13l1.4 7M9 21h6" />
        <circle cx="9" cy="21" r="1" />
        <circle cx="17" cy="21" r="1" />
      </svg>
      {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
    </button>
  );
}