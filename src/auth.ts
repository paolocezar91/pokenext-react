import NextAuth from "next-auth";
import { decode, encode } from "next-auth/jwt";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  // ensure NextAuth uses a stable secret across environments; prefer NEXTAUTH_SECRET
  // but fall back to the older AUTH_SECRET if present (keeps .env.local working)
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {
    encode,
    decode,
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("jwt", { user, token });
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ token, session }) {
      console.log("session", { session, token });

      session.user.id = token.id as string;
      session.user.email = token.email as string;
      return session;
    },
  },
});
