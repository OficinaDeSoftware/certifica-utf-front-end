/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// desabilitado no-unused-vars por enquanto para testes dos callbacks
import { Account, CallbacksOptions, User as UserNextAuth } from 'next-auth'
import { AdapterUser } from 'next-auth/adapters'

import authProviderEnum from '@/enums/authProvidersEnum'
import { loginWithGoogle } from '@/services/api/apiServices'
import logger from '@/services/winston/logger'
import User from '@/types/User'

type ISignInCallback = (
  user: UserNextAuth | AdapterUser,
  account: Account | null
) => Promise<boolean>

const signInWithGoogle: ISignInCallback = async (
  user: UserNextAuth | AdapterUser,
  account: Account | null
): Promise<boolean> => {
  try {
    if (!user || !account) return false

    const userGoogle = await loginWithGoogle(
      authProviderEnum.GOOGLE,
      account.id_token!
    )

    account.user = userGoogle

    return true
  } catch (error) {
    logger.log({
      level: 'error',
      message: '[signIn] error',
      objects: {
        error,
      },
    })

    return false
  }
}

const signInWithCredentials: ISignInCallback = async (
  user: UserNextAuth | AdapterUser,
  account: Account | null
): Promise<boolean> => {
  if (!user || !account) return false

  account.user = user

  return true
}

export const signInCallback: CallbacksOptions['signIn'] = async ({
  user,
  account,
  profile,
  email,
  credentials,
}) => {
  logger.log({
    level: 'debug',
    message: '[signIn]',
  })

  switch (account?.provider) {
    case authProviderEnum.GOOGLE: {
      return await signInWithGoogle(user, account)
    }
    case authProviderEnum.CREDENTIALS: {
      return await signInWithCredentials(user, account)
    }
    default: {
      return false
    }
  }
}

export const redirectCallback: CallbacksOptions['redirect'] = async ({
  url,
  baseUrl,
}) => {
  logger.log({
    level: 'debug',
    message: '[redirect]',
  })

  if (url.startsWith('/')) return `${baseUrl}${url}`
  else if (new URL(url).origin === baseUrl) return url
  return baseUrl
}

export const jwtCallback: CallbacksOptions['jwt'] = async ({
  token,
  user,
  account,
  profile,
  trigger,
  isNewUser,
  session,
}) => {
  logger.log({
    level: 'debug',
    message: '[jwt]',
  })

  const userAccont = account?.user as User

  return {
    ...userAccont,
  }
}

export const sessionCallback: CallbacksOptions['session'] = async ({
  session,
  token,
  user,
}) => {
  logger.log({
    level: 'debug',
    message: '[session]',
  })

  return {
    ...session,
  }
}
