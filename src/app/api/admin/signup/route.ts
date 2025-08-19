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

        const existingAdmin = await AdminModel.findOne({ email });
        if (existingAdmin) {
            return NextResponse.json(
                { error: "Admin with this email already exists" },
                { status: 409 }
            );
        }

        const admin = await AdminModel.create({ email, password });

        const createdAdmin = await AdminModel.findById(admin._id).select(
            "-password"
        );

        return NextResponse.json(
            {
                success: true,
                data: createdAdmin,
                message: "Admin created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Admin Signup error:", error);
        return NextResponse.json({ error: "Admin Signup error" }, { status: 500 });
    }
}
