import { getServerSession } from 'next-auth'
import Link from 'next/link'

import { authOptions } from '@/services/auth/nextAuth/authOptions'
import getFetchCertificaUTF from '@/utils/getFetchCertificaUTF'

import CertificateCard from './_components/certificate_card'

export default async function Certificates() {
  const session = await getServerSession(authOptions)
  if (!session) return null

  const { sucess: certificates } = await (
    await getFetchCertificaUTF()
  ).getCertificateByParticipant(session.user.id)

  if (certificates && certificates.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex w-full max-w-[1200px] flex-1 flex-col gap-4 pb-4 pl-4 pr-4 md:gap-8 md:pb-6 md:pl-6 md:pr-6">
          <h1 className="mt-8 text-2xl font-bold">
            Você ainda não tem certificados, participe de um evento agora!
          </h1>

          <div className="mt-4">
            <Link
              href={'/event/list'}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              {'Ir para Eventos'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex w-full max-w-[1200px] flex-1 flex-col gap-4 pb-4 pl-4 pr-4 md:gap-8 md:pb-6 md:pl-6 md:pr-6">
          <h1 className="mt-8 text-2xl font-bold">
            Visualize seus certificados!
          </h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {certificates &&
              certificates.map((certificate) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                />
              ))}
            {!certificates && <p>Não há certificados disponíveis</p>}
            {}
          </div>
        </div>
      </div>
    </>
  )
}
