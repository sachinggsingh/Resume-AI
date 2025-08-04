"use client";

import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button, } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Home, CheckCircle, AlertCircle, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  const router = useRouter();
  const [, setFiles] = useState<File[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleFileUpload = async (files: File[]) => {
    setFiles(files);
    console.log("Uploaded files:", files);

    if (files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadStatus({ type: null, message: "" });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadStatus({
          type: "success",
          message: "File uploaded successfully!",
        });
      } else {
        setUploadStatus({
          type: "error",
          message: result.error || "Upload failed",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus({
        type: "error",
        message: "Network error occurred",
      });
    } finally {
      setIsUploading(false);
    }
  };
  const redirectToSummary = async () => {
    setIsSummarizing(true);
    // Redirect to summary page
    setTimeout(() => {
      router.push(`/summary?jobTitle=${encodeURIComponent(jobTitle)}`);
    }, 2000);
  };

  return (
    <main className="w-full max-w-4xl mx-auto mt-24 px-4">
      {/* Header row */}
      <div className="flex items-center justify-between mb-8 relative">
        {/* Back Button */}
        <div className="absolute left-0 ">
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

        {/* Centered Title */}
        <h1 className="text-3xl font-bold text-center w-full">
          Resume Summary
        </h1>
      </div>

      {/* Form Card */}
      <div className="space-y-6 bg-white dark:bg-black p-6 rounded-lg border-none dark:border-neutral-700 shadow-sm">
        {/* Job Position Input */}
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Description</Label>
          <Textarea
            id="jobTitle"
            placeholder="e.g. Frontend Developer, Software Engineer, etc."
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="bg-white dark:bg-neutral-900 w-full min-h-[80px]"
          />
        </div>

        {/* File Upload */}
        <div className="mt-4">
          <div className="mt-2 dark:border-neutral-700 rounded-md p-4">
            <FileUpload onChange={handleFileUpload} />
          </div>
        </div>

        {/* Upload Status */}
        {isUploading && (
          <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <LoaderCircle className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-blue-700 dark:text-blue-300">
              Uploading file...
            </span>
          </div>
        )}

        {uploadStatus.type === "success" && (
          <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-green-700 dark:text-green-300">
              {uploadStatus.message}
            </span>
          </div>
        )}
        {uploadStatus.type === "success" && (
          <Button 
            className="cursor-pointer" 
            onClick={() => redirectToSummary()} 
            disabled={isSummarizing} 
            variant="default"
          >
            {isSummarizing ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin text-white mr-2" />
                Summarizing...
              </>
            ) : (
              "Summarize the things"
            )}
          </Button>
        )}

        {uploadStatus.type === "error" && (
          <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-700 dark:text-red-300">
              {uploadStatus.message}
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
