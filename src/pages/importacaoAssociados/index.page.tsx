import { BackPage } from '@/components/BackPage'
import { Button } from '@/components/Button'
import { Loading } from '@/components/Loading'
import { Text } from '@ignite-ui/react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import axios from 'axios'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { DownloadSimple } from 'phosphor-react'
import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Box, Container } from './styled'

interface CsvRow {
  codigo_proposta: string
  cpf: string
  uf_crm: string
  crm: string
  nome_completo: string
  categoria: string
  data_nascimento: string
  nacionalidade: string
  sexo: string
  telefone_celular: string
  email: string
  telefone_residencial: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
  nome_instituicao_ensino_graduacao: string
  ano_conclusao_graduacao: string
  sigla_regional: string
  status?: string
}

export default function CsvUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [tableData, setTableData] = useState<CsvRow[]>([])
  const [loading, setLoading] = useState(false)
  const [notFoundCpfs, setNotFoundCpfs] = useState<string[]>([])
  const [cpfAlreadyRegistered, setCpfAlreadyRegistered] = useState<string[]>([])
  const [apiResponse, setApiResponse] = useState<[]>([])
  const fileInputRef = useRef(null)

  const fileName = file?.name.replace('.csv', '')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].type !== 'text/csv') {
        toast.error('Formato arquivo de associados inválido.')
      } else {
        setFile(e.target.files[0])
        setTableData([])
      }
    }

    if (fileInputRef?.current && fileInputRef.current.value)
      fileInputRef.current.value = ''
  }

  const handleUpload = async () => {
    if (file && file.type === 'text/csv') {
      setLoading(true)

      const reader = new FileReader()

      reader.onload = async function (event) {
        if (event.target && event.target.result) {
          const content = event.target.result as string
          const contentWithNoSemicolon = content.replace(/;/g, ',')

          const lines = contentWithNoSemicolon.split('\n')
          const header = lines[0].split(',')

          const indices = {
            codigo_proposta: header.indexOf('Código Proposta'),
            cpf: header.indexOf('CPF'),
            uf_crm: header.indexOf('UF CRM'),
            crm: header.indexOf('CRM'),
            nome_completo: header.indexOf('Nome'),
            categoria: header.indexOf('Categoria'),
            data_nascimento: header.indexOf('Data Nascimento'),
            nacionalidade: header.indexOf('Nacionalidade'),
            sexo: header.indexOf('Sexo'),
            telefone_celular: header.indexOf('Celular'),
            email: header.indexOf('E-mail'),
            telefone_residencial: header.indexOf('Telefone'),
            cep: header.indexOf('CEP'),
            logradouro: header.indexOf('Logradouro'),
            numero: header.indexOf('Número'),
            complemento: header.indexOf('Complemento'),
            bairro: header.indexOf('Bairro'),
            cidade: header.indexOf('Cidade'),
            uf: header.indexOf('UF'),
            nome_instituicao_ensino_graduacao: header.indexOf('Faculdade'),
            ano_conclusao_graduacao: header.indexOf('Ano de Formação'),
            sigla_regional: header.indexOf('Regional'),
          }

          const data: CsvRow[] = []
          const cpfArray: string[] = []

          for (let i = 1; i < lines.length; i++) {
            const rowData = lines[i].split(',')
            if (rowData.length > 1) {
              const cpfMatch = rowData[indices.cpf]?.match(
                /\d{3}\.\d{3}\.\d{3}-\d{2}/,
              )
              const cpf = cpfMatch ? cpfMatch[0] : ''

              const rowObject: CsvRow = {
                codigo_proposta: rowData[indices.codigo_proposta],
                cpf,
                uf_crm: rowData[indices.uf_crm],
                crm: rowData[indices.crm],
                nome_completo: rowData[indices.nome_completo],
                categoria: verifyAndChangeAspiranteData(
                  rowData[indices.categoria],
                ),
                data_nascimento: rowData[indices.data_nascimento],
                nacionalidade: rowData[indices.nacionalidade],
                sexo: rowData[indices.sexo],
                telefone_celular: rowData[indices.telefone_celular],
                email: rowData[indices.email],
                telefone_residencial: rowData[indices.telefone_residencial],
                cep: rowData[indices.cep],
                logradouro: rowData[indices.logradouro],
                numero: rowData[indices.numero],
                complemento: rowData[indices.complemento],
                bairro: rowData[indices.bairro],
                cidade: rowData[indices.cidade],
                uf: rowData[indices.uf],
                nome_instituicao_ensino_graduacao:
                  rowData[indices.nome_instituicao_ensino_graduacao],
                ano_conclusao_graduacao:
                  rowData[indices.ano_conclusao_graduacao],
                sigla_regional: rowData[indices.sigla_regional],
              }
              data.push(rowObject)
              cpfArray.push(rowObject.cpf)
            }
          }

          if (!isValidHeader(indices)) {
            toast.error('Formato arquivo de associados inválido.')
            setLoading(false)
          } else {
            setTableData(data)
            await handleSearch(cpfArray, data)
          }
        }
      }
      reader.readAsText(file)
    } else {
      toast.error('Formato arquivo de associados inválido.')
    }
  }

  const handleSearch = async (cpfList: string[], data: any) => {
    try {
      const dataAssociadoToInsert: CsvRow[] = []
      data.forEach((item: CsvRow) => {
        dataAssociadoToInsert.push(item)
      })
      await uploadAssociados(dataAssociadoToInsert)
    } catch (error) {
      console.error('Erro ao inserir associados:', error)
      toast.error('Erro ao inserir associados.')
    } finally {
      setLoading(false)
    }
  }

  const uploadAssociados = async (dataAssociadoToInsert: any) => {
    try {
      const response = await axios.post('/api/adicionarAssociados', {
        dataAssociadoToInsert,
      })
      setApiResponse(response?.data?.result)
      if (noAssociadoIncluded(response?.data.result)) {
        toast.error('Nenhum associado incluído.')
      } else {
        toast.success('Associados adicionados com sucesso.')
      }
    } catch (error) {
      console.error('Erro ao enviar dados de associados:', error)
      toast.error('Erro ao adicionar associados.')
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile.type === 'text/csv') {
      setFile(droppedFile)
      setTableData([])
    } else {
      toast.error('Formato arquivo de associados inválido.')
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    const tableDataFormatted: any = []
    tableData.forEach((row, index) => {
      tableDataFormatted.push([
        row.cpf,
        row.crm,
        row.nome_completo,
        row.data_nascimento,
        row.categoria,
        cpfAlreadyRegistered.includes(row?.cpf)
          ? 'Ignorado'
          : !apiResponse[index]?.error && apiResponse[index]?.cpf
            ? 'Importado'
            : 'Ignorado',
      ])
    })
    // @ts-ignore
    doc.autoTable({
      head: [
        [
          'CPF',
          'CRM',
          'Nome Associado',
          'Data de Nascimento',
          'Categoria',
          'Resultado Processamento',
        ],
      ],
      body: tableDataFormatted,
      styles: { fontSize: 6 },
      headStyles: { fontSize: 8, fillColor: 'rgb(13, 169, 164)' },
    })

    doc.save(`${fileName}.pdf`)
  }

  const isValidHeader = (header: any) => {
    const invalidCpfValue = header.cpf === -1
    const invalidUfCrmValue = header.uf_crm === -1
    const invalidCrmValue = header.crm === -1

    if (invalidCpfValue || invalidUfCrmValue || invalidCrmValue) {
      return false
    }

    return true
  }

  function someAssociadoError(associadosList) {
    const errorFound = associadosList.find((associado) => {
      return !!associado?.error
    })

    return !!errorFound
  }

  function noAssociadoIncluded(associadosList) {
    const associadoWithoutError = associadosList.find((associado) => {
      return !associado?.error
    })

    return !associadoWithoutError
  }

  function getStatusMessage(row: CsvRow, index: number) {
    let message = 'Ignorado'

    if (
      !cpfAlreadyRegistered.includes(row?.cpf) &&
      !apiResponse[index]?.error
    ) {
      message = 'Importado'
    } else if (apiResponse[index]?.error) {
      message = apiResponse[index]?.error
    }

    return message
  }

  function verifyAndChangeAspiranteData(aspiranteData: string) {
    if (aspiranteData.toLowerCase() === 'aspirante') {
      return 'Aspirante'
    }

    return aspiranteData
  }

  return (
    <Container onDrop={handleDrop} onDragOver={handleDragOver}>
      <div>
        <p>Importar SBA</p>
        <BackPage backRoute="/" discartPageBack />
      </div>

      <Box>
        <div
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <label
              htmlFor="file-upload"
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <DownloadSimple size={32} color="rgb(13, 169, 164)" />
              <Text style={{ color: 'black', fontSize: '0.8rem' }}>
                Clique aqui e Selecione um arquivo
              </Text>
              {file && (
                <Text style={{ color: 'black', fontSize: '0.8rem' }}>
                  Arquivo selecionado:{' '}
                  <span style={{ color: '#727272' }}>{file.name}</span>
                </Text>
              )}
            </label>
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 15,
              marginTop: '12px',
            }}
          >
            <Button
              style={{
                margin: '0px',
                fontSize: '12px',
                width: '7rem',
                border: 'solid 1px',
                padding: '0.5rem',
              }}
              title="Importar dados"
              disabled={!file || loading}
              onClick={handleUpload}
            />
            <Button
              style={{
                margin: '0px',
                fontSize: '12px',
                width: '5rem',
                border: 'solid 1px',
                padding: '0.5rem',
              }}
              title="Gerar PDF"
              disabled={tableData.length === 0 || loading}
              onClick={generatePDF}
            />
          </div>
          {loading && (
            <div
              style={{
                marginTop: '-30vh',
              }}
            >
              <Loading />
            </div>
          )}
        </div>
      </Box>

      {file && !loading && (
        <TableContainer style={{ marginTop: 20 }} component={Paper}>
          {notFoundCpfs.length > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                margin: '10px',
              }}
            ></div>
          )}
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow
                style={{ backgroundColor: 'rgb(13, 169, 164)', color: '#fff' }}
              >
                <TableCell style={{ color: '#fff' }}>CPF</TableCell>
                <TableCell style={{ color: '#fff' }}>CRM</TableCell>
                <TableCell style={{ color: '#fff' }} align="left">
                  Nome Associado
                </TableCell>
                <TableCell style={{ color: '#fff' }} align="center">
                  Data de Nascimento
                </TableCell>
                <TableCell style={{ color: '#fff' }} align="right">
                  Categoria
                </TableCell>
                <TableCell style={{ color: '#fff' }} align="right">
                  Resultado Processamento
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.cpf}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.crm}
                  </TableCell>
                  <TableCell align="left">{row.nome_completo}</TableCell>
                  <TableCell align="center">{row.data_nascimento}</TableCell>
                  <TableCell align="right">{row.categoria}</TableCell>
                  <TableCell align="right">
                    {loading ? 'Registrando...' : getStatusMessage(row, index)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  )
}
