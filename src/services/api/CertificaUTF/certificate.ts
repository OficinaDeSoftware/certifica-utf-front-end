import { getSession } from 'next-auth/react'

import ICertificate from '@/types/ICertificate'
import IEvent from '@/types/IEvent'
import IResponseHandler from '@/types/IResponseHandler.'

import apiEndpointsEnum from './endpointsEnum'

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  isMultiPart: boolean = false
): Promise<IResponseHandler<T, unknown>> {
  const session = await getSession()
  const token = session?.user?.accessToken

  const headers = new Headers(options.headers)
  if (isMultiPart) {
    headers.set('Content-Type', 'multipart/form-data')
  } else {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  })
    .then(async (response) => {
      return { sucess: (await response.json()) as T, error: null }
    })
    .catch((error) => {
      return { sucess: null, error: error }
    })

  return response
}

export async function getCertificatesService() {
  return apiFetch<Array<ICertificate>>(apiEndpointsEnum.CERTIFICATE_FIND_ALL)
}

export async function postEventService(event: IEvent) {
  const data = {
    name: event.name,
    startDate: event.startDate,
    endDate: event.endDate,
    dates: event.dates.map((date) => ({
      title: date.title,
      date: date.date,
      startTime: date.startTime,
      endTime: date.endTime,
    })),
    workload: event.workload,
    description: event.description,
    location: {
      address: event.location.address,
      complement: event.location.complement,
      capacity: event.location.capacity,
      coordinates: {
        latitude: event.location.coordinates.lat,
        longitude: event.location.coordinates.lng,
      },
    },
    certificate: {
      modelId: event.certificate.modelId,
      complement: event.certificate.complement,
      issuerLogoUrl: event.certificate.issuerLogoImage.url,
      responsible: [
        {
          ...event.certificate.responsible,
        },
      ],
    },
    backgroundUrl: event.backgroundImage.url,
    nrUuidResponsible: event.nrUuidResponsible,
  }

  return apiFetch<IEvent>(apiEndpointsEnum.EVENT_CREATE, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function uploadResourceService(file: File, identifier: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('identifier', identifier)
  const session = await getSession()
  const token = session?.user?.accessToken

  try {
    const response = await fetch(apiEndpointsEnum.POST_IMAGE, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao fazer upload do recurso:', error)
    throw error
  }
}

export async function subscribeEventService({
  id,
  nrUuidParticipant,
}: {
  id: string
  nrUuidParticipant: string
}) {
  const data = {
    idEvent: id,
  }
  return apiFetch(
    `${apiEndpointsEnum.SUBSCRIBE_PARTICIPANT}/${nrUuidParticipant}/subscribe`,
    {
      method: 'POST',
      body: JSON.stringify({ ...data }),
    }
  )
}

export async function finishEventService({ id }: { id: string }) {
  return apiFetch(`${apiEndpointsEnum.EVENT_CREATE}/${id}/finished`, {
    method: 'POST',
  })
}
