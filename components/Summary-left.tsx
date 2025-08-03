import React from "react";
import { AlertCircle, FileText, ChevronLeft, ChevronRight } from "lucide-react";

interface SummaryLeftProps {
  loading: boolean;
  converting: boolean;
  error: string | null;
  images: string[];
  currentImageIndex: number;
  onNextImage: () => void;
  onPrevImage: () => void;
}

export default function SummaryLeft({
  loading,
  converting,
  error,
  images,
  currentImageIndex,
  onNextImage,
  onPrevImage,
}: SummaryLeftProps) {
  return (
    <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
      {loading || converting ? (
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>
              {converting
                ? "Converting PDF to images..."
                : "Loading latest upload..."}
            </span>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
              Error
            </h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      ) : images.length > 0 ? (
        <div className="relative">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="font-medium">Resume Images</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentImageIndex + 1} of {images.length}
              </span>
              {images.length > 1 && (
                <div className="flex gap-1">
                  <button
                    onClick={onPrevImage}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onNextImage}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="h-[600px] w-full overflow-hidden">
            <img
              src={images[currentImageIndex]}
              alt={`Resume page ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Images Found</h3>
            <p className="text-muted-foreground">
              No resume images found. Please upload a PDF first.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 