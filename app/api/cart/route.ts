import { NextResponse } from "next/server";

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cartId = searchParams.get("cartId");

  if (!cartId) {
    return NextResponse.json({ items: [] });
  }

  const query = `
    query($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  priceV2 {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = { cartId };

  const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
  });

  const { data } = await response.json();

  if (!data.cart) {
    return NextResponse.json({ items: [] });
  }

  const items = data.cart.lines.edges.map((edge: any) => ({
    id: edge.node.id,
    variantId: edge.node.merchandise.id,
    title: edge.node.merchandise.product.title,
    price: edge.node.merchandise.priceV2.amount,
    quantity: edge.node.quantity,
    image: edge.node.merchandise.product.images.edges[0]?.node.url || "",
    handle: edge.node.merchandise.product.handle,
  }));

  return NextResponse.json({
    items,
    checkoutUrl: data.cart.checkoutUrl,
  });
}