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
