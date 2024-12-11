'use client'

import { LogOut } from 'lucide-react'

import { useSignOut } from '@/hooks/useSignOut'

import { DropdownMenuItem, DropdownMenuShortcut } from './ui/dropdown-menu'

export function AppProfileMenuLogout() {
  const { triggerSignOut } = useSignOut()

  const handleSignOut = async () => {
    triggerSignOut()
  }

  return (
    <DropdownMenuItem onClick={() => handleSignOut()}>
      <LogOut />
      <span>Sair</span>
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  )
}
