import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

import userRoleEnum from './enums/userRoleEnum'

export default withAuth(
  async function middleware(req) {
    const {
      nextUrl: { pathname },
      nextauth: { token },
    } = req

    if (pathname.startsWith('/login') && token) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    if (['/', '/profile'].includes(pathname) && !token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (pathname.startsWith('/event/new')) {
      if (!token || !(token.roles as string[]).includes(userRoleEnum.ADMIN)) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const {
          nextUrl: { pathname },
        } = req

        return (!token && pathname.startsWith('/login')) || !!token
      },
    },
  }
)

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*.png$).*)'],
}
