const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN as string;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN as string;
const endpoint = `https://${domain}/api/2024-01/graphql.json`;

async function shopifyFetch(query: string) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query }),
  });
  return res.json();
}

export async function getProducts() {
  const data = await shopifyFetch(`{
    products(first: 10) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 1) { edges { node { url altText } } }
          variants(first: 1) { edges { node { id title availableForSale } } }
        }
      }
    }
  }`);
  return data.data.products.edges.map((e: any) => e.node);
}

export async function createCheckout(variantId: string): Promise<string | null> {
  const data = await shopifyFetch(`
    mutation {
      checkoutCreate(input: {
        lineItems: [{ variantId: "${variantId}", quantity: 1 }]
      }) {
        checkout { webUrl }
        checkoutUserErrors { message }
      }
    }
  `);
  return data.data?.checkoutCreate?.checkout?.webUrl ?? null;
}