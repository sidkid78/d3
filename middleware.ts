import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // Mock Middleware: allow all
    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
