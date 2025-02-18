'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'

import { CheckCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import eventStatusEnum from '@/enums/eventStatusEnum'
import userRoleEnum from '@/enums/userRoleEnum'
import {
  finishEventService,
  subscribeEventService,
} from '@/services/api/CertificaUTF/certificate'
import IEvent, { ISubscribed } from '@/types/IEvent'

const EventFooter = ({
  event,
  subscribed,
}: {
  event: IEvent
  subscribed: ISubscribed | null
}) => {
  const { data: session } = useSession()
  const user = session?.user
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  if (!user) return null

  const isAdmin = user.roles.includes(userRoleEnum.ADMIN)

  const handleSubscribeEvent = async () => {
    await subscribeEventService({
      id: event.id,
      nrUuidParticipant: user.id,
    })
      .then((response) => {
        if (response.sucess) {
          toast.success('Inscricao realizada com sucesso!')
        }
      })
      .catch((error) => {
        console.error(error)
        toast.error('Erro ao realizar inscricao!')
      })
  }

  const handleFinishEvent = async () => {
    await finishEventService({ id: event.id })
      .then((response) => {
        if (response.sucess) {
          setShowSuccessDialog(true)
          toast.success('Evento finalizado com sucesso!')
        }
      })
      .catch((error) => {
        console.error(error)
        toast.error('Erro ao encerrar evento')
      })
  }

  if (event.status === eventStatusEnum.FINISHED) {
    return null
  }

  if (!isAdmin && subscribed && subscribed.subscribed) {
    return null
  }

  return (
    <>
      <div className="flex w-full justify-end gap-3">
        <Button
          onClick={() => {
            if (isAdmin) {
              handleFinishEvent()
            } else {
              handleSubscribeEvent()
            }
          }}
          size="lg"
          className="min-h-12"
        >
          {isAdmin ? 'Encerrar' : 'Increver-se'}
        </Button>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <DialogTitle className="text-center text-lg font-semibold">
              Sucesso! Disparando certificados e enviando emails aos
              participantes do evento
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EventFooter
