import { Calendar, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { IEventDate } from '@/types/IEvent'

import { Card, CardContent } from './ui/card'

type EventCardProps = {
  eventDate: IEventDate
  onRemove?: (id: string) => void
}

export function EventCard({ eventDate, onRemove }: EventCardProps) {
  return (
    <Card key={eventDate.id} className="relative bg-muted/50">
      <CardContent className="p-4">
        <div className="flex w-full items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="mr-2 h-8 w-8 text-primaryPurple" />
            <div className="flex flex-col">
              <div>
                <span className="text-2xl">{eventDate.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {eventDate.date}
                </span>
                <span className="text-sm text-muted-foreground">
                  Das {eventDate.startTime} às {eventDate.endTime}
                </span>
              </div>
            </div>
          </div>
        </div>
        {onRemove && (
          <Button
            className="absolute right-2 top-2"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(eventDate.id)}
          >
            <Trash2 className="h-5 w-5 text-red-500" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
