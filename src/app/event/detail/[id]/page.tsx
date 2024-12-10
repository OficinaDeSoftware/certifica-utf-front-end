import getFetchCertificaUTF from '@/utils/getFetchCertificaUTF'

import EventBanner from './_components/event-banner'
import EventDates from './_components/event-dates'
import EventDescription from './_components/event-description'
import EventDetails from './_components/event-details'
import EventMap from './_components/event-map'

interface EventDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function EventDetailsPage({
  params,
}: EventDetailsPageProps) {
  const { id } = await params

  const { sucess: event } = await (
    await getFetchCertificaUTF()
  ).getEventByIdMock(id)

  if (!event) {
    return <div>Evento não encontrado</div>
  }

  return (
    <div>
      <EventBanner eventName={event.name} eventImage={event.image} />

      <div className="space-y-8 p-8">
        <EventDetails
          initialDate={event.initialDate}
          finalDate={event.finalDate}
          workload={event.workload}
          locationDescription={event.location.description}
        />
        <EventDescription description={event.description} />
        <EventDates eventDates={event.eventDates} />

        <EventMap
          latitude={event.location.latitude}
          longitude={event.location.longitude}
        />
      </div>
    </div>
  )
}
