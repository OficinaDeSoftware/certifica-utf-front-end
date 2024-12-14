import { useForm } from 'react-hook-form'

import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
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
                        date.getTime() < new Date().setHours(0, 0, 0, 0) ||
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
                        date.getTime() < new Date().setHours(0, 0, 0, 0) ||
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
      </form>
    </Form>
  )
}
