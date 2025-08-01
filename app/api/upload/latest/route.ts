import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import UploadModel from "@/app/model/Upload";

export async function GET() {
  try {
    await connectDB();
    
    // Get the latest upload
    const latestUpload = await UploadModel.findOne()
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .select('cloudinary_url'); // Only get the cloudinary_url field
    
    if (!latestUpload) {
      return NextResponse.json(
        { error: "No uploads found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      cloudinary_url: latestUpload.cloudinary_url
    });
  } catch (error) {
    console.error("Error fetching latest upload:", error);
    return NextResponse.json(
      { error: "Failed to fetch upload" },
      { status: 500 }
    );
  }
} 