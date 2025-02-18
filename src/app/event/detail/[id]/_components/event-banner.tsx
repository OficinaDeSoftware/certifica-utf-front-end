import { CheckCircle, Info } from 'lucide-react'
import Image from 'next/image'

import eventStatusEnum from '@/enums/eventStatusEnum'
import { ISubscribed } from '@/types/IEvent'

interface EventBannerProps {
  eventName: string
  eventImage: string
  eventStatus: eventStatusEnum
  subscribed: ISubscribed | null
}

export default function EventBanner({
  eventName,
  eventImage,
  eventStatus,
  subscribed,
}: EventBannerProps) {
  const statusConfig = {
    [eventStatusEnum.IN_PROGRESS]: {
      icon: <Info className="h-6 w-6" />,
      color: 'text-green-900',
      label: subscribed && subscribed.subscribed ? 'Inscrito' : 'Em andamento',
    },
    [eventStatusEnum.FINISHED]: {
      icon: <Info className="h-6 w-6" />,
      color: 'text-red-900',
      label: 'Finalizado',
    },
    UNKNOWN: {
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'text-gray-500',
      label: 'STATUS DESCONHECIDO',
    },
  }

  const status = statusConfig[eventStatus] || statusConfig.UNKNOWN

  return (
    <div className="relative">
      <Image
        src={eventImage}
        alt=""
        width={1200}
        height={300}
        className="h-[300px] w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
      <h1 className="absolute bottom-8 left-8 text-3xl font-bold">
        {eventName}
      </h1>
      <div className="absolute bottom-8 right-8 flex items-center gap-2 rounded-lg bg-black/30 px-4 py-2">
        {status.icon}
        <span className={`font-bold ${status.color}`}>{status.label}</span>
      </div>
    </div>
  )
}
