import GoogleMapComponent from '@/components/google-map-component'

interface EventMapProps {
  latitude: number
  longitude: number
}

export default function EventMap({ latitude, longitude }: EventMapProps) {
  console.log(latitude, longitude)
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Localização</h2>
      <div className="aspect-video w-full overflow-hidden rounded-lg border">
        <GoogleMapComponent
          center={{
            lat: latitude,
            lng: longitude,
          }}
        />
      </div>
    </div>
  )
}
