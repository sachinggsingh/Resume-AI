'use client';

import { ScanSearch, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <>
      <Navbar/>
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3 mb-4">
          <ScanSearch className="h-8 w-8 text-primary" />
          Resume Refiner AI
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8">
          Get AI-powered insights to improve your resume and stand out to recruiters.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 flex-wrap justify-center">
          {session ? (
            <>
              <Link href="/upload">
                <Button size="lg" className="cursor-pointer">
                  <Upload className="w-5 h-5" />
                  Upload Resume
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="cursor-pointer">
                  <User className="w-5 h-5" />
                  About
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button size="lg" className="cursor-pointer">
                  <Upload className="w-5 h-5" />
                  Upload Resume
                </Button>
              </Link>
              <Link href="/about">
                <Button className='cursor-pointer' variant="outline" size="lg">
                  About
                </Button>
              </Link>
            </>
          )}
        </div>
      </main>
    </>
  )
}
