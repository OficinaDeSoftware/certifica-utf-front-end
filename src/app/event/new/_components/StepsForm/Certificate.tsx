import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'

import { UploadCloud } from 'lucide-react'
import Image from 'next/image'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCertificate } from '@/hooks/useCertificate'
import IEvent from '@/types/IEvent'
import { zodResolver } from '@hookform/resolvers/zod'

type CertificateProps = {
  formData: IEvent
  handleStepSubmit: (data: IEvent) => void
}

const localizationSchema = z.object({
  certificate: z.object({
    responsible: z.object({
      occupation: z.string().min(1, 'Cargo é obrigatório'),
      signature: z.string().min(1, 'Assinatura é obrigatória'),
    }),
    complement: z.string().min(1, 'Complemento é obrigatório'),
    issuerLogoImage: z.object({
      url: z.string().min(1, 'Logo do evento é obrigatório'),
      file: z.instanceof(File),
    }),
    modelId: z.string().min(1, 'Modelo de certificado é obrigatório'),
  }),
})

export default function Certificate(props: CertificateProps) {
  const { formData, handleStepSubmit } = props

  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(
    null
  )

  const form = useForm({
    resolver: zodResolver(localizationSchema),
    defaultValues: formData,
  })
  const { getCertificates, certificates } = useCertificate()

  useEffect(() => {
    getCertificates()
  }, [])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    form.setValue(
      'certificate.issuerLogoImage.url',
      URL.createObjectURL(acceptedFiles[0])
    )
    form.setValue('certificate.issuerLogoImage.file', acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const handleCertificateSelect = (id: string) => {
    setSelectedCertificate(id)
    form.setValue('certificate.modelId', id)
  }

  return (
    <Form {...form}>
      <form
        id="certificate"
        onSubmit={form.handleSubmit(handleStepSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="certificate.responsible.occupation"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Instituição</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="occupation"
                  placeholder="Ex: UTFPR Dois vizinhos"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="certificate.responsible.signature"
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col">
                <FormLabel>Assinatura</FormLabel>
                <FormControl>
                  <Input
                    id="signature"
                    placeholder="Ex: Carlos Eduardo"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="certificate.complement"
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col">
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="complement"
                    placeholder="Ex: Por comparecer a todas as palestras"
                    value={field.value === undefined ? '' : String(field.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-center">
          <FormField
            control={form.control}
            name="certificate.issuerLogoImage.url"
            render={() => {
              return (
                <FormItem className="flex w-full flex-col">
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <div>
                      <label
                        {...getRootProps()}
                        className="relative flex min-h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6 hover:bg-gray-100"
                      >
                        {form.getValues('certificate.issuerLogoImage.url') ? (
                          <Image
                            src={
                              form.getValues(
                                'certificate.issuerLogoImage.url'
                              ) as string
                            }
                            alt="Imagem do evento"
                            fill={true}
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="text-center">
                            <div className="mx-auto max-w-min rounded-md border p-2">
                              <UploadCloud size={20} />
                            </div>

                            <p className="mt-2 text-sm text-gray-600">
                              <span className="font-semibold">
                                Logo do evento, selecione uma imagem
                              </span>
                            </p>
                            <p className="text-xs text-gray-500">
                              JPEG, PNG, PDG
                            </p>
                          </div>
                        )}
                      </label>

                      <Input
                        {...getInputProps()}
                        id="dropzone-file"
                        placeholder="Imagem"
                        accept="image/*"
                        type="file"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </div>

        <FormField
          control={form.control}
          name="certificate.modelId"
          render={() => {
            return (
              <FormItem className="flex w-full flex-col">
                <div>
                  <FormLabel>Certificados</FormLabel>

                  <div className="flex flex-col gap-8 rounded-sm bg-grey-100 p-8">
                    {certificates && certificates.length > 0 ? (
                      certificates.map((certificate) => (
                        <div
                          key={certificate.id}
                          className={`max-w-[200px] rounded-sm bg-grey-200 p-3 ${
                            selectedCertificate === certificate.id
                              ? 'border-2 border-blue-500'
                              : ''
                          }`}
                          onClick={() =>
                            handleCertificateSelect(certificate.id)
                          }
                          style={{ cursor: 'pointer' }}
                          role="button"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleCertificateSelect(certificate.id)
                            }
                          }}
                          tabIndex={0}
                        >
                          <div className="aspect-w-1 aspect-h-1 h-auto w-full">
                            <Image
                              src={certificate.previewUrl}
                              alt={certificate.id}
                              width={200}
                              height={200}
                              className="object-contain"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>Carregando...</p>
                    )}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        {selectedCertificate !== null && (
          <div className="aspect-w-1 aspect-h-1 relative h-[450px] w-full">
            <Image
              src={
                certificates.find((c) => c.id === selectedCertificate)
                  ?.previewUrl as string
              }
              alt={
                certificates.find((c) => c.id === selectedCertificate)
                  ?.id as string
              }
              fill={true}
            />
          </div>
        )}
      </form>
    </Form>
  )
}
