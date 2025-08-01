"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LoaderOne } from "@/components/ui/loader";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1000); // simulate loading
    return () => clearTimeout(timeout);
  }, [pathname]); // re-run on every route change

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderOne />
      </div>
    );
  }

  return <SessionProvider>
    <TooltipProvider>{children}</TooltipProvider>;
  </SessionProvider>
}
