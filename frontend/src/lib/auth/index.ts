import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

// This is your modular, centralized auth configuration
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // 1. The JWT Callback: Runs immediately after login
    // Takes data from Google (user) and puts it in the cookie (token)
    async jwt({ token, user, account }) {
      if (account && user) {
        token.sub = user.id; // Attach the unique Google ID
        token.name = user.name; // Attach the user's name
        token.picture = user.image; // Attach the profile picture URL
      }
      return token;
    },

    // 2. The Session Callback: Runs whenever your app checks if someone is logged in
    // Takes data from the cookie (token) and exposes it to your frontend (session)
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub; // Make ID available to the client
        session.user.name = token.name; // Make name available to the client
        // Cast token.picture to string | null to satisfy TypeScript
        session.user.image = token.picture as string | null;
      }
      return session;
    },
  },
});
