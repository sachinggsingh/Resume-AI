"use client";

import React, { useState, useEffect } from "react";
import {
  ScanSearch,
  Home,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SummaryLeft from "@/components/Summary-left";
import SummaryRight from "@/components/Summary-right";

interface AnalysisData {
  atsScore: number;
  keywordsMatch: number;
  formatScore: number;
  keyStrengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  keywordAnalysis: string;
  overallAssessment: string;
}

export default function Page() {
  const searchParams = useSearchParams();
  const jobTitle = searchParams.get("jobTitle");

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | AnalysisData | null>(null);
  const [isStructured, setIsStructured] = useState(false);

  // const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  useEffect(() => {
    const fetchLatestUpload = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/upload/latest");
        const data = await response.json();

        if (response.ok && data.success) {
          setPdfUrl(data.cloudinary_url);
        } else {
          setError(data.error || "Failed to fetch latest upload");
        }
      } catch (err) {
        console.log("Error:", err);
        setError("Network error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestUpload();
  }, []);

  useEffect(() => {
    const convertPdfToImages = async () => {
      if (!pdfUrl) return;

      try {
        setConverting(true);
        setError(null);

        // Extract public_id from Cloudinary URL
        // const urlParts = pdfUrl.split('/');
        // const publicIdWithExtension = urlParts[urlParts.length - 1];
        // const publicId = publicIdWithExtension.split('.')[0]; // Remove file extension

        // Generate image URLs for each page using Cloudinary transformations
        const imageUrls: string[] = [];

        // Try to get up to 10 pages (most resumes are 1-3 pages)
        for (let page = 1; page <= 10; page++) {
          try {
            // Create Cloudinary URL for each page using transformation
            const imageUrl = pdfUrl.replace(
              "/upload/",
              `/upload/pg_${page},f_jpg,q_auto/`
            );

            // Check if the image exists by making a HEAD request
            const response = await fetch(imageUrl, { method: "HEAD" });
            if (response.ok) {
              imageUrls.push(imageUrl);
            } else {
              // If this page doesn't exist, we've reached the end
              break;
            }
          } catch (error) {
            console.log("Error:", error);
            // If there's an error, we've probably reached the end of the PDF
            break;
          }
        }

        if (imageUrls.length === 0) {
          throw new Error("No images found");
        }

        setImages(imageUrls);
      } catch (err) {
        console.log("Error:", err);
        setError("Failed to convert PDF to images");
      } finally {
        setConverting(false);
      }
    };

    convertPdfToImages();
  }, [pdfUrl]);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!pdfUrl || !jobTitle) return;

      try {
        setLoading(true);
        setError(null);
        setSummary(null);
        // Convert PDF URL to image URL for Gemini
        let imageUrl = pdfUrl;
        if (pdfUrl.includes(".pdf")) {
          imageUrl = pdfUrl.replace("/upload/", "/upload/f_jpg,q_auto/");
        }

        console.log("Sending image URL to Gemini:", imageUrl);

        const response = await fetch("/api/summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cloudinaryUrl: imageUrl,
            jobTitle,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch summary");
        }

        // setSummary(data.summary);

        // console.log("API Response:", data);
        // console.log("Summary data:", data.summary);
        // console.log("Is structured:", data.isStructured);
        setSummary(data.summary);
        setIsStructured(data.isStructured || false);
      } catch (err) {
        console.log("Error:", err);
        setError("Failed to generate summary");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [pdfUrl, jobTitle]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <main className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 relative">
        <div className="absolute left-0 top-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  size="icon"
                >
                  <Home className="w-4 h-4" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Back to Home</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <ScanSearch className="w-6 h-6 text-primary" />
          Resume Summary Analyzer
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          The Strength and the Weakness of your resume are as follows
        </p>
        <p className="text-muted-foreground max-w-md mx-auto mt-2">
          <span className="font-bold">Job Description : </span>{" "}
          <span>{jobTitle || "Not specified"}</span>
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Image Viewer */}
        <SummaryLeft
          loading={loading}
          converting={converting}
          error={error}
          images={images}
          currentImageIndex={currentImageIndex}
          onNextImage={nextImage}
          onPrevImage={prevImage}
        />

        {/* Right Side - Summary Section */}
        <SummaryRight
          loading={loading}
          error={error}
          summary={summary}
          isStructured={isStructured}
          jobTitle={jobTitle || undefined}
        />
      </div>
    </main>
  );
}
