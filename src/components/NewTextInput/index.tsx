import { InputAdornment, TextField, TextFieldProps } from '@mui/material'

type TNewTextInput = {
  isMoney?: boolean
  maskFunction?: (value: string) => string
} & TextFieldProps

export default function NewTextInput({
  isMoney,
  maskFunction,
  ...rest
}: TNewTextInput) {
  return (
    <TextField
      id={`textInput-${rest.id}`}
      variant="standard"
      inputProps={{
        style: { textAlign: isMoney ? 'right' : undefined },
        ...rest.inputProps,
      }}
      InputProps={{
        startAdornment: isMoney ? (
          <InputAdornment position="start">R$</InputAdornment>
        ) : undefined,
        ...rest.InputProps,
      }}
      onChange={(e) => {
        if (maskFunction) e.target.value = maskFunction(e.target.value)

        if (rest.onChange) rest.onChange(e)
      }}
      {...rest}
    />
  )
}
