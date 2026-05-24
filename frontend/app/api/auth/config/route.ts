import { NextResponse } from "next/server";

import { isGoogleAuthConfigured } from "@/utils/auth-options";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    success: true,
    data: {
      google: isGoogleAuthConfigured,
    },
  });
}
