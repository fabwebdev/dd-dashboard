import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Set your credentials here (or use environment variables)
const VALID_USERNAME = process.env.AUTH_USERNAME || 'admin';
const VALID_PASSWORD = process.env.AUTH_PASSWORD || 'P@ssW0rd9090!';

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  const [scheme, encoded] = authHeader.split(' ');

  if (scheme !== 'Basic' || !encoded) {
    return new NextResponse('Invalid authentication', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  const decoded = atob(encoded);
  const [username, password] = decoded.split(':');

  if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

