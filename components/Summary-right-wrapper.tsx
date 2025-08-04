import { useState, useEffect } from "react";
import SummaryRight from "./Summary-right";

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

interface SummaryRightProps {
  loading: boolean;
  error: string | null;
  summary: string | AnalysisData | null;
  isStructured: boolean;
  jobTitle?: string;
}

export default function SummaryWrapper({loading, error, summary, isStructured, jobTitle}: SummaryRightProps) {
    const [showContent, setShowContent] = useState(false);
    
    useEffect(() => {
        // Show spinner for 5 seconds
        const timer = setTimeout(() => {
            setShowContent(true);
        }, 5000);
        
        return () => clearTimeout(timer);
    }, []);
    
    if (!showContent) {
        return (
            <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-blue-200 dark:border-gray-700 p-8 shadow-lg">
                    <div className="flex items-center justify-center h-40">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Analyzing your resume...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <SummaryRight loading={loading} error={error} summary={summary} isStructured={isStructured} jobTitle={jobTitle} />
    );
}