import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import dbConnect from '@/lib/db';
import { signJwt } from '@/lib/auth';

export const authOptions = {
  adapter: MongoDBAdapter(dbConnect),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user }) {
      const token = signJwt({ id: user.id });
      // Optionally store token in a cookie or session
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };