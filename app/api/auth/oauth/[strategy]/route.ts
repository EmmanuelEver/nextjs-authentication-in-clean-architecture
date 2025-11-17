import { signUpIfNotExists } from "@/lib/actions/auth";
import { oAuthProvider } from "@/lib/auth/oauthProviders";
import { OAuthProvider, oAuthProviderEnum } from "@/src/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

type OAuthUserInfo = {
  email?: string;
  name?: string;
  id?: string;
  sub?: string;
  global_name?: string;
  username?: string;
};

function validateStrategy(strategy: string): OAuthProvider {
  if (!oAuthProviderEnum.enumValues.includes(strategy as OAuthProvider)) {
    throw new Error(`Unsupported OAuth provider: ${strategy}`);
  }
  return strategy as OAuthProvider;
}

function extractUserInfo(userInfo: OAuthUserInfo, strategy: OAuthProvider) {
  switch (strategy) {
    case "discord":
      return {
        email: userInfo.email,
        name: userInfo.global_name || userInfo.username,
        providerAccountId: userInfo.id,
      };
    case "google":
      return {
        email: userInfo.email,
        name: userInfo.name,
        providerAccountId: userInfo.sub,
      };
    case "github":
      return {
        email: userInfo.email,
        name: userInfo.name || userInfo.username,
        providerAccountId: userInfo.id?.toString(),
      };
    default:
      return {
        email: userInfo.email,
        name: userInfo.name,
        providerAccountId: userInfo.id || userInfo.sub,
      };
  }
}

async function exchangeCodeForToken(
  code: string,
  provider: keyof typeof oAuthProvider
) {
  const providerConfig = oAuthProvider[provider];

  const response = await fetch(providerConfig.tokenUrl, {
    method: "POST",
    body: new URLSearchParams({
      code,
      redirect_uri: providerConfig.redirectUri,
      client_id: providerConfig.clientId,
      client_secret: providerConfig.clientSecret,
      grant_type: providerConfig.tokenParams.grant_type,
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.status}`);
  }

  const data = await response.json();
  if (!data.access_token || !data.token_type) {
    throw new Error("Invalid token response from OAuth provider");
  }

  return data;
}

async function fetchUserInfo(
  tokenUrl: string,
  accessToken: string,
  tokenType: string,
  strategy: OAuthProvider
) {
  const tokenFullUrl = new URL(tokenUrl);
  if (strategy === "facebook") {
    tokenFullUrl.searchParams.set("access_token", accessToken);
  }
  const response = await fetch(tokenFullUrl, {
    method: "GET",
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.status}`);
  }

  return response.json();
}

function createErrorRedirect(
  requestUrl: string,
  error: string,
  strategy?: string
) {
  const errorMessage = strategy
    ? `Failed to sign up using ${strategy}: ${error}`
    : error;
  return NextResponse.redirect(
    new URL(`/sign-in?error=${encodeURIComponent(errorMessage)}`, requestUrl)
  );
}

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ strategy: string }> }
) {
  try {
    const { strategy } = await ctx.params;
    const code = request.nextUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
      );
    }

    const validatedStrategy = validateStrategy(strategy);
    const providerKey = validatedStrategy as keyof typeof oAuthProvider;

    const tokenData = await exchangeCodeForToken(code, providerKey);
    const userInfo = await fetchUserInfo(
      oAuthProvider[providerKey].userInfoUrl,
      tokenData.access_token,
      tokenData.token_type,
      validatedStrategy
    );
    const { email, name, providerAccountId } = extractUserInfo(
      userInfo,
      validatedStrategy
    );

    if (!email) {
      return createErrorRedirect(
        request.url,
        "Email is required from OAuth provider",
        strategy
      );
    }

    const { success } = await signUpIfNotExists({
      email,
      name: name || email.split("@")[0], // Fallback to email prefix
      strategy: validatedStrategy,
      providerAccountId: providerAccountId || email,
    });

    if (success) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return createErrorRedirect(
      request.url,
      "Failed to create user account",
      strategy
    );
  } catch (error) {
    console.error("OAuth process failed:", {
      error: error instanceof Error ? error.message : "Unknown error",
      strategy: (await ctx.params).strategy,
      timestamp: new Date().toISOString(),
    });

    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return createErrorRedirect(request.url, errorMessage);
  }
}
