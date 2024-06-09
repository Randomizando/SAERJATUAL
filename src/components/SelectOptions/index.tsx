import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { SyntheticEvent, forwardRef } from 'react'
import { Container } from './styled'

interface schemaSelectOptions {
  data: any
  description: string
  w?: number
  defaultValue?: any
  onChange?: any
  isDisabled?: boolean
  disableClearable?: boolean
}

// eslint-disable-next-line react/display-name
export const SelectOptions = forwardRef<any, any>((props, ref) => {
  const {
    data,
    description,
    w,
    defaultValue,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onChange = (e: SyntheticEvent<Element, Event>) =>
      e.currentTarget.textContent,
    isDisabled,
    disableClearable = true,
    ...rest
  }: schemaSelectOptions = props
  return (
    <Container>
      <Autocomplete
        disablePortal
        disableClearable={disableClearable}
        size="small"
        sx={{ width: w }}
        style={{
          opacity: isDisabled ? 0.4 : 1,
          pointerEvents: isDisabled ? 'none' : 'unset',
        }}
        ref={ref}
        options={data || []}
        getOptionLabel={(option) =>
          typeof option === 'object' ? String(option?.label) : String(option)
        }
        isOptionEqualToValue={(option, value) =>
          option.id === value.id || option.label === value.label
        }
        defaultValue={defaultValue}
        onChange={onChange}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              label={description}
              InputLabelProps={{
                shrink: true,
              }}
              {...rest}
            />
          )
        }}
      />
    </Container>
  )
})
