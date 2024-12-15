import { StatusCodes } from 'http-status-codes'

import authProviderEnum from '@/enums/authProvidersEnum'
import logger from '@/services/winston/logger'
import SomethingWentWrongError from '@/types/errors/SomethingWentWrongError'
import UnauthorizedError from '@/types/errors/UnauthorizedError'
import IEvent from '@/types/IEvent'
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
        id: event.id,
        name: event.name,
        initialDate: event.initialDate,
        finalDate: event.finalDate,
        workload: event.workload,
        description: event.description,
        location: event.location,
        eventDates: event.eventDates,
        image: event.image,
        participants: event.participants,
        avaliation: event.avaliation,
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

      const response = await this.FetchWrapper.post(apiEndpointsEnum.LOGIN, {
        body: JSON.stringify({
          typeProvider: typeProviderUTFPR,
          login: ra,
          password: password,
        }),
      })

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
      logger.log({
        level: 'error',
        message: '[loginWithGoogle] error',
        objects: {
          error,
        },
      })
      return { sucess: null, error: error }
    }
  }

  async loginWithGoogle(
    typeProvider: authProviderEnum,
    idToken: string
  ): Promise<IResponseHandler<IUser, unknown>> {
    try {
      const response = await this.FetchWrapper.post(apiEndpointsEnum.LOGIN, {
        body: JSON.stringify({
          typeProvider: typeProvider.toUpperCase(),
          idToken,
        }),
      })

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
      logger.log({
        level: 'error',
        message: '[loginWithGoogle] error',
        objects: {
          error,
        },
      })
      return { sucess: null, error: error }
    }
  }

  async getEvents(): Promise<IResponseHandler<Array<IEvent>, unknown>> {
    try {
      const response = await this.FetchWrapper.get(
        apiEndpointsEnum.EVENT_FIND_ALL
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
      logger.log({
        level: 'error',
        message: '[getEvents] error',
        objects: {
          error,
        },
      })
      return { sucess: null, error: error }
    }
  }

  async getEventsMock(): Promise<IResponseHandler<Array<IEvent>, unknown>> {
    const mockEvents: Array<IEvent> = [
      {
        id: '1',
        name: 'Liderança e Gestão de Equipes em Tempos de Mudança',
        initialDate: '2024-03-12',
        finalDate: '2024-03-12',
        workload: 4,
        description:
          'Uma palestra sobre como liderar equipes com empatia e resiliência, especializando em cenários de mudança radical.',
        location: {
          description: 'B2-S5',
          latitude: -23.6,
          longitude: -46.7,
          latitudeDelta: 0,
          longitudeDelta: 0,
          mapUrl: '',
        },
        eventDates: [
          {
            id: '1',
            initialDate: '2024-05-05',
            finalDate: '2024-05-05',
          },
          {
            id: '2',
            initialDate: '2024-05-05',
            finalDate: '2024-05-05',
          },
        ],
        image:
          'https://upload.wikimedia.org/wikipedia/commons/7/75/La_caza_salvaje_de_Od%C3%ADn%2C_por_Peter_Nicolai_Arbo.jpg',
        participants: 65,
        avaliation: 111,
      },
      {
        id: '2',
        name: 'Marketing Digital para Pequenos Negócios',
        initialDate: '2024-04-20',
        finalDate: '2024-04-20',
        workload: 4,
        description:
          'Workshop voltado para empreendedores e profissionais da indústria que querem aprender estratégias eficazes para atrair clientes.',
        location: {
          description: 'B2-S5',
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0,
          longitudeDelta: 0,
          mapUrl: '',
        },
        eventDates: [
          {
            id: '1',
            initialDate: '2024-05-05',
            finalDate: '2024-05-05',
          },
          {
            id: '2',
            initialDate: '2024-05-05',
            finalDate: '2024-05-05',
          },
        ],
        image:
          'https://upload.wikimedia.org/wikipedia/commons/7/75/La_caza_salvaje_de_Od%C3%ADn%2C_por_Peter_Nicolai_Arbo.jpg',
        participants: 485,
        avaliation: 100,
      },
      {
        id: '3',
        name: 'Introdução ao Design de Interfaces Intuitivas',
        initialDate: '2024-05-05',
        finalDate: '2024-05-05',
        workload: 4,
        description:
          'Mini-curso prático que ensina os fundamentos do design UI/UX com interfaces mais acessíveis e fáceis de usar.',
        location: {
          description: 'B2-S5',
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0,
          longitudeDelta: 0,
          mapUrl: '',
        },
        eventDates: [
          {
            id: '1',
            initialDate: '2024-05-05',
            finalDate: '2024-05-05',
          },
          {
            id: '2',
            initialDate: '2024-05-05',
            finalDate: '2024-05-05',
          },
        ],
        image:
          'https://upload.wikimedia.org/wikipedia/commons/7/75/La_caza_salvaje_de_Od%C3%ADn%2C_por_Peter_Nicolai_Arbo.jpg',
        participants: 1000,
        avaliation: 154,
      },
    ]

    return new Promise<IResponseHandler<Array<IEvent>, unknown>>((resolve) => {
      setTimeout(() => {
        resolve({ sucess: mockEvents, error: null })
      }, 1000)
    })
  }

  async getEventByIdMock(
    id: string
  ): Promise<IResponseHandler<IEvent, unknown>> {
    const { sucess: mockEvents } = await this.getEventsMock()

    if (!mockEvents) throw new SomethingWentWrongError('Algo deu errado')

    const event = mockEvents.find((event) => event.id === id)

    if (!event) throw new SomethingWentWrongError('Algo deu errado')

    return { sucess: event, error: null }
  }
}
