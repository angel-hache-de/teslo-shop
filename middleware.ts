import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
// import { jwt } from "./utils";

interface Session {
  name: string;
  email: string;
  user: {
    _id: string;
    email: string;
    role: string;
    name: string;
  };
  iat: number;
  exp: number;
}
export async function middleware(request: NextRequest) {
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // API VALIDATION
  if (
    (!session || (session.user as any).role !== "admin") &&
    request.nextUrl.pathname.startsWith("/api/admin")
  ) {
    request.nextUrl.pathname = "/api/admin/unauthorized";
    return NextResponse.rewrite(request.nextUrl);
  }

  if (!session) {
    const requestedPage = request.nextUrl.pathname;

    const newURL = new URL(`/auth/login?p=${requestedPage}`, request.url);

    return NextResponse.redirect(newURL);
  }

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    (session.user as any).role !== "admin"
  )
    return NextResponse.redirect(new URL("/", request.url));

  return NextResponse.next();
  // const token = request.cookies.get("token") || "";

  // try {
  //   await jwt.isValidToken(token);
  //   return NextResponse.next();
  // } catch (error) {
  //   // To verify
  // const requestedPage = request.nextUrl.href;
  // return NextResponse.redirect(`/auth/login?p=${requestedPage}`);
  // }
}

export const config = {
  matcher: ["/checkout/:path*", "/admin/:path*", "/api/admin/:path*"],
};
