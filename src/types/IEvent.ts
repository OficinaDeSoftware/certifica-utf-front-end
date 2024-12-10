export default interface IEvent {
  id: string
  name: string
  initialDate: string
  finalDate: string
  workload: number
  description: string
  location: IEventLocation
  eventDates: Array<IEventDate>
  image: string
  participants: number
  avaliation: number
}

export interface IEventLocation {
  description: string
  latitude: number
  longitude: number
  latitudeDelta: number
  longitudeDelta: number
  mapUrl: string
}

export interface IEventDate {
  id: string
  initialDate: string
  finalDate: string
}
