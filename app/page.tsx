import { getProducts } from "@/lib/shopify";
import HomeClient from "@/app/components/HomeClient";

export default async function Home() {
  const products = await getProducts();
  return <HomeClient products={products} />;
}