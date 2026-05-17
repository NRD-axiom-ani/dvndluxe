import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const query = `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
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
            input: { email, password },
          },
        }),
      }
    );

    const data = await response.json();

    if (data.data?.customerAccessTokenCreate?.customerAccessToken) {
      return NextResponse.json({
        success: true,
        token: data.data.customerAccessTokenCreate.customerAccessToken.accessToken,
      });
    }

    return NextResponse.json({
      success: false,
      error: data.data?.customerAccessTokenCreate?.customerUserErrors[0]?.message || "Login failed",
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Server error",
    }, { status: 500 });
  }
}