import { NextAuthOptions } from 'next-auth'

import {
  jwtCallback,
  redirectCallback,
  sessionCallback,
  signInCallback,
} from '@/services/auth/nextAuth/callbacks'
import {
  credentialProvider,
  googleProvider,
} from '@/services/auth/nextAuth/providers'

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  providers: [googleProvider, credentialProvider],
  callbacks: {
    signIn: signInCallback,
    redirect: redirectCallback,
    jwt: jwtCallback,
    session: sessionCallback,
  },
}
