'use client'

import { useState } from 'react'

import { getCertificatesService } from '@/services/api/CertificaUTF/certificate'
import ICertificate from '@/types/ICertificate'

export const useCertificate = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null | undefined>(null)
  const [success, setSuccess] = useState(false)
  const [certificates, setCertificates] = useState<Array<ICertificate>>([])

  const getCertificates = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await getCertificatesService()
      if (res.sucess) {
        setSuccess(true)
        setCertificates(res.sucess)
        return res.sucess
      } else {
        setError(res?.error as string)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    success,
    getCertificates,
    certificates,
  }
}
