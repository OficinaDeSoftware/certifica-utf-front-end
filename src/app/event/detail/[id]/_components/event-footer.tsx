'use client'

import { toast } from 'react-toastify'

import { useSession } from 'next-auth/react'

import { Button } from '@/components/ui/button'
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
  )
}

export default EventFooter
