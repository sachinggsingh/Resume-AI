import React from "react";
import { AlertCircle, FileText } from "lucide-react";

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

export default function SummaryRight({
  loading,
  error,
  summary,
  isStructured,
}: SummaryRightProps) {
  return (
    <div className="space-y-6">
      {loading ? (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-blue-200 dark:border-gray-700 p-8 shadow-lg">
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            </div>
          </div>
        </div>
      ) : summary ? (
        <div className="space-y-4">
          {/* ATS Score Card - Big and Prominent */}
          {isStructured && typeof summary === "object" ? (
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {"atsScore" in summary ? summary.atsScore : "N/A"}
                </div>
                <div className="text-lg font-semibold mb-1">
                  ATS Compatibility Score
                </div>
                <div className="text-blue-100 text-sm">
                  {"atsScore" in summary && summary.atsScore >= 80
                    ? "Excellent match for ATS systems"
                    : "atsScore" in summary && summary.atsScore >= 60
                    ? "Good match for ATS systems"
                    : "atsScore" in summary
                    ? "Needs improvement for ATS systems"
                    : "Score not available"}
                </div>
                <div className="mt-2 text-xs text-blue-200">
                  ✓ Real-time AI Analysis
                </div>
              </div>
              <div className="mt-4 bg-white/20 rounded-lg p-3">
                <div className="flex justify-between items-center text-sm">
                  <span>Keywords Match</span>
                  <span className="font-semibold">
                    {"keywordsMatch" in summary ? summary.keywordsMatch : "N/A"}
                    %
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span>Format Score</span>
                  <span className="font-semibold">
                    {"formatScore" in summary ? summary.formatScore : "N/A"}%
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">N/A</div>
                <div className="text-lg font-semibold mb-1">
                  ATS Compatibility Score
                </div>
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
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Key Strengths
              </h3>
            </div>
            <div className="space-y-2">
              {isStructured &&
              typeof summary === "object" &&
              summary.keyStrengths ? (
                summary.keyStrengths.map((strength: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {strength}
                    </span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Strong keyword optimization
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Clear professional summary
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Quantified achievements
                    </span>
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
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Areas for Improvement
              </h3>
            </div>
            <div className="space-y-2">
              {isStructured &&
              typeof summary === "object" &&
              summary.areasForImprovement ? (
                summary.areasForImprovement.map(
                  (area: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {area}
                      </span>
                    </div>
                  )
                )
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Add more industry-specific keywords
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Include more recent certifications
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Optimize for specific job requirements
                    </span>
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
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Recommendations
              </h3>
            </div>
            <div className="space-y-2">
              {isStructured &&
              typeof summary === "object" &&
              summary.recommendations ? (
                summary.recommendations.map(
                  (recommendation: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {recommendation}
                      </span>
                    </div>
                  )
                )
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Add 3-5 more relevant keywords
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Include recent project examples
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Tailor summary to target role
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Raw Analysis Text - Show when structured data is not available */}
          {!isStructured && typeof summary === "string" && (
            <div className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">📄</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  AI Analysis
                </h3>
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
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
              Try Again
            </button>
          </div>
        </div>
      ) : !loading && !summary && error ? (
        <div className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Ready for Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Upload a resume and select a job title to get started with
              AI-powered analysis.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
