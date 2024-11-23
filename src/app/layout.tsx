import type { Metadata } from 'next'

import './globals.css'

import AppMenubar from '@/components/app-menubar'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { SessionProvider } from '@/providers/SessionProvider'

export const metadata: Metadata = {
  title: {
    template: '%s | CertificaUTF',
    default: 'CertificaUTF',
  },
  description: 'Sistema de Emissão de Certificados',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SessionProvider>
      <html lang="pt-br">
        <body>
          <SidebarProvider>
            <div className={cn('grid min-h-screen w-full')}>
              <div className={cn('flex')}>
                <AppSidebar />
                <div className={cn('max-w-screen flex w-full flex-1 flex-col')}>
                  <AppMenubar />
                  <main>{children}</main>
                </div>
              </div>
            </div>
          </SidebarProvider>
        </body>
      </html>
    </SessionProvider>
  )
}
