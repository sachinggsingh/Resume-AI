"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
export const SignUpForm = () => {
    const router = useRouter();
    const [form, setForm] = useState({
      email: "",
      password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      setSuccess("");
  
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }
  
      try {
        const response = await fetch("/api/sign-up", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          setError(data.message || "Failed to sign up");
        } else {
          setSuccess("Sign-up successful!");
          router.push("/"); 
        }
      } catch (err) {
        console.error(err);
        setError("Error in the sign-up process");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <main className="flex items-center justify-center min-h-screen px-4 bg-black">
        <Card className="w-full max-w-md shadow-md bg-zinc-900 text-white">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Sign Up</CardTitle>
          </CardHeader>
  
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="mb-1">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="mb-1">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  required
                  minLength={6}
                />
              </div>
  
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
  
              {error && (
                <p className="text-red-500 text-sm text-center mt-2">{error}</p>
              )}
              {success && (
                <p className="text-green-500 text-sm text-center mt-2">{success}</p>
              )}
            </form>
          </CardContent>
  
          <CardFooter className="text-xs text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign In
            </Link>
          </CardFooter>
        </Card>
      </main>
    );
}