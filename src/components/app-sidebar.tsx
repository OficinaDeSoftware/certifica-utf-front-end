import { BadgeIcon as Certificate, Home, Plus, Trophy } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'

import logo from '@/assets/images/logo.svg'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import userRoleEnum from '@/enums/userRoleEnum'
import { authOptions } from '@/services/auth/nextAuth/authOptions'

export async function AppSidebar() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user) return null

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          className="flex items-center gap-3 px-4 py-6 font-semibold"
          href="#"
        >
          <Image src={logo} alt="Logo" className="h-10 w-10 object-contain" />
          <p className="text-2xl">CertificaUTF</p>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="px-7">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/event/list" className="px-7">
                <Trophy className="h-4 w-4" />
                <span>Eventos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {user.roles.includes(userRoleEnum.USER) && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/certificates" className="px-7">
                  <Certificate className="h-4 w-4" />
                  <span>Certificados</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {user.roles.includes(userRoleEnum.ADMIN) && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/event/new" className="px-7">
                  <Plus className="h-4 w-4" />
                  <span>Criar evento</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
