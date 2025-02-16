'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useLoadScript, GoogleMap } from '@react-google-maps/api'

type Libraries = (
  | 'places'
  | 'drawing'
  | 'geometry'
  | 'visualization'
  | 'marker'
)[]
const libraries: Libraries = ['places', 'marker']

interface GoogleMapComponentProps {
  center: { lat: number; lng: number }
  zoom?: number
  onLocationSelect?: (lat: number, lng: number) => void
}

const GoogleMapComponent = ({
  center,
  zoom = 15,
  onLocationSelect,
}: GoogleMapComponentProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  )

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: libraries,
  })

  const centerMemo = useMemo(
    () => markerPosition || center,
    [markerPosition, center]
  )

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLocation = { lat: event.latLng.lat(), lng: event.latLng.lng() }
      setMarkerPosition(newLocation)
      onLocationSelect?.(newLocation.lat, newLocation.lng)
    }
  }

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  useEffect(() => {
    if (isLoaded && map && markerPosition) {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: markerPosition,
        gmpDraggable: true,
      })

      markerRef.current = marker

      marker.addListener('dragend', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const newLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          }
          setMarkerPosition(newLocation)
          onLocationSelect?.(newLocation.lat, newLocation.lng)
        }
      })

      return () => {
        if (markerRef.current) {
          markerRef.current.map = null
        }
      }
    }
  }, [isLoaded, map, markerPosition])

  useEffect(() => {
    if (isLoaded && searchInputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(
        searchInputRef.current,
        {
          types: ['establishment'],
        }
      )

      const placeChangedListener = autocomplete.addListener(
        'place_changed',
        () => {
          const place = autocomplete.getPlace()
          if (!place.geometry || !place.geometry.location) {
            console.error('No details available for input:', place.name)
            return
          }

          const newLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }

          setMarkerPosition(newLocation)
          map?.panTo(newLocation)
          onLocationSelect?.(newLocation.lat, newLocation.lng)
        }
      )

      return () => {
        google.maps.event.removeListener(placeChangedListener)
      }
    }
  }, [isLoaded, map])

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
      {onLocationSelect && (
        <div className="p-4">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar local..."
            className="w-full rounded border p-2"
          />
        </div>
      )}
      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={centerMemo}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
        }}
      />
    </Card>
  )
}

export default GoogleMapComponent
