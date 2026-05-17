import Link from "next/link";
"use client";
import { createCheckout } from "@/lib/shopify";

interface Variant {
  id: string;
  title: string;
  availableForSale: boolean;
}

export default function AddToCartButton({ variant }: { variant: Variant }) {
  async function handleClick() {
    if (!variant.availableForSale) return;
    const url = await createCheckout(variant.id);
    if (url) window.open(url, "_blank");
  }

  return (
    <button
      className={`variant-btn${!variant.availableForSale ? " sold-out" : ""}`}
      onClick={handleClick}
      disabled={!variant.availableForSale}
    >
      {variant.availableForSale
        ? variant.title
        : `${variant.title} — Sold Out`}
    </button>
  );
}