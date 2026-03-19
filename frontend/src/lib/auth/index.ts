import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    // 1. The JWT Callback
    async jwt({ token, user, account }) {
      if (account && user) {
        try {
          // 1. Ensure the port is 3001
          // 2. Ensure the path is /auth/google/sync
          // Replace 127.0.0.1 with your exact LAN IP
          const res = await fetch(
            'http://192.168.100.195:3001/auth/google/sync',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                avatar: user.image,
                googleId: user.id,
              }),
            },
          );

          if (!res.ok) {
            console.error('Backend Error:', await res.text());
            return token;
          }

          const responseData = await res.json();
          // Ensure you are accessing the token through your TransformInterceptor 'data' wrapper
          token.backendToken = responseData.data.accessToken;
        } catch (error) {
          console.error(
            'CRITICAL: Could not connect to NestJS on port 3001',
            error,
          );
        }
      }
      return token;
    },

    // 2. The Session Callback
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.image = token.picture as string | null;

        // Expose the NestJS token to the frontend client securely
        session.backendToken = token.backendToken;
      }
      return session;
    },
  },
});
