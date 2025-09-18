import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);

  // Gate /complaint route behind access token
  if (url.pathname.startsWith("/complaint")) {
    const tokenFromQuery = url.searchParams.get("t");
    const tokenFromCookie = req.cookies.get("complaint_access")?.value;
    const required = process.env.COMPLAINT_ACCESS_TOKEN;

    if (
      required &&
      (tokenFromCookie === required || tokenFromQuery === required)
    ) {
      // If token provided via query, set cookie for subsequent requests
      if (tokenFromQuery === required) {
        // strip query param from URL
        url.searchParams.delete("t");
        const redirectRes = NextResponse.redirect(url);
        redirectRes.cookies.set("complaint_access", required, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        return redirectRes;
      }
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/complaint/:path*"],
};
