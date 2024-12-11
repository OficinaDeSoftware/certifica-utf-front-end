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
          form="general-data"
          type="submit"
          size="lg"
          className="min-h-12"
        >
          Próximo <ChevronRight />
        </Button>
      )}
      {currentStep === totalSteps && (
        <Button size="lg" className="min-h-12">
          Finalizar
        </Button>
      )}
    </div>
  )
}
