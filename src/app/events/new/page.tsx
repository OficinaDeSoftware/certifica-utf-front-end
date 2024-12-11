'use client'

import * as React from 'react'
import { useState } from 'react'

import IEventDto from '@/types/IEventDto'

import StepContent from './_components/StepContent'
import StepNavigation from './_components/StepNavigation'
import StepProgress from './_components/StepProgress'

export default function CreateEvent() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3
  const [formData, setFormData] = useState<IEventDto>({
    idEvent: '',
    name: '',
    dateStart: '',
    dateEnd: '',
    workload: 0,
    informations: '',
    nrUuidAccountable: '',
    participants: [],
    dates: [],
  })

  const handleStepSubmit = (data: IEventDto) => {
    setFormData((prev) => ({ ...prev, ...data }))
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex w-full max-w-[800px] flex-1 flex-col gap-4 pb-4 pl-4 pr-4 md:gap-8 md:pb-6 md:pl-6 md:pr-6">
        <div className="flex h-32 items-center">
          <p className="text-3xl font-semibold">Criar eventos</p>
        </div>

        <StepProgress currentStep={currentStep} totalSteps={totalSteps} />

        <StepContent
          currentStep={currentStep}
          formData={formData}
          onStepSubmit={handleStepSubmit}
        />

        <StepNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={handlePrevious}
        />
      </div>
    </div>
  )
}
