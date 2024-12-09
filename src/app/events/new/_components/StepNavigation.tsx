'use client' // Interatividade necessária para os botões

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

type StepNavigationProps = {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  onNext,
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
        <Button size="lg" className="min-h-12" onClick={onNext}>
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
