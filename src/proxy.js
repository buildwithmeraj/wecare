import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
const privateRoutes = ["/profile", "/dashboard"];
// This function can be marked `async` if using `await` inside
export async function proxy(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;
  //const isUser = token?.role === "user";
  const isPrivateRoute = privateRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );
  console.log("Token:", token);
  if (isPrivateRoute && !isAuth /*|| !isUser*/) {
    // Redirect to login page if not authenticated
    const loginUrl = new URL("/login", req.url);
    // set callback url to return back to the protected page after login
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/profile/:path*",
};
