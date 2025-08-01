"use client";

import { BrainCircuit, Home, ScanText, Sparkles, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen px-4 py-16 max-w-5xl mx-auto bg-white text-black dark:bg-black dark:text-white">
      {/* Home Button and Tooltip */}
      <div className="mb-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/">
              <Button variant="outline">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Back to Home</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-4">
        About Resume Refiner AI
      </h1>
      <p className="text-center max-w-2xl mx-auto mb-12 text-gray-600 dark:text-gray-300">
        Resume Refiner AI is an intelligent resume analysis tool powered by
        advanced language models. Our mission is to help job seekers craft
        high-impact resumes that resonate with recruiters and applicant tracking
        systems (ATS).
      </p>

      {/* Feature Cards */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white text-black dark:bg-black dark:text-white border border-neutral-300 dark:border-neutral-700">
          <CardHeader>
            <BrainCircuit className="w-6 h-6 text-primary" />
            <CardTitle className="text-lg">AI-Driven Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              We use large language models to evaluate your resume content,
              structure, and tone—providing tailored suggestions to improve
              clarity and impact.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white text-black dark:bg-black dark:text-white border border-neutral-300 dark:border-neutral-700">
          <CardHeader>
            <ScanText className="w-6 h-6 text-primary" />
            <CardTitle className="text-lg">ATS Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Our tool checks your resume’s compatibility with Applicant
              Tracking Systems, ensuring your application doesn’t get filtered
              out.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white text-black dark:bg-black dark:text-white border border-neutral-300 dark:border-neutral-700">
          <CardHeader>
            <Users className="w-6 h-6 text-primary" />
            <CardTitle className="text-lg">Built for Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Whether you’re a fresher or a seasoned professional, our platform
              is designed to support your unique career goals.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white text-black dark:bg-black dark:text-white border border-neutral-300 dark:border-neutral-700">
          <CardHeader>
            <Sparkles className="w-6 h-6 text-primary" />
            <CardTitle className="text-lg">Simple, Fast & Free</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Just upload your resume, and let our AI do the rest — no sign-up
              required. Get instant, actionable insights.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
