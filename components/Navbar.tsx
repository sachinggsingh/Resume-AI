'use client';

import React from 'react';
import Link from 'next/link';
import { ModeToggle } from './toggleButton';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Menu, } from 'lucide-react';
import UserAvatar from './Avatar';

export default function Navbar() {
  return (
    <header className="w-full border-b shadow-sm bg-white dark:bg-black text-black dark:text-white sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo or Brand */}
        <Link href="/" className="text-xl font-bold hover:opacity-80 transition">
          Resume Refiner AI
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex gap-6">
          <Link
            href="/"
            className="text-sm hover:underline hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm hover:underline hover:text-primary transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Desktop Theme Toggle and Avatar */}
        <div className="hidden md:flex items-center gap-4">
          <ModeToggle />
          <UserAvatar />
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-white dark:bg-black text-black dark:text-white">
            <SheetTitle className="text-2xl  font-semibold mt-2">Menu</SheetTitle>
            <nav className="flex flex-col gap-4 mt-6">

              {/* Mobile Theme Toggle and Avatar */}
              <div className="flex flex-col gap-4 pt-4 border-t">
                <div className="items-center justify-around">
                  {/* <span className="text-sm font-medium">Theme</span> */}
                  <ModeToggle />
                </div>
                <div className="items-center justify-between">
                  {/* <span className="text-sm font-medium">Account</span> */}
                  <UserAvatar />
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
