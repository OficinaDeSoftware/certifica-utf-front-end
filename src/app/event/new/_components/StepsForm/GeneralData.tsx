import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'

import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, UploadCloud } from 'lucide-react'
import Image from 'next/image'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import IEvent from '@/types/IEvent'
import { zodResolver } from '@hookform/resolvers/zod'

type GeneralDataProps = {
  formData: IEvent
  handleStepSubmit: (data: IEvent) => void
}

const generalDataSchema = z
  .object({
    name: z.string().min(1, 'Nome do evento é obrigatório'),
    initialDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
      message: 'Data de início inválida',
    }),
    finalDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
      message: 'Data de fim inválida',
    }),
    description: z
      .string()
      .min(10, {
        message: 'Descrição deve ter pelo menos 10 caracteres',
      })
      .max(160, {
        message: 'Descrição deve ter no máximo 160 caracteres',
      }),
    image: z.string().min(1, 'Imagem do evento é obrigatório'),
  })
  .refine(
    (data) => Date.parse(data.initialDate) <= Date.parse(data.finalDate),
    {
      message: 'A data de início deve ser anterior ou igual à data de fim',
      path: ['finalDate'],
    }
  )
  .refine((data) => Date.parse(data.initialDate) >= Date.now(), {
    message: 'A data de início não pode ser no passado',
    path: ['initialDate'],
  })

export default function GeneralData(props: GeneralDataProps) {
  const { formData, handleStepSubmit } = props

  const form = useForm({
    resolver: zodResolver(generalDataSchema),
    defaultValues: formData,
  })

  const parseDate = (date: string) =>
    date ? parse(date, 'yyyy-MM-dd', new Date()) : undefined

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    form.setValue('image', URL.createObjectURL(acceptedFiles[0]))
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <Form {...form}>
      <form
        id="general-data"
        onSubmit={form.handleSubmit(handleStepSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} id="name" placeholder="Nome do evento" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="initialDate"
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col">
                <FormLabel>Data de início</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'h-12 pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(parseDate(field.value)!, 'PPP', {
                            locale: ptBR,
                          })
                        ) : (
                          <span>DD/MM/AAAA</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value ? parseDate(field.value) : undefined
                      }
                      onSelect={(date) =>
                        field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                      }
                      disabled={(date) =>
                        date.getTime() <= new Date().setHours(0, 0, 0, 0) ||
                        date.getTime() < new Date('1900-01-01').getTime()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="finalDate"
            render={({ field }) => (
              <FormItem className="flex w-1/2 flex-col">
                <FormLabel>Data de encerramento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'h-12 pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(parseDate(field.value)!, 'PPP', {
                            locale: ptBR,
                          })
                        ) : (
                          <span>DD/MM/AAAA</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value ? parseDate(field.value) : undefined
                      }
                      onSelect={(date) =>
                        field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                      }
                      disabled={(date) =>
                        date.getTime() <= new Date().setHours(0, 0, 0, 0) ||
                        date.getTime() < new Date('1900-01-01').getTime()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrição do evento: objetivos, prazos, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center">
          <FormField
            control={form.control}
            name="image"
            render={() => {
              return (
                <FormItem className="flex w-full flex-col">
                  <FormLabel>Imagem</FormLabel>
                  <FormControl>
                    <div>
                      <label
                        {...getRootProps()}
                        className="relative flex min-h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6 hover:bg-gray-100"
                      >
                        {form.getValues('image') ? (
                          <Image
                            src={form.getValues('image')}
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
                                Selecione a imagem{' '}
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
      </form>
    </Form>
  )
}
