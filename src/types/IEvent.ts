export default interface IEvent {
  id: string
  name: string
  startDate: string
  endDate: string
  dates: Array<IEventDate>
  workload: number
  description: string
  backgroundImage: IBackgroundImage
  location: IEventLocation
  certificate: IEventCertificate
}

export interface IEventLocation {
  address: string
  complement: string
  capacity: number
  coordinates: { lat: number; lng: number }
}

export interface IEventDate {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
}

export interface IEventCertificate {
  modelId: string
  complement: string
  issuerLogoImage: IBackgroundImage
  responsible: IEventResponsible
}

export interface IEventResponsible {
  signature: string
  occupation: string
}

export interface IBackgroundImage {
  file?: File
  url?: string
}
