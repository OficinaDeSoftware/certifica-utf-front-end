import { User } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { authOptions } from '@/services/auth/nextAuth/authOptions'

import { AppProfileMenuLogout } from './app-profile-menu-logout'
import { ProfileAvatar } from './profile-avatar'

export default async function AppProfileMenu() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user) return null
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button className="h-8 w-8 p-0" variant="ghost">
          <ProfileAvatar
            profileImageUrl={user.email}
            profileName={user.name}
            profileImageFallback={user.name}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={'/profile'}>
            <DropdownMenuItem>
              <User />
              <span>Meu Perfil</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <AppProfileMenuLogout />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
