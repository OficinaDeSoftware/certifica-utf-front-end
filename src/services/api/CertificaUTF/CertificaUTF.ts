import { StatusCodes } from 'http-status-codes'

import authProviderEnum from '@/enums/authProvidersEnum'
import SomethingWentWrongError from '@/types/errors/SomethingWentWrongError'
import UnauthorizedError from '@/types/errors/UnauthorizedError'
import IEvent, { ISubscribed } from '@/types/IEvent'
import IResponseHandler from '@/types/IResponseHandler.'
import IUser from '@/types/IUser'
import FetchWrapper from '@/utils/FetchWrapper/FetchWrapper'

import apiEndpointsEnum from './endpointsEnum'

export default class CertificaUTF {
  private FetchWrapper: FetchWrapper

  constructor(token: string = '') {
    this.FetchWrapper = new FetchWrapper(
      process.env.NEXT_PUBLIC_API_BASE_URL as string,
      token
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseResponseToIUserDto(data: any): IUser {
    return {
      nrUuid: data.nrUuid,
      name: data.name,
      email: data.email,
      accessToken: data.accessToken,
      roles: data.roles,
    } as IUser
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseResponseToArrayOfIEvent(data: any): Array<IEvent> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const events: Array<IEvent> = data.map((event: any) => {
      return {
        id: event?.idEvent || event?.id,
        name: event?.name,
        startDate: event?.startDate,
        endDate: event?.endDate,
        dates: event?.dates,
        certificate: {
          ...event?.certificate,
          issuerLogoImage: {
            url: event?.certificate?.issuerLogoUrl,
          },
        },
        description: event?.description,
        backgroundImage: {
          url: event?.backgroundUrl,
        },
        workload: event?.workload,
        location: {
          ...event?.location,
          coordinates: {
            lat: event?.location?.coordinates?.latitude,
            lng: event?.location?.coordinates?.longitude,
          },
        },
        participantsCount: event?.participantsCount,
        status: event?.status,
      } as IEvent
    })

    return events
  }

  async loginWithCredentials(
    typeProvider: authProviderEnum,
    ra: string,
    password: string
  ): Promise<IResponseHandler<IUser, unknown>> {
    try {
      const typeProviderUTFPR =
        typeProvider === authProviderEnum.CREDENTIALS ? 'UTFPR' : 'CREDENTIALS'

      const response = await this.FetchWrapper.postNoToken(
        apiEndpointsEnum.LOGIN,
        {
          body: JSON.stringify({
            typeProvider: typeProviderUTFPR,
            login: ra,
            password: password,
          }),
        }
      )

      if (response.status === StatusCodes.OK) {
        const data = await response.json()
        const userLogin = this.parseResponseToIUserDto(data)

        return { sucess: userLogin, error: null }
      }

      if (response.status === StatusCodes.UNAUTHORIZED) {
        throw new UnauthorizedError(
          'Você não tem permissão para realizar esta operação'
        )
      }

      throw new SomethingWentWrongError('Algo deu errado')
    } catch (error) {
      return { sucess: null, error: error }
    }
  }

  async loginWithGoogle(
    typeProvider: authProviderEnum,
    idToken: string
  ): Promise<IResponseHandler<IUser, unknown>> {
    try {
      const response = await this.FetchWrapper.postNoToken(
        apiEndpointsEnum.LOGIN,
        {
          body: JSON.stringify({
            typeProvider: typeProvider.toUpperCase(),
            idToken,
          }),
        }
      )

      if (response.status === StatusCodes.OK) {
        const data = await response.json()
        const userLogin = this.parseResponseToIUserDto(data)

        return { sucess: userLogin, error: null }
      }

      if (response.status === StatusCodes.UNAUTHORIZED) {
        throw new UnauthorizedError(
          'Você não tem permissão para realizar esta operação'
        )
      }

      throw new SomethingWentWrongError('Algo deu errado')
    } catch (error) {
      return { sucess: null, error: error }
    }
  }

  async getEvents(): Promise<IResponseHandler<Array<IEvent>, unknown>> {
    try {
      const response = await this.FetchWrapper.get(
        (process.env.NEXTAUTH_URL as string) + apiEndpointsEnum.EVENT_FIND_ALL
      )

      if (response.status === StatusCodes.OK) {
        const data = await response.json()
        const events = this.parseResponseToArrayOfIEvent(data)

        return { sucess: events, error: null }
      }

      if (response.status === StatusCodes.UNAUTHORIZED) {
        throw new UnauthorizedError(
          'Você não tem permissão para realizar esta operação'
        )
      }

      throw new SomethingWentWrongError('Algo deu errado')
    } catch (error) {
      console.log(error)
      return { sucess: null, error: error }
    }
  }

  async getEventsByResponsible(
    responsibleId: string
  ): Promise<IResponseHandler<Array<IEvent>, unknown>> {
    try {
      const response = await this.FetchWrapper.get(
        (process.env.NEXTAUTH_URL as string) +
          apiEndpointsEnum.EVENT_FIND_ALL +
          `?responsible=${responsibleId}`
      )

      if (response.status === StatusCodes.OK) {
        const data = await response.json()
        const events = this.parseResponseToArrayOfIEvent(data)

        return { sucess: events, error: null }
      }

      if (response.status === StatusCodes.UNAUTHORIZED) {
        throw new UnauthorizedError(
          'Você não tem permissão para realizar esta operação'
        )
      }

      throw new SomethingWentWrongError('Algo deu errado')
    } catch (error) {
      console.log(error)
      return { sucess: null, error: error }
    }
  }

  async getEventsByParticipant(
    participantId: string
  ): Promise<IResponseHandler<Array<IEvent>, unknown>> {
    try {
      const response = await this.FetchWrapper.get(
        (process.env.NEXTAUTH_URL as string) +
          apiEndpointsEnum.EVENT_FIND_ALL +
          `?participant=${participantId}`
      )

      if (response.status === StatusCodes.OK) {
        const data = await response.json()
        const events = this.parseResponseToArrayOfIEvent(data)

        return { sucess: events, error: null }
      }

      if (response.status === StatusCodes.UNAUTHORIZED) {
        throw new UnauthorizedError(
          'Você não tem permissão para realizar esta operação'
        )
      }

      throw new SomethingWentWrongError('Algo deu errado')
    } catch (error) {
      console.log(error)
      return { sucess: null, error: error }
    }
  }

  async getEventById(id: string): Promise<IResponseHandler<IEvent, unknown>> {
    try {
      const response = await this.FetchWrapper.get(
        (process.env.NEXTAUTH_URL as string) +
          apiEndpointsEnum.EVENT_FIND_ALL +
          `/${id}`
      )

      if (response.status === StatusCodes.OK) {
        const data = await response.json()
        const event = this.parseResponseToArrayOfIEvent([{ ...data }])[0]

        return { sucess: event, error: null }
      }

      if (response.status === StatusCodes.UNAUTHORIZED) {
        throw new UnauthorizedError(
          'Você não tem permissão para realizar esta operação'
        )
      }

      throw new SomethingWentWrongError('Algo deu errado')
    } catch (error) {
      console.log(error)
      return { sucess: null, error: error }
    }
  }

  async getSubscribed(
    id: string,
    eventId: string
  ): Promise<IResponseHandler<ISubscribed, unknown>> {
    try {
      const response = await this.FetchWrapper.get(
        (process.env.NEXTAUTH_URL as string) +
          apiEndpointsEnum.SUBSCRIBE_PARTICIPANT +
          `/subscribed?id=${id}&idEvent=${eventId}`
      )

      if (response.status === StatusCodes.OK) {
        const data = await response.json()

        return { sucess: data as ISubscribed, error: null }
      }

      if (response.status === StatusCodes.UNAUTHORIZED) {
        throw new UnauthorizedError(
          'Você não tem permissão para realizar esta operação'
        )
      }

      throw new SomethingWentWrongError('Algo deu errado')
    } catch (error) {
      console.log(error)
      return { sucess: null, error: error }
    }
  }

  async deleteEvent(id: string): Promise<IResponseHandler<boolean, unknown>> {
    try {
      const response = await this.FetchWrapper.delete(
        `${process.env.NEXTAUTH_URL as string}${apiEndpointsEnum.EVENT_DELETE}/${id}`
      )

      if (response.status === StatusCodes.OK) {
        return { sucess: true, error: null }
      }

      if (response.status === StatusCodes.UNAUTHORIZED) {
        throw new UnauthorizedError(
          'Você não tem permissão para realizar esta operação'
        )
      }

      throw new SomethingWentWrongError('Algo deu errado ao excluir o evento')
    } catch (error) {
      console.error('Erro ao excluir o evento:', error)
      return { sucess: false, error: error }
    }
  }
}
