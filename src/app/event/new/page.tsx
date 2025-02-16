'use client'

import * as React from 'react'
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

import { useRouter } from 'next/navigation'

import {
  postEventService,
  uploadResourceService,
} from '@/services/api/CertificaUTF/certificate'
import IEvent from '@/types/IEvent'

import StepContent from './_components/StepContent'
import StepNavigation from './_components/StepNavigation'
import StepProgress from './_components/StepProgress'

const TOTAL_STEPS = 5

export default function CreateEvent() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<IEvent>({
    id: '',
    name: '',
    startDate: '',
    endDate: '',
    dates: [],
    workload: 0,
    description: '',
    backgroundImage: {
      url: '',
      file: undefined,
    },
    location: {
      address: '',
      complement: '',
      capacity: 0,
      coordinates: { lat: -25.704432566768226, lng: -53.09758561759751 },
    },
    certificate: {
      modelId: '',
      complement: '',
      issuerLogoImage: {
        url: '',
        file: undefined,
      },
      responsible: {
        occupation: '',
        signature: '',
      },
    },
  })
  const router = useRouter()

  const handleFinishEvent = async () => {
    try {
      const newBackgroundUrl = await uploadResourceService(
        formData.backgroundImage.file as File,
        formData.name
      )

      const newLogoUrl = await uploadResourceService(
        formData.certificate.issuerLogoImage.file as File,
        formData.certificate.modelId
      )

      const data = {
        ...formData,
        startDate: formData.startDate.split('-').reverse().join('/'),
        endDate: formData.endDate.split('-').reverse().join('/'),
        dates: [
          ...formData.dates.map((date) => ({
            ...date,
            date: date.date.split('-').reverse().join('/'),
          })),
        ],
        backgroundImage: {
          ...formData.backgroundImage,
          url: newBackgroundUrl.url,
        },
        certificate: {
          ...formData.certificate,
          issuerLogoImage: {
            ...formData.certificate.issuerLogoImage,
            url: newLogoUrl.url,
          },
        },
      }

      await postEventService(data)

      toast.success('Evento criado com sucesso!')

      router.push('/event/list')
    } catch (error) {
      toast.error('Erro ao criar o evento. Tente novamente.')
      console.error('Erro ao criar o evento:', error)
    }
  }

  const handleStepSubmit = (data: IEvent) => {
    if (currentStep === TOTAL_STEPS - 1) {
      handleFinishEvent()
      return
    }
    setFormData((prev) => ({ ...prev, ...data }))
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Criar evento'
      case 2:
        return `Local do evento - ${formData.name}`
      case 3:
        return `Certificado - ${formData.name}`
      case 4:
        return `Confirmação - ${formData.name}`
      default:
        return 'Criar evento'
    }
  }

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex w-full max-w-[800px] flex-1 flex-col gap-4 pb-4 pl-4 pr-4 md:gap-8 md:pb-6 md:pl-6 md:pr-6">
          <div className="flex h-32 items-center">
            <p className="text-3xl font-semibold">{getStepTitle()}</p>
          </div>

          <StepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

          <StepContent
            currentStep={currentStep}
            formData={formData}
            onStepSubmit={handleStepSubmit}
          />

          <StepNavigation
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onPrevious={handlePrevious}
            handleFinishEvent={handleFinishEvent}
          />
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
