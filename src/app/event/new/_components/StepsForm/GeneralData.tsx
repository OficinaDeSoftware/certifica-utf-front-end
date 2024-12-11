import { useForm } from 'react-hook-form'

import { format } from 'date-fns'
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

const generalDataSchema = z.object({
  name: z.string().min(1, 'Nome do evento é obrigatório'),
  initialDate: z.date({ required_error: 'Data de inicio é obrigatória' }),
  finalDate: z.date({ required_error: 'Data de fim é obrigatória' }),
  // workload: z.number().min(1, 'Carga horária é obrigatória'),
  // dates: z.array(
  //   z.object({ date: z.date(), startTime: z.string(), endTime: z.string() })
  // ),
})

export default function GeneralData(props: GeneralDataProps) {
  const { formData, handleStepSubmit } = props

  const form = useForm({
    resolver: zodResolver(generalDataSchema),
    defaultValues: formData,
  })

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
                          format(field.value, 'PPP')
                        ) : (
                          <span>DD/MM/YYY</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
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
                          format(field.value, 'PPP')
                        ) : (
                          <span>DD/MM/YYY</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
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
