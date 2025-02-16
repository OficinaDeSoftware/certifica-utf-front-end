import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useFieldArray, useForm } from 'react-hook-form'

import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Plus, UploadCloud } from 'lucide-react'
import Image from 'next/image'
import { z } from 'zod'

import { EventCard } from '@/components/event-card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import IEvent, { IEventDate } from '@/types/IEvent'
import { zodResolver } from '@hookform/resolvers/zod'

import DialogEventDate from '../DialogEventDate'

type GeneralDataProps = {
  formData: IEvent
  handleStepSubmit: (data: IEvent) => void
}

const generalDataSchema = z
  .object({
    name: z.string().min(1, 'Nome do evento é obrigatório'),
    startDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
      message: 'Data de início inválida',
    }),
    endDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
      message: 'Data de fim inválida',
    }),
    workload: z.number().min(1, 'Carga horária é obrigatória'),
    dates: z.array(z.object({})).min(1, 'Ao menos um horário é obrigatório'),
    description: z
      .string()
      .min(10, {
        message: 'Descrição deve ter pelo menos 10 caracteres',
      })
      .max(160, {
        message: 'Descrição deve ter no máximo 160 caracteres',
      }),
    backgroundImage: z.object({
      url: z.string().min(1, 'Imagem do evento é obrigatório'),
      file: z.instanceof(File),
    }),
  })
  .refine((data) => Date.parse(data.startDate) <= Date.parse(data.endDate), {
    message: 'A data de início deve ser anterior ou igual à data de fim',
    path: ['endDate'],
  })
  .refine((data) => Date.parse(data.startDate) >= Date.now(), {
    message: 'A data de início não pode ser no passado',
    path: ['startDate'],
  })

export default function GeneralData(props: GeneralDataProps) {
  const { formData, handleStepSubmit } = props

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(generalDataSchema),
    defaultValues: formData,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'dates',
  })

  const handleSubmitDialogEventDate = (data: IEventDate) => {
    append({ ...data, id: String(Math.random()) })
    setIsDialogOpen(false)
  }

  const parseDate = (date: string) =>
    date ? parse(date, 'yyyy-MM-dd', new Date()) : undefined

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    form.setValue('backgroundImage.url', URL.createObjectURL(acceptedFiles[0]))
    form.setValue('backgroundImage.file', acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const handleRemoveEventDates = (id: string) => {
    const index = fields.findIndex((field: IEventDate) => field.id === id)
    if (index !== -1) {
      remove(index)
    }
  }

  return (
    <Form {...form}>
      <form
        id="general-data"
        onSubmit={form.handleSubmit((data) => {
          const updatedData = {
            ...data,
            dates: fields.map((field) => ({
              title: field.title,
              date: field.date,
              startTime: field.startTime,
              endTime: field.endTime,
              id: field.id,
            })),
          }

          handleStepSubmit(updatedData)
        })}
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

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="startDate"
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
            name="endDate"
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
          name="dates"
          render={() => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>Horários dos eventos</FormLabel>
              <FormControl>
                <Card className="max-h-[400px] overflow-auto">
                  <CardContent className="flex flex-col gap-4 pt-6">
                    <div className="flex w-full flex-wrap justify-center gap-4">
                      {fields.map((field) => (
                        <div className="w-8/10" key={field.id}>
                          <EventCard
                            eventDate={field}
                            onRemove={handleRemoveEventDates}
                          />
                        </div>
                      ))}
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          disabled={
                            !form.getValues('startDate') ||
                            !form.getValues('endDate')
                          }
                          onClick={() => setIsDialogOpen(true)}
                        >
                          <Plus /> Adicionar novo horário
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        className="sm:max-w-[600px]"
                        aria-describedby={undefined}
                      >
                        <DialogHeader>
                          <DialogTitle>Adicionar novo horário</DialogTitle>
                        </DialogHeader>
                        <DialogEventDate
                          onSubmit={handleSubmitDialogEventDate}
                          startDate={form.getValues('startDate')}
                          endDate={form.getValues('endDate')}
                        />
                        <DialogFooter>
                          <Button type="submit" form="dialog-event-date">
                            Adicionar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="workload"
          render={({ field }) => (
            <FormItem className="flex w-1/2 flex-col">
              <FormLabel>Carga horária</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  form="workload"
                  id="name"
                  placeholder="Carga horária"
                  type="number"
                  onChange={(e) => {
                    const value =
                      e.target.value === '' ? '' : Number(e.target.value)
                    field.onChange(value)
                  }}
                  value={field.value === undefined ? '' : String(field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center">
          <FormField
            control={form.control}
            name="backgroundImage.url"
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
                        {form.getValues('backgroundImage.url') ? (
                          <Image
                            src={
                              form.getValues('backgroundImage.url') as string
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
