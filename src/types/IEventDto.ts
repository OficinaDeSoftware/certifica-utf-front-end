import ICertificateDto from './ICertificateDto'
import IDateEventDto from './IDateEventDto'
import IUserDto from './IUserDto'

export default interface IEventDto {
  idEvent: string
  name: string
  dateStart: string
  dateEnd: string
  workload: number
  informations: string
  nrUuidAccountable: string
  participants: IUserDto[]
  dates: IDateEventDto[]
  certificate?: ICertificateDto
}
