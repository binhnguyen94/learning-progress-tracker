"use client";

import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function LoginContent() {
  const searchParams = useSearchParams();
  const hasError = Boolean(searchParams.get("error"));

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

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="mt-8 w-full rounded-md bg-neutral-950 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Login with Google
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
