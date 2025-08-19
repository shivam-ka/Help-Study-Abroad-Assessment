import dbConnect from "@/lib/dbConnect";
import AdminModel from "@/models/Admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            return NextResponse.json(
                { error: "email does not exist" },
                { status: 404 }
            );
        }

        const isPasswordCorrect = await admin.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return NextResponse.json(
                { error: "Enter Correct Password" },
                { status: 401 }
            );
        }

        const accessToken = admin.generateAccessToken();

        const response = NextResponse.json({
            success: true,
            data: {
                _id: admin._id,
                email: admin.email,
                createdAt: admin.createdAt,
            },
            message: "Login successful",
        });

        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        return response;
    } catch (error) {
        console.log("admin loging error", error);
        return NextResponse.json({ error: "admin login error" }, { status: 500 });
    }
}
