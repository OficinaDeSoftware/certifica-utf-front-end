import { Calendar, Clock, MapPin, Users } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

interface EventDetailsProps {
  initialDate: string
  finalDate: string
  workload: number
  locationDescription: string
  availableSpots: number
}

export default function EventDetails({
  initialDate,
  finalDate,
  workload,
  locationDescription,
  availableSpots,
}: EventDetailsProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Dados do evento</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primaryPurple" />
              <span>
                {initialDate} à {finalDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-primaryPurple" />
              <span>{workload}h Carga Hóraria</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Local</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-8 w-8 text-primaryPurple" />
              <div>
                <p>{locationDescription}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-primaryPurple" />
              <span>{availableSpots} Vagas</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
