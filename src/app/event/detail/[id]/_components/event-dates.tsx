import { Calendar } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { IEventDate } from '@/types/IEvent'

interface EventDatesProps {
  eventDates: Array<IEventDate>
}

export default function EventDates({ eventDates }: EventDatesProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Datas</h2>
      <div className="space-y-2">
        {eventDates.map((eventDate) => (
          <Card key={eventDate.id} className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex w-full items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="mr-2 h-8 w-8 text-primaryPurple" />
                  <span className="text-sm text-muted-foreground">
                    {new Date(eventDate.initialDate).toLocaleDateString(
                      'pt-BR'
                    )}{' '}
                    à{' '}
                    {new Date(eventDate.finalDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
