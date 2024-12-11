import { getServerSession } from 'next-auth'

import { authOptions } from '@/services/auth/nextAuth/authOptions'

export default async function getServerAcessToken() {
  const session = await getServerSession(authOptions)

  return session?.user.accessToken
}
