import IEvent from '@/types/IEvent'

import Certificate from './StepsForm/Certificate'
import Confirmation from './StepsForm/Confirmation'
import GeneralData from './StepsForm/GeneralData'
import Localization from './StepsForm/Location'

type StepProgressProps = {
  currentStep: number
  formData: IEvent
  onStepSubmit: (data: IEvent) => void
}

export default function StepContent({
  currentStep,
  formData,
  onStepSubmit,
}: StepProgressProps) {
  const renderTabComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <GeneralData formData={formData} handleStepSubmit={onStepSubmit} />
        )
      case 2:
        return (
          <Localization formData={formData} handleStepSubmit={onStepSubmit} />
        )
      case 3:
        return (
          <Certificate formData={formData} handleStepSubmit={onStepSubmit} />
        )
      case 4:
        return <Confirmation formData={formData} />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col items-center">{renderTabComponent()}</div>
  )
}
