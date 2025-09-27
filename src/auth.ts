import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { encode, decode } from "next-auth/jwt";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    encode,
    decode,
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      console.log("jwt", { user, token });
      if (user) {
        (token as any).id = user.id;
        (token as any).email = user.email;
      }
      return token;
    },
    async session({ token, session }: { token: any; session: any }) {
      console.log("session", { session, token });

      (session as any).user.id = (token as any).id as string;
      (session as any).user.email = (token as any).email as string;
      return session;
    },
  },
} as any);
