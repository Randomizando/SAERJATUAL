import { api } from '@/lib/axios'

interface schemaButtonDownload {
  nameFile: string
  nameButton: string
}

export function ButtonDownload({ nameFile, nameButton }: schemaButtonDownload) {
  return (
    <>
      <a href={`/upload/${nameFile}`} download>
        {nameButton}
      </a>
    </>
  )
}
