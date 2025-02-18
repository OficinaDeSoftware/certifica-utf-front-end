import { getServerSession } from 'next-auth'

import { SidebarTrigger } from '@/components/ui/sidebar'
import userRoleEnum from '@/enums/userRoleEnum'
import { authOptions } from '@/services/auth/nextAuth/authOptions'

import AppNotificationsMenu from './app-notification-menu'
import AppProfileMenu from './app-profile-menu'

export default async function AppMenubar() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user) return null

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-gray-100 px-6 lg:h-[60px]">
      <SidebarTrigger />
      <p>
        Bem-vindo{' '}
        {user.roles.includes(userRoleEnum.ADMIN) ? 'Organizador' : 'Aluno'}
      </p>
      <div className="flex-1" />
      <AppNotificationsMenu />
      <AppProfileMenu />
    </header>
  )
}
