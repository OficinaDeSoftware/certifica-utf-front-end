import getFetchCertificaUTF from '@/utils/getFetchCertificaUTF'

import { EventCard } from './_components/event-card'

export default async function EventList() {
  const { sucess: events } = await (await getFetchCertificaUTF()).getEvents()

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex w-full max-w-[1200px] flex-1 flex-col gap-4 pb-4 pl-4 pr-4 md:gap-8 md:pb-6 md:pl-6 md:pr-6">
          <h1 className="mt-8 text-2xl font-bold">Eventos</h1>
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
