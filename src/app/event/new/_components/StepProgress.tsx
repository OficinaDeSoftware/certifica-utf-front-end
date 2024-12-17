import { Progress } from '@/components/ui/progress'

type StepProgressProps = {
  currentStep: number
  totalSteps: number
}

export default function StepProgress({
  currentStep,
  totalSteps,
}: StepProgressProps) {
  const progressValue = (currentStep / totalSteps) * 100

  return <Progress value={progressValue} />
}
