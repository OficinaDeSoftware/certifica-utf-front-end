/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// desabilitado no-unused-vars por enquanto para testes dos callbacks
import { Account, CallbacksOptions, User as UserNextAuth } from 'next-auth'
import { AdapterUser } from 'next-auth/adapters'

import authProviderEnum from '@/enums/authProvidersEnum'
import CertificaUTF from '@/services/api/CertificaUTF/CertificaUTF'
import { sessionUser } from '@/types/next-auth'

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

    if (!account.id_token) return false

    const fetchAPI = new CertificaUTF()

    const { sucess: userGoogle, error: errorLoginWithGoogle } =
      await fetchAPI.loginWithGoogle(authProviderEnum.GOOGLE, account.id_token)

    if (!userGoogle) {
      throw errorLoginWithGoogle
    }

    account.user = {
      id: userGoogle.nrUuid,
      name: userGoogle.name,
      email: userGoogle.email,
      roles: userGoogle.roles,
      image: undefined,
      accessToken: userGoogle.accessToken,
    }

    return true
  } catch (error) {
    return false
  }
}

const signInWithCredentials: ISignInCallback = async (
  user: UserNextAuth | AdapterUser,
  account: Account | null
): Promise<boolean> => {
  if (!user || !account) return false

  account.user = {
    id: user.id,
    name: user.name!,
    email: user.email!,
    roles: user.roles,
    image: undefined,
    accessToken: user.accessToken,
  }

  return true
}

export const signInCallback: CallbacksOptions['signIn'] = async ({
  user,
  account,
  profile,
  email,
  credentials,
}) => {
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
  const customUser = account?.user

  return {
    ...token,
    ...customUser,
  }
}

export const sessionCallback: CallbacksOptions['session'] = async ({
  session,
  token,
  user,
}) => {
  const sessionUser: sessionUser = {
    id: token.id as string,
    email: token.email as string,
    name: token.name as string,
    image: token.image as string,
    roles: token.roles as Array<string>,
    accessToken: token.accessToken as string,
  }

  return {
    ...session,
    user: {
      ...sessionUser,
    },
  }
}
