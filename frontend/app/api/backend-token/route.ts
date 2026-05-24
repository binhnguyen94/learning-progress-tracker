import { SignJWT } from "jose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/utils/auth-options";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.user_id || !session.user.email) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication required",
      },
      { status: 401 },
    );
  }

  const secret = process.env.API_AUTH_SECRET || process.env.NEXTAUTH_SECRET;

  if (!secret) {
    return NextResponse.json(
      {
        success: false,
        message: "API auth secret is not configured",
      },
      { status: 500 },
    );
  }

  const token = await new SignJWT({
    user_id: session.user.user_id,
    email: session.user.email,
    name: session.user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("learning-progress-tracker")
    .setAudience("learning-progress-tracker-api")
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(new TextEncoder().encode(secret));

  return NextResponse.json({
    success: true,
    token,
  });
}
