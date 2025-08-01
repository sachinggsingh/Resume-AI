import connectDB from "@/app/lib/db";
import UserModel from "@/app/model/User";
import bcrypt from "bcryptjs";
import { NextResponse,NextRequest } from "next/server";


export async function POST(request: NextRequest) {
    await connectDB();
    try {
       
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ msg: "All fields are required", success: false }, { status: 400 })
        }
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            return NextResponse.json({ msg: "The Email is alreay registered", success: false }, { status: 400 })
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            email,
            password: hashPassword
        });
        await newUser.save();

        return NextResponse.json({ msg: "User created Successfully", success: true }, { status: 201 })

    } catch (error) {
        console.error("Error in registering user:", error);
        return NextResponse.json({
            success: false,
            message: "Error in registering user. Please try again."
        }, {
            status: 500
        });
    }
}