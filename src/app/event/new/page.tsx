'use client'

import * as React from 'react'
import { useState } from 'react'

import { useRouter } from 'next/navigation'

import IEvent from '@/types/IEvent'

import StepContent from './_components/StepContent'
import StepNavigation from './_components/StepNavigation'
import StepProgress from './_components/StepProgress'

const TOTAL_STEPS = 4

export default function CreateEvent() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<IEvent>({
    id: '',
    name: '',
    initialDate: '',
    finalDate: '',
    workload: 0,
    description: '',
    location: {
      description: '',
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0,
      mapUrl: '',
    },
    eventDates: [],
    image: '',
    participants: 0,
    avaliation: 0,
  })
  const router = useRouter()

  const handleStepSubmit = (data: IEvent) => {
    if (currentStep === TOTAL_STEPS - 1) {
      router.push('/event/list')
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
        return `Data e horário - ${formData.name}`
      case 3:
        return `Localização - ${formData.name}`
      default:
        return 'Criar evento'
    }
  }

  return (
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
        />
      </div>
    </div>
  )
}
