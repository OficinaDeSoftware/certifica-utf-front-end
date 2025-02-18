import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ICertificateParticipant } from '@/types/ICertificate'

type CertificateCardProps = {
  certificate: ICertificateParticipant
}

export default function CertificateCard({ certificate }: CertificateCardProps) {
  return (
    <Card className="max-w-md p-4 shadow-md">
      <CardContent className="flex flex-col gap-2 overflow-hidden">
        <div className="h-64 w-full overflow-hidden rounded-md border">
          <iframe
            title={certificate.id}
            src={certificate.certificateUrl}
            className="h-full w-full"
          />
        </div>
        <Button asChild>
          <a
            href={certificate.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver Certificado
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
