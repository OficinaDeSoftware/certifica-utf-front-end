'use client'

import { useState, useMemo, useCallback } from 'react'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useLoadScript, GoogleMap } from '@react-google-maps/api'

// Update the Libraries type to include 'marker'
type Libraries = (
  | 'places'
  | 'drawing'
  | 'geometry'
  | 'visualization'
  | 'marker'
)[]

// Define libraries array outside of component to prevent unnecessary reloads
const libraries: Libraries = ['marker']

interface GoogleMapComponentProps {
  center: { lat: number; lng: number }
  zoom?: number
}

const GoogleMapComponent = ({ center, zoom = 15 }: GoogleMapComponentProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: libraries,
  })

  const centerMemo = useMemo(() => center, [center])

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      // TODO: Refatorar pra usar google.maps.marker.AdvancedMarkerElement
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      const marker = new google.maps.Marker({
        position: center,
        map: map,
      })

      // Adjust bounds to fit marker
      const bounds = new window.google.maps.LatLngBounds(center)
      map.fitBounds(bounds)

      setMap(map)
    },
    [center]
  )

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  if (loadError) {
    return (
      <Card className="flex h-full w-full items-center justify-center">
        <div className="text-destructive">Error loading Google Maps</div>
      </Card>
    )
  }

  if (!isLoaded) {
    return (
      <Card className="flex h-full w-full items-center justify-center">
        <Skeleton className="h-full w-full" />
      </Card>
    )
  }

  return (
    <Card className="h-full w-full overflow-hidden">
      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={centerMemo}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      />
    </Card>
  )
}

export default GoogleMapComponent
