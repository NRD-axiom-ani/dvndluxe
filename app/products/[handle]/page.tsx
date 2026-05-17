import { getProductByHandle, getProducts } from "@/lib/shopify";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/app/components/AddToCartButton";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p: any) => ({ handle: p.handle }));
}

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const product = await getProductByHandle(params.handle);
  if (!product) return notFound();

  const images = product.images.edges.map((e: any) => e.node);
  const variants = product.variants.edges.map((e: any) => e.node);
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const currency = product.priceRange.minVariantPrice.currencyCode;

  return (
    <main className="product-detail-page">
      <div className="product-detail-inner">
        <div className="product-detail-images">
          {images.map((img: any, i: number) => (
            <div key={i} className="product-detail-img-wrap">
              <Image
                src={img.url}
                alt={img.altText || product.title}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        <div className="product-detail-info">
          <p className="product-detail-label">DVND — SS 2026</p>
          <h1 className="product-detail-title">{product.title}</h1>
          <p className="product-detail-price">
            {currency === "USD" ? "$" : "₹"}
            {price.toFixed(2)} {currency}
          </p>
          <p className="product-detail-desc">{product.description}</p>

          <div className="product-detail-variants">
            <p className="variant-label">Select Size</p>
            <div className="variant-options">
              {variants.map((v: any) => (
                <AddToCartButton key={v.id} variant={v} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}