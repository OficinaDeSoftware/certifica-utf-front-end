type StepProgressProps = { currentStep: number }

export default function StepContent({ currentStep }: StepProgressProps) {
  const renderTabComponent = () => {
    switch (currentStep) {
      case 1:
        return <div>Tab 1</div>
      case 2:
        return <div>Tab 2</div>
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
