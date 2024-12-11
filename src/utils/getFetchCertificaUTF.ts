import CertificaUTF from '@/services/api/CertificaUTF/CertificaUTF'

import getServerAcessToken from './getServerAcessToken'

export default async function getFetchCertificaUTF() {
  return new CertificaUTF(await getServerAcessToken())
}
