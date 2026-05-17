const domain = process.env.SHOPIFY_STORE_DOMAIN as string;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN as string;
const endpoint = `https://${domain}/api/2024-01/graphql.json`;

async function shopifyFetch(query: string) {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });

    return res.json();
  } catch {
    return {};
  }
}

export async function getProducts() {
  try {
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
    return data?.data?.products?.edges?.map((e: any) => e.node) ?? [];
  } catch {
    return [];
  }
}

export async function createCheckout(variantId: string): Promise<string | null> {
  try {
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
    return data?.data?.checkoutCreate?.checkout?.webUrl ?? null;
  } catch {
    return null;
  }
}

export async function getProductByHandle(handle: string) {
  try {
    const data = await shopifyFetch(`{
      productByHandle(handle: "${handle}") {
        id
        title
        description
        handle
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 6) { edges { node { url altText } } }
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              price { amount currencyCode }
            }
          }
        }
      }
    }`);
    return data?.data?.productByHandle ?? null;
  } catch {
    return null;
  }
}

export async function getCollections() {
  try {
    const data = await shopifyFetch(`{
      collections(first: 10) {
        edges {
          node {
            id
            title
            handle
            image { url altText }
            products(first: 10) {
              edges {
                node {
                  id
                  title
                  handle
                  priceRange { minVariantPrice { amount currencyCode } }
                  images(first: 1) { edges { node { url altText } } }
                  variants(first: 1) { edges { node { id availableForSale } } }
                }
              }
            }
          }
        }
      }
    }`);
    return data?.data?.collections?.edges?.map((e: any) => e.node) ?? [];
  } catch {
    return [];
  }
}