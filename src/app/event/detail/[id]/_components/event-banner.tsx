import Image from 'next/image'

interface EventBannerProps {
  eventName: string
  eventImage: string
}

export default function EventBanner({
  eventName,
  eventImage,
}: EventBannerProps) {
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
    </div>
  )
}
