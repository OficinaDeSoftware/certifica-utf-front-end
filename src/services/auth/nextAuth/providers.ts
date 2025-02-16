import { User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

import authProviderEnum from '@/enums/authProvidersEnum'
import CertificaUTF from '@/services/api/CertificaUTF/CertificaUTF'

async function authorizeCredentials(
  credentials: Record<'ra' | 'password', string> | undefined
): Promise<User | null> {
  const userRa = credentials?.ra
  const userPassword = credentials?.password

  if (!userRa || !userPassword) {
    return null
  }

  try {
    const fetchAPI = new CertificaUTF()

    const { sucess: user, error: errorLoginWithCredentials } =
      await fetchAPI.loginWithCredentials(
        authProviderEnum.CREDENTIALS,
        userRa,
        userPassword
      )

    if (!user) {
      throw errorLoginWithCredentials
    }

    return {
      id: user.nrUuid,
      email: user.email,
      name: user.name,
      image: null,
      roles: user.roles,
      accessToken: user.accessToken,
    }
  } catch (error) {
    console.log(error)
    return null
  }
}

export const googleProvider = Google({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
})

export const credentialProvider = Credentials({
  credentials: {
    ra: {},
    password: {},
  },
  name: 'UTFPR',
  async authorize(credentials) {
    return await authorizeCredentials(credentials)
  },
})
