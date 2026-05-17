"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  priceV2: {
    amount: string;
    currencyCode: string;
  };
}

interface ProductImage {
  url: string;
  altText: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: {
      node: ProductImage;
    }[];
  };
  variants: {
    edges: {
      node: ProductVariant;
    }[];
  };
}

export default function ProductClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.edges[0]?.node
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = product.images.edges.map((e) => e.node);
  const variants = product.variants.edges.map((e) => e.node);

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      variantId: selectedVariant.id,
      quantity: 1,
      product: {
        title: product.title,
        handle: product.handle,
        image: images[0]?.url || "",
        price: parseFloat(selectedVariant.priceV2.amount),
        variant: selectedVariant.title,
      },
    });
  };

  return (
    <div className="product-page">
      <nav className="product-breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/#collection">Collection</Link>
        <span>/</span>
        <span>{product.title}</span>
      </nav>

      <div className="product-detail-grid">
        <div className="product-gallery">
          <div className="gallery-main">
            {images[currentImageIndex] && (
              <Image
                src={images[currentImageIndex].url}
                alt={images[currentImageIndex].altText || product.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                priority
              />
            )}
          </div>

          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`thumb ${i === currentImageIndex ? "active" : ""}`}
                  onClick={() => setCurrentImageIndex(i)}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || `${product.title} image ${i + 1}`}
                    fill
                    sizes="100px"
                    style={{ objectFit: "cover" }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.title}</h1>
          <p className="product-price">
            ${parseFloat(selectedVariant?.priceV2.amount || "0").toFixed(2)}
          </p>

          <div className="product-description">
            <p>{product.description}</p>
          </div>

          {variants.length > 1 && (
            <div className="product-variants">
              <label>Size / Variant:</label>
              <div className="variant-options">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    className={`variant-btn ${
                      selectedVariant?.id === variant.id ? "active" : ""
                    } ${!variant.availableForSale ? "disabled" : ""}`}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={!variant.availableForSale}
                  >
                    {variant.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="product-actions">
            <button
              className="btn-add-to-cart"
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale}
            >
              {selectedVariant?.availableForSale
                ? "Add to Cart"
                : "Out of Stock"}
            </button>
            
            <button
              className="btn-buy-now"
              onClick={() => {
                handleAddToCart();
                window.location.href = "/checkout";
              }}
              disabled={!selectedVariant?.availableForSale}
            >
              Buy Now
            </button>
          </div>

          <div className="product-meta">
            <p>
              <strong>SKU:</strong> {product.handle.toUpperCase()}
            </p>
            <p>
              <strong>Availability:</strong>{" "}
              {selectedVariant?.availableForSale ? "In Stock" : "Out of Stock"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}