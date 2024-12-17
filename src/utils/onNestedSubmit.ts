import { FieldValues, UseFormHandleSubmit } from 'react-hook-form'

type Props<T extends FieldValues> = {
  handleSubmit: UseFormHandleSubmit<T>
  submitFunction: (values: T) => Promise<void> | void
}

export const onNestedSubmit = <T extends FieldValues>({
  handleSubmit,
  submitFunction,
}: Props<T>) => {
  return async (event: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      if (typeof event.preventDefault === 'function') {
        event.preventDefault()
      }

      if (typeof event.stopPropagation === 'function') {
        event.stopPropagation()
      }
    }

    return handleSubmit(submitFunction)(event)
  }
}
