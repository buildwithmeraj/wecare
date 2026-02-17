import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
const privateRoutes = ["/profile", "/my-bookings", "/booking", "/admin"];
// This function can be marked `async` if using `await` inside
export async function proxy(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;
  const { pathname } = req.nextUrl;
  const isPrivateRoute =
    privateRoutes.some((route) => pathname.startsWith(route)) ||
    (pathname.startsWith("/services/") && pathname.endsWith("/book"));

  if (isPrivateRoute && !isAuth /*|| !isUser*/) {
    // Redirect to login page if not authenticated
    const loginUrl = new URL("/login", req.url);
    // set callback url to return back to the protected page after login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && isAuth) {
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    const tokenEmail = token?.email?.toLowerCase();
    const isAdmin = token?.role === "admin" || adminEmails.includes(tokenEmail);

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (
    isAuth &&
    (pathname === "/login" || pathname === "/register") &&
    req.nextUrl.searchParams.get("callbackUrl")
  ) {
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
    const safePath = callbackUrl.startsWith("/") ? callbackUrl : "/profile";
    return NextResponse.redirect(
      new URL(safePath, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/my-bookings/:path*",
    "/booking/:path*",
    "/admin/:path*",
    "/services/:path*/book",
    "/login",
    "/register",
  ],
};
