"use server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "./env";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value as string;

    if (
        accessToken &&
        (pathname.startsWith("/admin/login") ||
            pathname.startsWith("/admin/signup"))
    ) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (!accessToken && pathname.startsWith("/admin/dashboard")) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (
        !accessToken &&
        pathname.startsWith("/admin/") &&
        !pathname.startsWith("/admin/login") &&
        !pathname.startsWith("/admin/signup")
    ) {
        try {
            const isValid = await verifyToken(accessToken);
            if (!isValid) {
                const response = NextResponse.redirect(
                    new URL("/admin/login", request.url)
                );
                response.cookies.delete("accessToken");
                return response;
            }
        } catch (error) {
            const response = NextResponse.redirect(
                new URL("/admin/login", request.url)
            );
            response.cookies.delete("accessToken");
            return response;
        }
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }
}

async function verifyToken(token: string) {
    try {
        const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
        return { valid: true };
    } catch (error) {
        return { valid: false };
    }
}

export const config = {
    matcher: ["/", "/admin/:path*"],
};
