import { User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

import authProviderEnum from '@/enums/authProvidersEnum'
import { loginWithCredentials } from '@/services/api/apiServices'
import logger from '@/services/winston/logger'

async function authorizeCredentials(
  credentials: Record<'ra' | 'password', string> | undefined
): Promise<User | null> {
  const userRa = credentials?.ra
  const userPassword = credentials?.password

  if (!userRa || !userPassword) {
    return null
  }

  try {
    const user = await loginWithCredentials(
      authProviderEnum.CREDENTIALS,
      userRa,
      userPassword
    )

    return {
      id: user.nrUuid,
      ...user,
    }
  } catch (error) {
    logger.log({
      level: 'error',
      message: '[ credentialProvider authorize] error',
      objects: {
        error,
      },
    })
    return null
  }
}

export const googleProvider = Google({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
})

export const credentialProvider = Credentials({
  credentials: {
    ra: { label: 'RA', type: 'text' },
    password: { label: 'Senha', type: 'password' },
  },
  name: 'UTFPR',
  async authorize(credentials) {
    return await authorizeCredentials(credentials)
  },
})
