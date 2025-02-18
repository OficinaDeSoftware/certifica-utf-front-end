import { getServerSession } from 'next-auth'
import Link from 'next/link'

import userRoleEnum from '@/enums/userRoleEnum'
import { authOptions } from '@/services/auth/nextAuth/authOptions'
import IEvent from '@/types/IEvent'
import getFetchCertificaUTF from '@/utils/getFetchCertificaUTF'

import { EventCard } from '../event/list/_components/event-card'

export default async function Home() {
  const session = await getServerSession(authOptions)
  if (!session) return null

  const isAdmin = session.user.roles.includes(userRoleEnum.ADMIN)
  let events = [] as Array<IEvent>

  if (isAdmin) {
    const { sucess: eventsResponsible } = await (
      await getFetchCertificaUTF()
    ).getEventsByResponsible(session.user.id)
    events = eventsResponsible || []
  } else {
    const { sucess: eventsParticipant } = await (
      await getFetchCertificaUTF()
    ).getEventsByParticipant(session.user.id)
    events = eventsParticipant || []
  }

  if (events.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex w-full max-w-[1200px] flex-1 flex-col gap-4 pb-4 pl-4 pr-4 md:gap-8 md:pb-6 md:pl-6 md:pr-6">
          <h1 className="mt-8 text-2xl font-bold">
            Você ainda não tem eventos {isAdmin ? 'criados' : 'inscritos'}
          </h1>

          <div className="mt-4">
            <Link
              href={isAdmin ? '/event/new' : '/event/list'}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              {isAdmin ? 'Criar Evento' : 'Ir para Eventos'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex w-full max-w-[1200px] flex-1 flex-col gap-4 pb-4 pl-4 pr-4 md:gap-8 md:pb-6 md:pl-6 md:pr-6">
          <h1 className="mt-8 text-2xl font-bold">
            Seus eventos {isAdmin ? 'criados' : 'inscritos'}
          </h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {events &&
              events.map((event) => <EventCard key={event.id} event={event} />)}
            {!events && <p>Não há eventos disponíveis</p>}
            {}
          </div>
        </div>
      </div>
    </>
  )
}
