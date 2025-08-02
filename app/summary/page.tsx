'use client';

import React, { useState, useEffect } from 'react';
import {
  ScanSearch, FileText, AlertCircle, ChevronLeft, ChevronRight,
  Home,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
  const jobTitle = searchParams.get('jobTitle');

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

        const response = await fetch('/api/upload/latest');
        const data = await response.json();

        if (response.ok && data.success) {
          setPdfUrl(data.cloudinary_url);
        } else {
          setError(data.error || 'Failed to fetch latest upload');
        }
      } catch (err) {
        console.log('Error:', err);
        setError('Network error occurred');
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
            const imageUrl = pdfUrl.replace('/upload/', `/upload/pg_${page},f_jpg,q_auto/`);
            
            // Check if the image exists by making a HEAD request
            const response = await fetch(imageUrl, { method: 'HEAD' });
            if (response.ok) {
              imageUrls.push(imageUrl);
            } else {
              // If this page doesn't exist, we've reached the end
              break;
            }
          } catch (error) {
            console.log('Error:', error);
            // If there's an error, we've probably reached the end of the PDF
            break;
          }
        }

        if (imageUrls.length === 0) {
          throw new Error('No images found');
        }

        setImages(imageUrls);
      } catch (err) {
        console.log('Error:', err);
        setError('Failed to convert PDF to images');
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

        // Convert PDF URL to image URL for Gemini
        let imageUrl = pdfUrl;
        if (pdfUrl.includes('.pdf')) {
          imageUrl = pdfUrl.replace('/upload/', '/upload/f_jpg,q_auto/');
        }
        
        console.log('Sending image URL to Gemini:', imageUrl);
        
        const response = await fetch('/api/summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            cloudinaryUrl: imageUrl, 
            jobTitle 
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch summary');
        }

        console.log('API Response:', data);
        console.log('Summary data:', data.summary);
        console.log('Is structured:', data.isStructured);
        setSummary(data.summary);
        setIsStructured(data.isStructured || false);
      } catch (err) {
        console.log('Error:', err);
        setError('Failed to generate summary');
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
                  <Button variant="outline" className="cursor-pointer" size="icon">
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
          <span className="font-bold">Job Description : </span> <span>{jobTitle || "Not specified"}</span>
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
        {/* Left Side - Image Viewer */}
        <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
          {loading || converting ? (
            <div className="flex items-center justify-center h-96">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>{converting ? 'Converting PDF to images...' : 'Loading latest upload...'}</span>
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
                        onClick={prevImage}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextImage}
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

        {/* Right Side - Summary Section */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-blue-200 dark:border-gray-700 p-8 shadow-lg">
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Analyzing Resume
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Generating detailed analysis with Gemini AI...
                  </p>
                </div>
              </div>
            </div>
          ) : summary ? (
            <div className="space-y-4">
              {/* Debug Info - Remove this in production */}
              {/* {process.env.NODE_ENV === 'development' && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Debug Info:</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Is Structured: {isStructured.toString()}
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Summary Type: {typeof summary}
                  </p>
                  {typeof summary === 'object' && (
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Keys: {Object.keys(summary).join(', ')}
                    </p>
                  )}

                </div>
              )} */}
              {/* ATS Score Card - Big and Prominent */}
              {isStructured && typeof summary === 'object' ? (
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      {'atsScore' in summary ? summary.atsScore : 'N/A'}
                    </div>
                    <div className="text-lg font-semibold mb-1">ATS Compatibility Score</div>
                    <div className="text-blue-100 text-sm">
                      {'atsScore' in summary && summary.atsScore >= 80 
                        ? 'Excellent match for ATS systems'
                        : 'atsScore' in summary && summary.atsScore >= 60
                        ? 'Good match for ATS systems'
                        : 'atsScore' in summary
                        ? 'Needs improvement for ATS systems'
                        : 'Score not available'
                      }
                    </div>
                    <div className="mt-2 text-xs text-blue-200">
                      ✓ Real-time AI Analysis
                    </div>
                  </div>
                  <div className="mt-4 bg-white/20 rounded-lg p-3">
                    <div className="flex justify-between items-center text-sm">
                      <span>Keywords Match</span>
                      <span className="font-semibold">
                        {'keywordsMatch' in summary ? summary.keywordsMatch : 'N/A'}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span>Format Score</span>
                      <span className="font-semibold">
                        {'formatScore' in summary ? summary.formatScore : 'N/A'}%
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">N/A</div>
                    <div className="text-lg font-semibold mb-1">ATS Compatibility Score</div>
                    <div className="text-blue-100 text-sm">
                      Structured analysis not available
                    </div>
                    <div className="mt-2 text-xs text-blue-200">
                      ⚠️ Fallback Display
                    </div>
                  </div>
                  <div className="mt-4 bg-white/20 rounded-lg p-3">
                    <div className="flex justify-between items-center text-sm">
                      <span>Keywords Match</span>
                      <span className="font-semibold">N/A</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span>Format Score</span>
                      <span className="font-semibold">N/A</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Strengths Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 shadow-lg border border-green-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Key Strengths</h3>
                </div>
                <div className="space-y-2">
                  {isStructured && typeof summary === 'object' && summary.keyStrengths ? (
                    summary.keyStrengths.map((strength: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">Strong keyword optimization</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">Clear professional summary</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">Quantified achievements</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Areas for Improvement Card */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 shadow-lg border border-orange-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Areas for Improvement</h3>
                </div>
                <div className="space-y-2">
                  {isStructured && typeof summary === 'object' && summary.areasForImprovement ? (
                    summary.areasForImprovement.map((area: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">{area}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">Add more industry-specific keywords</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">Include more recent certifications</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">Optimize for specific job requirements</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Recommendations Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 shadow-lg border border-blue-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">💡</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Recommendations</h3>
                </div>
                <div className="space-y-2">
                  {isStructured && typeof summary === 'object' && summary.recommendations ? (
                    summary.recommendations.map((recommendation: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">Add 3-5 more relevant keywords</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">Include recent project examples</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">Tailor summary to target role</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Raw Analysis Text - Show when structured data is not available */}
              {!isStructured && typeof summary === 'string' && (
                <div className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">📄</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">AI Analysis</h3>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {summary}
                  </div>
                </div>
              )}

            </div>
          ) : error ? (
            <div className="bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-red-200 dark:border-gray-700 p-8 shadow-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-red-700 dark:text-red-300 mb-3">
                  Analysis Failed
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {error}
                </p>
                <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Ready for Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Upload a resume and select a job title to get started with AI-powered analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
