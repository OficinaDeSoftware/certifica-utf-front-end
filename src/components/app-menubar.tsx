'use client'

import { useSession } from 'next-auth/react'

import { SidebarTrigger } from '@/components/ui/sidebar'

import AppNotificationsMenu from './app-notification-menu'
import AppProfileMenu from './app-profile-menu'

export default function AppMenubar() {
  const session = useSession()
  const user = session.data?.user

  if (!user) return null

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-gray-100 px-6 lg:h-[60px]">
      <SidebarTrigger />
      <div className="flex-1" />
      <AppNotificationsMenu />
      <AppProfileMenu />
    </header>
  )
}
