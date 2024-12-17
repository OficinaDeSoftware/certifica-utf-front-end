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
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex w-full max-w-[1600px] flex-1 flex-col gap-4 pb-4 pl-4 pr-4 md:gap-8 md:pb-6 md:pl-6 md:pr-6">
        <EventBanner eventName={event.name} eventImage={event.image} />

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
