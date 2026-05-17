import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password, firstName, lastName } = await req.json();

  const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const response = await fetch(
    `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query,
        variables: {
          input: {
            email,
            password,
            firstName,
            lastName,
          },
        },
      }),
    }
  );

  const data = await response.json();

  if (data.data?.customerCreate?.customer) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({
    success: false,
    error: data.data?.customerCreate?.customerUserErrors[0]?.message || "Signup failed",
  });
}