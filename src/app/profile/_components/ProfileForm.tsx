import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { generateQRCode } from '@/services/qrcode/generateQRCode'
import { sessionUser } from '@/types/next-auth'

interface ProfileFormProps {
  user: sessionUser
}

export async function ProfileForm({ user }: ProfileFormProps) {
  const qrCode = await generateQRCode(user.id)

  return (
    <div className="grid gap-6">
      <div>
        <label className="text-sm font-medium" htmlFor="name">
          Nome
        </label>
        <Input
          className="mt-2"
          id="name"
          placeholder="Nome completo"
          value={user.name}
        />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <Input
          className="mt-2"
          id="email"
          placeholder="ex@gmail.com"
          type="email"
          value={user.email}
        />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="id">
          Identificador
        </label>
        <Input className="mt-2" id="id" placeholder="ID" value={user.id} />
      </div>
      <div>
        <h2 className="mb-4 text-lg font-medium">Meu QR Code</h2>
        <div className="flex justify-center">
          <div className="rounded-lg border bg-white p-4">
            <Image
              alt="QR Code"
              className="aspect-square"
              height={200}
              src={qrCode}
              width={200}
            />
          </div>
        </div>
      </div>
      <Button className="w-full bg-purple-600 hover:bg-purple-700">
        Salvar
      </Button>
    </div>
  )
}
