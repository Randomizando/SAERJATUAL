import { forwardRef, useState } from 'react'
import {
  Container,
  ContainerMaskInput,
  ContainerTextField,
  ContentMaskInput,
  FormError,
} from './styled'
interface schemaTextField {
  title: string
  onChange?: any
  type?: string
  value?: string | number
  defaultValue?: any
  w?: number | string
  minW?: number | string
  messageError?: string
  disabled?: boolean
  helperText?: any
  error?: any
  mask?: any
  style?: any
  quantidadeCaracteres?: any
  step?: any
  textAlign?: any
  formatFunction?: any
  readOnly?: boolean
}

// eslint-disable-next-line react/display-name
export const TextInput = forwardRef<HTMLInputElement, schemaTextField>(
  (props, ref) => {
    const {
      title,
      onChange = () => {},
      value,
      defaultValue,
      w,
      minW,
      disabled,
      helperText,
      error,
      mask,
      messageError,
      quantidadeCaracteres,
      step,
      textAlign,
      formatFunction,
      readOnly,
      ...rest
    } = props

    const [newValue, setNewValue] = useState(value)

    const handleChange = (e: any) => {
      if (formatFunction) {
        setNewValue(formatFunction(e.target.value))
      } else {
        setNewValue(e.target.value)
      }

      if (props.onChange) {
        props.onChange(e)
      }
    }

    return (
      <Container>
        {mask ? (
          <>
            <ContainerMaskInput
              style={{ width: w, color: error ? '#d32f2f' : '' }}
            >
              {title}
              <ContentMaskInput
                style={{ borderBottomColor: error ? '#d32f2f' : '' }}
                mask={mask}
                ref={ref}
                value={newValue}
                onChange={handleChange}
                disabled={disabled}
                {...rest}
              />
              <FormError>{helperText}</FormError>
            </ContainerMaskInput>
          </>
        ) : (
          <ContainerTextField
            fullWidth
            id="fullWidth"
            label={title}
            ref={ref}
            variant="standard"
            value={newValue}
            sx={{ width: w, minW }}
            defaultValue={defaultValue}
            disabled={disabled}
            helperText={helperText}
            messageerror={messageError}
            InputProps={{
              inputProps: {
                step,
                readOnly,
                style: { textAlign },
                maxLength: quantidadeCaracteres,
              },
            }}
            autoComplete="off"
            error={error}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleChange}
            {...rest}
          />
        )}
      </Container>
    )
  },
)
