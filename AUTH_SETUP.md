# Custom Authentication Setup Guide

## Overview

This project uses a custom authentication system (no Clerk) that you can easily integrate with your own external API.

## Current Setup

### Mock Authentication

- **Location**: `lib/mockauth.ts`
- **Mock Users**:
  - Email: `recruiter@example.com` | Password: `password123` | Role: `recruiter`
  - Email: `applicant@example.com` | Password: `password123` | Role: `applicant`

### Authentication Flow

1. **Login/Signup**: User submits credentials via forms in `/app/(auth)/`
2. **API Routes**: Requests go to `/api/auth/login`, `/api/auth/signup`, `/api/auth/logout`
3. **Auth Context**: `AuthContext` manages user state globally
4. **Protected Routes**: Middleware redirects unauthenticated users to `/login`

## File Structure

\`\`\`
lib/
├── auth-context.ts # Auth context and useAuth hook
├── mockauth.ts # Mock authentication functions
└── types.ts # TypeScript interfaces

app/
├── providers.tsx # Auth provider wrapper
├── api/auth/
│ ├── login/route.ts # Login endpoint
│ ├── signup/route.ts # Signup endpoint
│ ├── logout/route.ts # Logout endpoint
│ └── me/route.ts # Get current user
├── (auth)/
│ ├── sign-in/page.tsx # Login page
│ └── sign-up/page.tsx # Signup page
└── (dashboard)/ # Protected routes

components/
├── login-form.tsx # Login form component
├── signup-form.tsx # Signup form component
└── navbar.tsx # Navbar with logout
\`\`\`

## How to Integrate Your Own API

### Step 1: Update Mock Auth Functions

Replace the mock functions in `lib/mockauth.ts` with your API calls:

\`\`\`typescript
// lib/mockauth.ts
export async function mockLogin(email: string, password: string) {
// Replace with your API call
const response = await fetch('https://your-api.com/auth/login', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email, password }),
})

if (!response.ok) throw new Error('Login failed')
return response.json()
}

export async function mockSignup(email: string, password: string, name: string, role: string) {
// Replace with your API call
const response = await fetch('https://your-api.com/auth/signup', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email, password, name, role }),
})

if (!response.ok) throw new Error('Signup failed')
return response.json()
}
\`\`\`

### Step 2: Update API Routes (Optional)

If you want to keep the Next.js API routes as a proxy:

\`\`\`typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
try {
const { email, password } = await request.json()

    // Call your external API
    const response = await fetch('https://your-api.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) throw new Error('Login failed')
    const user = await response.json()

    // Set auth token in cookie
    const res = NextResponse.json({ user })
    const cookieStore = await 
    res.cookies.set('ats-token', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return res

} catch (error) {
return NextResponse.json({ error: (error as Error).message }, { status: 401 })
}
}
\`\`\`

### Step 3: Update Auth Context (If Needed)

If your API returns different user data structure, update `lib/auth-context.ts`:

\`\`\`typescript
export interface User {
id: string
email: string
name: string
role: 'recruiter' | 'applicant'
// Add any additional fields your API returns
}
\`\`\`

## Authentication Flow Diagram

\`\`\`
User Login/Signup
↓
Form Submit
↓
/api/auth/login or /api/auth/signup
↓
Mock Auth (or Your API)
↓
Set Cookie + Return User
↓
Update AuthContext
↓
Redirect to Dashboard
\`\`\`

## Protected Routes

Routes that require authentication:

- `/dashboard`
- `/jobs`
- `/jobs/create`
- `/jobs/[jobId]`
- `/jobs/[jobId]/applicants`

Unauthenticated users are redirected to `/login` via middleware.

## Using Auth in Components

\`\`\`typescript
'use client'

import { useAuth } from '@/lib/auth-context'

export function MyComponent() {
const { user, isAuthenticated, login, logout } = useAuth()

return (

<div>
{isAuthenticated && <p>Welcome, {user?.name}</p>}
</div>
)
}
\`\`\`

## Token Management

- **Storage**: Cookies (httpOnly for security)
- **Duration**: 7 days
- **Refresh**: Automatic on page load via `/api/auth/me`

## Troubleshooting

### User not persisting after refresh

- Check if cookies are being set correctly
- Verify `/api/auth/me` endpoint is working
- Check browser console for errors

### Login/Signup not working

- Verify API endpoint URLs
- Check network tab in browser DevTools
- Ensure CORS is configured if using external API

### Protected routes not redirecting

- Check middleware.ts configuration
- Verify cookie is being set
- Clear browser cookies and try again
