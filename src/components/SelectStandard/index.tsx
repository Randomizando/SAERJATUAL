import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import { SelectCustom } from './styled'

interface schemaSelect {
  defaultValue?: any
  title: string
  data: any
  style?: string
  p?: any
  valueCustom?: any
  w?: any
  onChange?: Function
}

export default function SelectStandard({
  defaultValue,
  title,
  data,
  p,
  valueCustom,
  w,
  onChange = () => {},
  ...rest
}: schemaSelect) {
  return (
    <Box sx={{ width: w || '100%' }}>
      <InputLabel sx={{ fontSize: '12px' }}>{title}</InputLabel>
      <SelectCustom
        style={{ padding: p }}
        size="small"
        defaultValue={defaultValue || ''}
        sx={{
          width: '100%',
          fontSize: '16px',
          padding: '0px',
          borderBottom: '1px solid #bdbdbd',
        }}
        readonly
        label={title}
        onChange={onChange}
        {...rest}
      >
        <MenuItem sx={{ fontSize: '16px' }} value={defaultValue}>
          {defaultValue}
        </MenuItem>
        {data &&
          data?.map((item: any) => {
            const value = typeof item === 'object' ? item?.label : item
            if (value !== defaultValue) {
              return (
                <MenuItem
                  sx={{ fontSize: '16px' }}
                  key={item?.id}
                  value={value}
                >
                  {value}
                </MenuItem>
              )
            }
          })}
      </SelectCustom>
    </Box>
  )
}
