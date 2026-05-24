import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      user_id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user_id?: string;
  }
}
