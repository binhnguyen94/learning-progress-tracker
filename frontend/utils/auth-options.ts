import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SignJWT } from "jose";

type BackendUserResponse = {
  success: boolean;
  data: {
    user_id: string;
    email: string;
    name: string;
    profile_picture: string | null;
  };
};

const syncGoogleUser = async ({
  email,
  name,
  image,
}: {
  email: string;
  name: string;
  image?: string | null;
}) => {
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not configured");
  }

  const syncToken = await new SignJWT({
    email,
    name,
    profile_picture: image || null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("learning-progress-tracker")
    .setAudience("learning-progress-tracker-auth-sync")
    .setIssuedAt()
    .setExpirationTime("2m")
    .sign(new TextEncoder().encode(secret));

  const response = await fetch(
    `${process.env.BACKEND_API_URL || "http://localhost:5001/api"}/auth/google`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${syncToken}`,
      },
      body: JSON.stringify({
        email,
        name,
        profile_picture: image || null,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Unable to sync authenticated user");
  }

  const payload = (await response.json()) as BackendUserResponse;
  return payload.data;
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (!token.user_id && user?.email && user.name) {
        const backendUser = await syncGoogleUser({
          email: user.email,
          name: user.name,
          image: user.image,
        });

        token.user_id = backendUser.user_id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.user_id) {
        session.user.user_id = token.user_id;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (url.startsWith(baseUrl)) {
        return url;
      }

      return `${baseUrl}/dashboard`;
    },
  },
};
