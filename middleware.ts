import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/sign-in", "/sign-up"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  console.log({ pathname });
  const apiSessionUrl = new URL("/api/auth/session", req.nextUrl.origin);

  try {
    const response = await fetch(apiSessionUrl, {
      headers: {
        Cookie: req.headers.get("cookie") || "",
      },
    });

    const isAuthenticated = response.ok;

    // If user is authenticated and trying to access public pages, redirect to home
    if (isAuthenticated && isPublicPath) {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }

    // If user is not authenticated and trying to access protected pages, redirect to sign-in
    if (!isAuthenticated && !isPublicPath) {
      const signInUrl = new URL("/sign-in", req.nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // On error, allow access to public pages, block others
    if (isPublicPath) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl.origin));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|_next/|static/|.*\\..*).*)",
  ],
};
