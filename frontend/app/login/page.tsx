"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

type AuthConfigResponse = {
  success: boolean;
  data: {
    google: boolean;
  };
};

function LoginContent() {
  const searchParams = useSearchParams();
  const hasError = Boolean(searchParams.get("error"));
  const [isGoogleConfigured, setIsGoogleConfigured] = useState(true);
  const [isCheckingConfig, setIsCheckingConfig] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuthConfig = async () => {
      try {
        const response = await fetch("/api/auth/config");
        const payload = (await response.json()) as AuthConfigResponse;

        if (isMounted) {
          setIsGoogleConfigured(Boolean(payload.data.google));
        }
      } catch {
        if (isMounted) {
          setIsGoogleConfigured(false);
        }
      } finally {
        if (isMounted) {
          setIsCheckingConfig(false);
        }
      }
    };

    void checkAuthConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 p-6">
      <section className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral-950">
          Learning Progress Tracker
        </h1>
        <p className="mt-2 text-sm text-neutral-600">Track Your Learning Journey</p>

        {hasError ? (
          <p className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Login failed. Please try again with your Google account.
          </p>
        ) : null}

        {!isCheckingConfig && !isGoogleConfigured ? (
          <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Google OAuth is not configured. Set GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET, and NEXTAUTH_URL, then restart
            the frontend server.
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          disabled={isCheckingConfig || !isGoogleConfigured}
          className="mt-8 w-full rounded-md bg-neutral-950 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
        >
          {isCheckingConfig ? "Checking Google OAuth..." : "Login with Google"}
        </button>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
