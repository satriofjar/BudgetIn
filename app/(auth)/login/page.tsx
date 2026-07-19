"use client";

import { Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleIcon } from "@/components/icons/google-icon";
import { useAuth } from "@/context/auth-context";
import { signInWithGoogle } from "@/lib/firebase/auth";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  async function handleSignIn() {
    setError(null);
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch {
      setError("Sign-in failed. Please try again.");
    } finally {
      setSigningIn(false);
    }
  }

  return (
    <Card className="w-full max-w-sm border-border/60 shadow-lg shadow-black/5">
      <CardHeader className="items-center text-center">
        <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Wallet className="size-6" />
        </div>
        <CardTitle className="text-2xl">Welcome to BudgetIn</CardTitle>
        <CardDescription>
          Track your income, expenses, and investments in one place.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          onClick={handleSignIn}
          disabled={signingIn || loading}
          variant="outline"
          className="w-full gap-2"
        >
          <GoogleIcon />
          {signingIn ? "Signing in…" : "Sign in with Google"}
        </Button>
        {error && <p className="text-center text-sm text-destructive">{error}</p>}
        <p className="text-center text-xs text-muted-foreground">
          Your financial data stays private to your account.
        </p>
      </CardContent>
    </Card>
  );
}
