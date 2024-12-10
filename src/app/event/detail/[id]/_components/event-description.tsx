interface EventDescriptionProps {
  description: string
}

export default function EventDescription({
  description,
}: EventDescriptionProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Descrição</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
