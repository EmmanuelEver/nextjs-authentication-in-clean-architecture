import { signUpIfNotExists } from "@/lib/actions/auth";
import { OAuthProvider } from "@/src/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ strategy: string }> }
) {
  const { strategy } = await ctx.params;
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }
  const requestTokenUrl = new URL("https://oauth2.googleapis.com/token");
  requestTokenUrl.searchParams.set(
    "client_id",
    process.env.GOOGLE_OAUTH_CLIENT_ID!
  );
  requestTokenUrl.searchParams.set(
    "client_secret",
    process.env.GOOGLE_OAUTH_CLIENT_SECRET!
  );
  requestTokenUrl.searchParams.set("code", code);
  requestTokenUrl.searchParams.set(
    "redirect_uri",
    process.env.GOOGLE_OAUTH_REDIRECT_URI!
  );
  requestTokenUrl.searchParams.set("grant_type", "authorization_code");
  try {
    const resp = await fetch(requestTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    });
    const data = await resp.json();
    const { access_token, token_type } = data;
    const requestUserInfoUrl = new URL(
      "https://openidconnect.googleapis.com/v1/userinfo"
    );
    const respUserInfo = await fetch(requestUserInfoUrl, {
      method: "GET",
      headers: {
        Authorization: `${token_type} ${access_token}`,
        Accept: "application/json",
      },
    });
    const userInfo = await respUserInfo.json();
    const { name, email, sub } = userInfo;
    const { success } = await signUpIfNotExists({
      email,
      name,
      strategy: strategy as OAuthProvider,
      providerAccountId: sub,
    });
    if (success) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.error();
  } catch (error) {
    console.error("OAuth process failed:", error);
    return NextResponse.json(
      { error: "Internal server error during OAuth process" },
      { status: 500 }
    );
  }
}
