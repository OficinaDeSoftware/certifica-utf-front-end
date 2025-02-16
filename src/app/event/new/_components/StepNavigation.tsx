import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

type StepNavigationProps = {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  handleFinishEvent: () => void
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  handleFinishEvent,
}: StepNavigationProps) {
  const getCurrentStepId = () => {
    switch (currentStep) {
      case 1:
        return 'general-data'
      case 2:
        return 'location'
      case 3:
        return 'certificate'
      case 4:
        return 'confirmation'
      default:
        return ''
    }
  }

  return (
    <div className="flex w-full justify-end gap-3">
      {currentStep > 1 && (
        <Button size="lg" className="min-h-12" onClick={onPrevious}>
          <ChevronLeft />
          Voltar
        </Button>
      )}
      {currentStep < totalSteps && currentStep !== totalSteps - 1 && (
        <Button
          form={getCurrentStepId()}
          type="submit"
          size="lg"
          className="min-h-12"
        >
          {'Próximo'} <ChevronRight />
        </Button>
      )}
      {currentStep === totalSteps - 1 && (
        <Button
          onClick={() => handleFinishEvent()}
          size="lg"
          className="min-h-12"
        >
          Finalizar
        </Button>
      )}
    </div>
  )
}
