# Google OAuth Setup Guide

This application supports Google OAuth authentication for user registration and login. Follow these steps to set up Google OAuth:

## 1. Create Google OAuth Application

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen if prompted
6. Set the application type to "Web application"
7. Add authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`

## 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your Google OAuth credentials:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here
```

## 3. Generate NextAuth Secret

You can generate a secret key using:

```bash
openssl rand -base64 32
```

## 4. Database Schema

Ensure your database has a `clients` table with the following structure:

```sql
CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- Optional for Google OAuth users
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 5. Features

- **Sign Up**: Users can create accounts using email/password or Google OAuth
- **Sign In**: Users can authenticate using email/password or Google OAuth
- **Auto Registration**: Google OAuth users are automatically registered in the database
- **Session Management**: User sessions are managed using NextAuth JWT strategy

## Usage

- Visit `/signup` to create a new account
- Visit `/login` to sign in to an existing account
- Users can choose between email/password or Google OAuth for both signup and login
