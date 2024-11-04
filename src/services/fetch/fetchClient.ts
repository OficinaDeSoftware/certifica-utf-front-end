'use client'

import { getCookie } from 'cookies-next'
import { signOut } from 'next-auth/react'

interface IFetchCliente {
  (
    input: string | URL | Request,
    init?: RequestInit | undefined
  ): Promise<Response>
}

export const fetchClient: IFetchCliente = async (input, init) => {
  const jwt = getCookie('jwt')

  const response = await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      ...(jwt && { Authorization: `Bearer ${jwt}` }),
    },
  })

  if (response.status === 401) {
    signOut()
  }

  return response
}
