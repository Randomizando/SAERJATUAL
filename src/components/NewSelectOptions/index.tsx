import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
  SxProps,
  Theme,
} from '@mui/material'

interface INewSelectOptions<T> extends SelectProps<T> {
  label: string
  options: { label: string; value: string }[]
  hasNullValue?: boolean
  containerSx?: SxProps<Theme>
  helperText?: string
}

export default function NewSelectOptions<T>({
  label,
  options,
  hasNullValue,
  containerSx,
  helperText,
  ...rest
}: INewSelectOptions<T>) {
  return (
    <FormControl variant="standard" sx={containerSx} error={rest.error}>
      <InputLabel id={`label-${label}`}>{label}</InputLabel>

      <Select
        id={`select-${label}`}
        labelId={`label-${label}`}
        label="label"
        MenuProps={{ MenuListProps: { sx: { maxHeight: 300 } } }}
        {...rest}
      >
        {hasNullValue && (
          <MenuItem value="">
            <em>Selecione</em>
          </MenuItem>
        )}

        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}
