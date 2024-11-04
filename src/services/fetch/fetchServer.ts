'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import logger from '@/services/winston/logger'

interface IFetchServer {
  (
    input: string | URL | Request,
    init?: RequestInit | undefined
  ): Promise<Response>
}

export const fetchServer: IFetchServer = async (input, init) => {
  let response = new Response()

  try {
    const jwt = (await cookies()).get('jwt')

    response = await fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        ...(jwt && { Authorization: `Bearer ${jwt}` }),
      },
    })

    if (response.status === 401) {
      redirect('/login')
    }
  } catch (error) {
    logger.log({
      level: 'error',
      message: '[fetchServer]',
      objects: {
        error,
      },
    })
  }

  return response
}
