import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

export function exportJSONToExcel(
  data: any[],
  fileName: string,
  collsWidth: XLSX.ColInfo[],
) {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'

  const workSheet = XLSX.utils.json_to_sheet(data, {})
  workSheet['!cols'] = collsWidth

  const workBook = { Sheets: { data: workSheet }, SheetNames: ['data'] }
  const excelBuffer = XLSX.write(workBook, {
    bookType: 'xlsx',
    type: 'array',
  })
  const tableData = new Blob([excelBuffer], { type: fileType })

  FileSaver.saveAs(tableData, fileName + fileExtension)
}
