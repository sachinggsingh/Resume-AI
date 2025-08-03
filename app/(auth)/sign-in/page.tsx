"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // ✅ Add this
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
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

export default function Page() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const res = await signIn("google", {
        redirect: false,
        callbackUrl: "/",
      });
      
      if (res?.error) {
        setError(res.error || "Google sign-in failed.");
      } else {
        setSuccess("Google sign-in successful! Redirecting...");
        router.push("/");
      }
    } catch (error) {
      console.log('Error:', error);
      setError("Google sign-in failed. Please try again.");
    }
    setLoading(false);
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const res = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email: form.email,
      password: form.password,
    });

    if (res?.error) {
      setError(res.error || "Invalid credentials.");
    } else {
      setSuccess("Signed in successfully! Redirecting...");
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4 bg-black">
      <Card className="w-full max-w-md shadow-md bg-zinc-900 text-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Sign In</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email" className="mb-1">Email</Label>
              <Input
                id="email"
                type="text"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="mb-1">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              {/* <div className="text-right mt-1">
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-primary underline"
                >
                  Forgot password?
                </Link>
              </div> */}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm font-normal">
                Remember me
              </Label>
            </div>

            <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
              {loading ? "Signing in..." : "Sign in with Credentials"}
            </Button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center">{success}</p>}
          </form>

          <div className="my-6 text-center text-muted-foreground">or</div>

          <Button
            variant="outline"
            className="w-full flex gap-2 items-center cursor-pointer justify-center"
            onClick={handleGoogleSignIn}
          >
            <FaGoogle className="w-5 h-5" />
            Sign in with Google
          </Button>
        </CardContent>

        <CardFooter className="text-xs text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign Up
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
