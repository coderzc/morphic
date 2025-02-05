import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.AUTH_PASSWORD;

    if (!correctPassword) {
      return NextResponse.json(
        { error: 'Authentication not configured' },
        { status: 500 }
      );
    }

    if (password === correctPassword) {
      // Create the response
      const response = NextResponse.json({ success: true });
      
      // Set the authentication cookie
      response.cookies.set('authenticated', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 