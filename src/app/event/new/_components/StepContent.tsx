import IEvent from '@/types/IEvent'

import GeneralData from './StepsForm/GeneralData'
import Workload from './StepsForm/Workload'

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
        return <Workload formData={formData} handleStepSubmit={onStepSubmit} />
      case 3:
        return <div>Tab 3</div>
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col items-center">{renderTabComponent()}</div>
  )
}
