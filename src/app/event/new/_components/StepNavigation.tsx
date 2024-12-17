import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

type StepNavigationProps = {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  onPrevious,
}: StepNavigationProps) {
  const getCurrentStepId = () => {
    switch (currentStep) {
      case 1:
        return 'general-data'
      case 2:
        return 'workload'
      case 3:
        return 'location'
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
      {currentStep < totalSteps && (
        <Button
          form={getCurrentStepId()}
          type="submit"
          size="lg"
          className="min-h-12"
        >
          {currentStep === totalSteps - 1 ? 'Finalizar' : 'Próximo'}{' '}
          <ChevronRight />
        </Button>
      )}
    </div>
  )
}
