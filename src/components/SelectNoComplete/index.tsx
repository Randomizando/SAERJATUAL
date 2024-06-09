import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import { SelectCustom } from './styled'
import { SelectChangeEvent } from '@mui/material'

interface schemaSelect {
  value?: any
  title: string
  data: any
  style?: string
  p?: any
  valueCustom?: any
  onChange?: (e: SelectChangeEvent) => void
}

export default function SelectNoComplete({
  value,
  title,
  data,
  p,
  valueCustom,
  ...rest
}: schemaSelect) {
  return (
    <Box sx={{ width: '100%' }}>
      <InputLabel sx={{ fontSize: '12px' }}>{title}</InputLabel>
      <SelectCustom
        style={{ padding: p }}
        size="small"
        sx={{ width: '100%', fontSize: '12px', padding: '0px' }}
        defaultValue={value}
        readonly
        label={title}
        // onChange={onChange}
        {...rest}
      >
        <MenuItem sx={{ fontSize: '12px' }} value={value}>
          {value}
        </MenuItem>
        {data &&
          data?.map((item: any) => {
            return (
              <MenuItem
                sx={{ fontSize: '12px' }}
                key={item.id}
                value={item.ocorrencia_tabela}
              >
                {item.ocorrencia_tabela}
              </MenuItem>
            )
          })}
        {/* <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem> */}
      </SelectCustom>
    </Box>
  )
}
