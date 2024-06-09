import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { CardActionArea } from '@mui/material'

interface schemaCard {
  title: string
  description: string
  onClick?: any
}

export default function CardTable({ title, description, onClick }: schemaCard) {
  return (
    <Card sx={{ maxWidth: 345, minWidth: 335 }} onClick={onClick}>
      <CardActionArea>
        <CardContent
          sx={{
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
