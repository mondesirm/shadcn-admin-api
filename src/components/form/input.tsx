import { type ControllerRenderProps } from 'react-hook-form'
import {
  File,
  FormInput,
  Loader2,
  type LucideIcon,
  Text,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { FormControl } from '@/components/ui/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'

type InputProps = Partial<ControllerRenderProps> &
  (
    | Omit<React.ComponentProps<'input'>, 'value'>
    | ({ type: 'textarea' } & Omit<React.ComponentProps<'textarea'>, 'value'>)
  ) & { icon?: LucideIcon; isLoading?: boolean }

export function Input({
  className,
  value,
  icon: Icon = FormInput,
  placeholder = 'Enter a value',
  maxLength = 255,
  disabled,
  isLoading,
  ...props
}: InputProps) {
  value ??= undefined

  const Comp = props.type === 'textarea' ? InputGroupTextarea : InputGroupInput

  Icon = props.type === 'textarea' ? Text : props.type === 'file' ? File : Icon

  // TODO get maxLength from schema

  const onClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    props.onChange?.('')

    document
      .querySelector<HTMLInputElement>(`input[name="${props.name}"]`)
      ?.focus()
  }

  return (
    <InputGroup className='has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50'>
      {Icon && (
        <InputGroupAddon
          align={props.type === 'textarea' ? 'block-start' : undefined}
        >
          <Icon className={value ? '' : 'opacity-50'} />

          {props.type === 'textarea' && value && (
            <InputGroupText className='text-xs'>
              {value?.toString().length || ''}
              {maxLength && ` / ${maxLength}`}
            </InputGroupText>
          )}
        </InputGroupAddon>
      )}

      {props.type === 'textarea' && (
        <InputGroupAddon className='absolute end-1 [&>svg]:me-1'>
          <InputGroupButton
            size='icon-xs'
            hidden={!value || isLoading}
            disabled={disabled === true || isLoading}
            onClick={onClear}
          >
            <X />
          </InputGroupButton>

          {isLoading && <Loader2 className='animate-spin' />}
        </InputGroupAddon>
      )}

      <FormControl>
        <Comp
          className={cn('min-h-auto text-sm', className)}
          {...{ placeholder, maxLength }}
          disabled={disabled || isLoading}
          {...(props as object)}
        />
      </FormControl>

      {props.type !== 'textarea' && (
        <InputGroupAddon className='[&>svg]:me-1' align='inline-end'>
          <InputGroupButton
            size='icon-xs'
            hidden={!value || isLoading}
            disabled={disabled === true || isLoading}
            onClick={onClear}
          >
            <X />
          </InputGroupButton>

          {isLoading && <Loader2 className='animate-spin' />}
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
