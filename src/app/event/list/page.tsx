import getFetchCertificaUTF from '@/utils/getFetchCertificaUTF'

import { EventCard } from './_components/event-card'

export default async function EventList() {
  const { sucess: events } = await (await getFetchCertificaUTF()).getEvents()

  return (
    <div className="mx-auto p-4">
      <h1 className="mb-8 text-2xl font-bold">Eventos</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {events &&
          events.map((event) => <EventCard key={event.id} event={event} />)}
        {!events && <p>Não há eventos disponíveis</p>}
        {}
      </div>
    </div>
  )
}
