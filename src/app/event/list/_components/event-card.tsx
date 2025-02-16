import Image from 'next/image'
import Link from 'next/link'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import IEvent from '@/types/IEvent'

interface EventCardProps {
  event: IEvent
}

export async function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/event/detail/${event.id}`}>
      <Card className="flex h-72 gap-4 p-4 transition-colors hover:bg-accent">
        <Image
          src={event.backgroundImage.url || ''}
          alt={event.name}
          width={300}
          height={300}
          quality={100}
          className="w-1/3 rounded-lg object-cover"
        />
        <div className="space-y-2">
          <CardHeader className="p-0">
            <div className="text-sm text-muted-foreground">{'<Tag>'}</div>
            <h3 className="font-semibold">{event.name}</h3>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-sm text-muted-foreground">{event.description}</p>
            <p className="mt-2 text-sm">{event.startDate}</p>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}
