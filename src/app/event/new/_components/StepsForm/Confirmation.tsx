import EventBanner from '@/app/event/detail/[id]/_components/event-banner'
import EventDates from '@/app/event/detail/[id]/_components/event-dates'
import EventDescription from '@/app/event/detail/[id]/_components/event-description'
import EventDetails from '@/app/event/detail/[id]/_components/event-details'
import EventMap from '@/app/event/detail/[id]/_components/event-map'
import IEvent from '@/types/IEvent'

type ConfirmationProps = {
  formData: IEvent
}
const Confirmation = ({ formData }: ConfirmationProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex w-full max-w-[1600px] flex-1 flex-col gap-4 md:gap-8">
        <EventBanner
          eventName={formData.name}
          eventImage={formData.backgroundImage.url || ''}
          eventStatus={formData.status}
          subscribed={null}
        />

        <EventDetails
          initialDate={formData.startDate}
          finalDate={formData.endDate}
          workload={formData.workload}
          locationDescription={formData.location.address}
          availableSpots={formData.location.capacity}
        />
        <EventDescription description={formData.description} />
        <EventDates eventDates={formData.dates} />

        <EventMap
          latitude={formData.location.coordinates.lat}
          longitude={formData.location.coordinates.lng}
        />
      </div>
    </div>
  )
}

export default Confirmation
