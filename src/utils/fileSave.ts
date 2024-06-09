import fs from 'fs'
import { join } from 'path'

export function saveSingleFile(
  fileName: string,
  fileBuffer: string | NodeJS.ArrayBufferView,
  path = '/public/upload',
) {
  const absolutePath = join(process.cwd(), path, fileName)

  fs.writeFile(absolutePath, fileBuffer, (err) => {
    if (err) throw new Error(err?.message)
  })
}
