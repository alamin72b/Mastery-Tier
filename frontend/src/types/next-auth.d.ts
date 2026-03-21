import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
    // Add our custom backend token to the Session type
    backendToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    // Add our custom backend token to the JWT type
    backendToken?: string;
  }
}
