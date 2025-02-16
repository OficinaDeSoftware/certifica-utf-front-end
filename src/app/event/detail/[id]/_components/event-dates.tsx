import { EventCard } from '@/components/event-card'
import { IEventDate } from '@/types/IEvent'

interface EventDatesProps {
  eventDates: Array<IEventDate>
}

export default function EventDates({ eventDates }: EventDatesProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Horários</h2>
      <div className="space-y-2">
        {eventDates.map((eventDate: IEventDate) => (
          <EventCard key={eventDate.id} eventDate={eventDate} />
        ))}
      </div>
    </div>
  )
}
