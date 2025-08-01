import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/app/lib/cloudinary";
import connectDB from "@/app/lib/db";
import UploadModel from "@/app/model/Upload";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      );
    }

    if (!(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Invalid file type" },
        { status: 400 }
      );
    }

    // Validate PDF
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const mimetype = file.type;
    const filename =
      typeof (file as Blob & { name?: string }).name === "string"
        ? (file as Blob & { name: string }).name
        : "uploaded_file.pdf";

    // Sanitize public ID
    const publicId = filename.replace(/\.[^/.]+$/, "") // remove extension
                             .replace(/\s+/g, "_")
                             .toLowerCase();

    const dataOfBase64 = Buffer.from(fileBuffer).toString("base64");
    const pdfUrl = `data:${mimetype};base64,${dataOfBase64}`;

    // Upload to Cloudinary with resource_type: auto
    const result = await cloudinary.uploader.upload(pdfUrl, {
      resource_type: "auto", // enables PDF transformation
      public_id: `pdfs/${publicId}`,
      folder: "pdfs",
      overwrite: true,
    });

    await connectDB();

    const uploadRecord = new UploadModel({
      cloudinary_url: result.secure_url,
    });

    const savedRecord = await uploadRecord.save();

    return NextResponse.json({
      success: true,
      message: "PDF uploaded successfully",
      pdf: result.secure_url,
      public_id: result.public_id,
      upload_id: savedRecord._id,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
