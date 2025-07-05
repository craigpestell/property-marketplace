import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { Pool } from 'pg';

// Set up your PostgreSQL connection
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

export const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Look up the user in the database
        const result = await pool.query(
          'SELECT * FROM clients WHERE email = $1',
          [credentials.email as string],
        );
        const user = result.rows[0];

        // Compare the posted password with the stored hash
        if (
          user &&
          (await bcrypt.compare(
            credentials.password as string,
            user.password_hash,
          ))
        ) {
          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        // Check if user exists in database
        const result = await pool.query(
          'SELECT * FROM clients WHERE email = $1',
          [user.email],
        );

        // If user doesn't exist, create them
        if (result.rows.length === 0) {
          await pool.query(
            'INSERT INTO clients (name, email, created_at) VALUES ($1, $2, NOW())',
            [user.name, user.email],
          );
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signUp: '/signup',
  },
};
