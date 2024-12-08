'use client'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import googleIcon from '@/assets/images/iconGoogle.svg'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCredentialsSignIn } from '@/hooks/useSignIn'
import { formSchema, FormSchema } from '@/utils/validation/form'
import { zodResolver } from '@hookform/resolvers/zod'

export default function LoginForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ra: '',
      password: '',
    },
  })
  const router = useRouter()
  const { loading, error, success, triggerCredentialsSignIn } =
    useCredentialsSignIn()

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form
  const onSubmitForm: SubmitHandler<FormSchema> = async (data) => {
    await triggerCredentialsSignIn(data)
  }

  if (success) {
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-center text-xl font-medium">Login com RA</p>

      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="flex flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="ra"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ra</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex: a9999999"
                    {...field}
                    className="h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input {...field} type="password" className="h-11" />
                </FormControl>
                <FormMessage />
                {error && <p className="text-destructive">{error}</p>}
              </FormItem>
            )}
          />

          <Button
            disabled={isSubmitting || loading}
            type="submit"
            className="h-11 w-full bg-primaryPurple text-white"
          >
            {isSubmitting || loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <></>
            )}
            Acessar
          </Button>
        </form>
      </Form>

      <p className="text-center">
        Ou faça login com sua conta <br /> Google
      </p>

      <Button
        disabled={isSubmitting || loading}
        className="h-11 w-full border border-gray-300 bg-white text-center font-medium text-black shadow-sm"
        onClick={() => signIn('google', { callbackUrl: '/' })}
        variant={'secondary'}
      >
        <Image src={googleIcon} alt="Google Icon" width={30} height={30} />
        Entrar com Google
      </Button>
    </div>
  )
}
