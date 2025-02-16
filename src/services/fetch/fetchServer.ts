'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface IFetchServer {
  (
    input: string | URL | Request,
    init?: RequestInit | undefined
  ): Promise<Response>
}

export const fetchServer: IFetchServer = async (input, init) => {
  let response = new Response()

  try {
    const jwt = cookies().get('jwt')

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
    console.error(error)
  }

  return response
}
