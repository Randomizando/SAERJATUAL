/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/Button'
import { Container, Box } from './styled'
import { toast } from 'react-toastify'
import { BackPage } from '@/components/BackPage'
import { useDropzone } from 'react-dropzone'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { DownloadSimple } from 'phosphor-react'
import { Loading } from '@/components/Loading'
import dayjs from 'dayjs'
import { gridColumnsTotalWidthSelector } from '@mui/x-data-grid'
import Papa from 'papaparse';

interface CsvRow {
  order_id: string
  order_number: string
  paid_date: string
  order_date: string
  status: string
  order_total: string
  payment_method_title: string
  billing_first_name: string
  billing_last_name: string
  customer_note: string
  customer_note_test: string
  payment_status: string
  situacao: string
  matricula_SAERJ: string
}

interface PaymentDetails {
  order_id: any;
  order_number: any;
  paid_date: string;
  order_date: string;
  status: string;
  order_total: string;
  payment_method_title: string;
  billing_company: string;
  billing_last_name: string;
  billing_first_name: string;
  customer_note: string;
  processing_result: string;
  payment_status?: string;
  situacao: string;
  matricula_SAERJ: string;
}

export default function CsvUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [situacoes, setSituacoes] = useState<{ [cpf: string]: string }>({})
  const [matriculas, setMatriculas] = useState<{ [cpf: string]: string }>({})
  const [tableData, setTableData] = useState<CsvRow[]>([])
  const [loading, setLoading] = useState(false)
  const [notFoundCpfs, setNotFoundCpfs] = useState<string[]>([])
  const [existingMatricula, setExistingMatricula] = useState<string[]>([])
  const [existingDataPedido, setExistingDataPedido] = useState<string[]>([])
  const [existingValor, setExistingValor] = useState<string[]>([])
  const [errorOnUpload, setErrorOnUpload] = useState(false)
  const fileName = file?.name.replace('.csv', '')
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);
  const [importData, setImportData] = useState<string[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles: any) => {
      const droppedFile = acceptedFiles[0];  
      if(droppedFile && droppedFile.type === 'text/csv' || droppedFile.type === 'application/vnd.ms-excel'){
        setFile(acceptedFiles[0])
        toast.success('Operação concluída com sucesso.'); 
      } else {
        toast.error('Formato arquivo de pagamentos inválido.')
      }    
    },
  })

  const formatDate = (dateString: any) => {
    return dayjs(dateString).format('YYYY-MM-DD');
  }

  const clearTableData = () => {
    setTableData([])
    setNotFoundCpfs([])
    setErrorOnUpload(false)
  }

  const handleUpload = async () => {
    if (file && (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel')) {
      clearTableData()
      setLoading(true)
      setErrorOnUpload(false)
      const reader = new FileReader()
      reader.onload = async function (event) {
        if (event.target && event.target.result) {
          const file = event.target.result;
      
          if (file) {
              Papa.parse(file, {
                  complete: async (results) => {
                    const headers: any = results.meta.fields;
                    if (!headers.includes('order_id') || !headers.includes('order_number')) {
                        setLoading(false);
                        setErrorOnUpload(true);
                        toast.error('Formato arquivo de pagamentos inválido.');
                        return;  // Stop further processing
                    }
                    const paymentsProcessed: PaymentDetails[] = []; 
                    const cpfArray: any[] = [];
                      results.data.forEach((row: any) => {
                        const safeReplace = (str: any) => str ? str.replace(/"/g, '') : '';
                          const rowObject: PaymentDetails = {
                            order_id: row.order_id,
                            order_number: row.order_number,
                            paid_date: safeReplace(row.paid_date),
                            order_date: safeReplace(row.order_date),
                            status: row.status,
                            order_total: row.order_total,
                            payment_method_title: safeReplace(row.payment_method_title),
                            billing_company: safeReplace(row.billing_company),
                            billing_first_name: safeReplace(row.billing_first_name),
                            billing_last_name: safeReplace(row.billing_last_name),
                            customer_note: row.customer_note,  
                            processing_result: safeReplace(row.processing_result),
                            situacao: situacoes.situacao || 'CPF não encontrado',
                            matricula_SAERJ: matriculas.matricula_SAERJ || '',
                        };
                          console.log(rowObject, "ROW OBJECT")
                          const cpf = row.customer_note && row.customer_note.match(/\d{3}\.\d{3}\.\d{3}-\d{2}/);
                          if (cpf) {
                              cpfArray.push(cpf[0]);
                          }
                          if (row.customer_note) {
                              const cpfMatch = row.customer_note.match(/\d{3}\.\d{3}\.\d{3}-\d{2}/);
                              if (cpfMatch) {
                                  rowObject.customer_note = cpfMatch[0];  // Atribui o CPF formatado
                              } else {
                                  rowObject.customer_note = "CPF em formato inválido";
                              }
                          }     
                          const safeOrderTotal = rowObject.order_total != null ? String(rowObject.order_total).substring(0, 3) : '';
                          if (!rowObject.status || rowObject.status !== 'completed') {
                              rowObject.payment_status = 'Ignorado';  // Ignora se não está completo
                          }
                          else if (notFoundCpfs.includes(cpf) || row.customer_note === null) {
                              rowObject.payment_status = 'CPF não encontrado';
                          } else {
                              const formattedPaidDate = formatDate(rowObject.paid_date);
                              const isDuplicated = isValueInArray(rowObject.matricula_SAERJ, existingMatricula) &&
                                     isValueInArray(safeOrderTotal, existingValor) &&
                                     isValueInArray(formattedPaidDate, dateFormated);
                          if (isDuplicated) {
                              rowObject.payment_status = 'Duplicado';
                          } else {
                              rowObject.payment_status = 'Importado';
                          }
                       paymentsProcessed.push(rowObject);
                  }
                       });
                      setTableData(paymentsProcessed);
                      await handleSearch(cpfArray, paymentsProcessed);
                      toast.success('Operação concluída com sucesso'); 
                  },
                  header: true,
                  dynamicTyping: true,
                  skipEmptyLines: true
              });
          }
       }  
      }
      reader.readAsText(file)
    } else {
      toast.error('Formato arquivo de pagamentos inválido.')
    }
  }

  const safeReplace = (str: any, pattern: any, replacement: any) => str ? str.replace(pattern, replacement) : '';
  
  const handleSearch = async (cpfList: string[], data: any) => {
    try {
      const response = await axios.post('/api/consultaAssociados', {
        cpfs: cpfList,
      })

      const dataClient: any = []
      const notFoundCpfs: string[] = response.data.notFoundCpfs

      setNotFoundCpfs(notFoundCpfs)
      if (response.data.results && response.data.results.length > 0) {
        // eslint-disable-next-line array-callback-return
        response.data.results.map((result: any) => {
          if (result.situacao) {
            setSituacoes((prevState: any) => ({
              ...prevState,
              [result.cpf.replace(/[.-]/g, '')]: result.situacao,
            }))
          }
          if (result.matricula_SAERJ) {
            setMatriculas((prevState: any) => ({
              ...prevState,
              [safeReplace(result.cpf, /[.-]/g, '')]: result.matricula_SAERJ,
            //  [result.cpf.replace(/[.-]/g, '')]: result.matricula_SAERJ,
            }))
          }
          const rowFinded = data.find(
            (row: any) =>
              safeReplace(row.customer_note, /[.-]/g, '') === safeReplace(result.cpf, /[.-]/g, '')
             // row.customer_note.replace(/[.-]/g, '') ===
             // result.cpf.replace(/[.-]/g, ''),
          )
          if (rowFinded) {
            rowFinded.situacao = result.situacao
            rowFinded.matricula_SAERJ = result.matricula_SAERJ
            if (rowFinded.status === 'completed') {
              const dataObject = {
                matricula_SAERJ: result.matricula_SAERJ,
                ano_anuidade: '2024',
                tipo_pagamento: 'Anuidade',
           //     tipo_pagamento: rowFinded.payment_method_title.replaceAll(
             //     '"',
           //       '',
          //      ),
                forma_pagamento: rowFinded.payment_method_title.replaceAll(
                  '"',
                  '',
                ),
                data_pagto_unico: rowFinded.paid_date.replaceAll('"', ''),
                valor_pagto_unico: rowFinded.order_total,
              }
              dataClient.push(dataObject)
            }
          }
        })
        await uploadPayments(dataClient)
      } else {
        toast.error('Nenhum CPF encontrado.')
      }
    } catch (error) {
      console.error('Erro ao buscar associados:', error)
      toast.error('Erro ao buscar associados.')
    } finally {
      setLoading(false)
    }
  }

  const uploadPayments = async (pagamentoUnico: any) => {
    try {
      const response = await axios.post('/api/adicionarPagamentos', {
        pagamentoUnico,
      })
      const existingMatricula = response.data.existingMatricula
      const existingDataPedido = response.data.existingDataPedido
      const existingValor = response.data.existingValor
      setExistingDataPedido(existingDataPedido)
      setExistingMatricula(existingMatricula)
      setExistingValor(existingValor)
    } catch (error) {
      console.error('Erro ao enviar dados de pagamento:', error)
      toast.error('Erro ao adicionar pagamento.')
      setErrorOnUpload(true)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile.type === 'text/csv' || droppedFile.type === 'application/vnd.ms-excel') {
      setFile(droppedFile)
      toast.success('Operação concluída com sucesso.'); 
    } else {
      toast.error('Formato arquivo de pagamentos inválido.')
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const generatePDF = () => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF()
    const tableDataFormatted: any = []
    tableData.forEach((row: any) => {
      let resultData = '';
      if (notFoundCpfs.includes(row.customer_note) || row.customer_note == null){
        resultData = 'CPF não encontrado';
      } else if (row.status !== 'completed' && 
        notFoundCpfs.includes(row.customer_note)){
        resultData = 'Ignorado';
      } else if (row.status !== 'completed' &&
        !notFoundCpfs.includes(row.customer_note)){
          resultData = 'Ignorado';
      } else {
        const formattedPaidDate = formatDate(row.paid_date);
        const isDuplicated = isValueInArray(row.matricula_SAERJ, existingMatricula) &&
                             isValueInArray(String(row.order_total).substring(0, 3), existingValor) &&
                             isValueInArray(formattedPaidDate, dateFormated);
         if(isDuplicated) {
          resultData = 'Duplicado';
         } else {
          resultData = 'Importado'; 
         }
      } 
      tableDataFormatted.push([
        row.order_id,
        row.matricula_SAERJ,
        row.order_date,
        row.paid_date,
        row.status,
        row.order_total,
        row.payment_method_title,
        row.billing_last_name,
        row.billing_first_name,
        row.customer_note,
        resultData,
      ]);
    });

    const headStyles = {
      fillColor: [13, 169, 164],
      textColor: [255, 255, 255],
      fontSize: 8,
    }

    // @ts-ignore
    doc.autoTable({
      head: [
        [
          'ID',
          'Matr SAERJ',
          'Data Pedido',
          'Data Pgto',
          'Status',
          'Valor',
          'Método',
          'Nome',
          'Sobrenome',
          'CPF Titular',
          'Resultado Processamento',
        ],
      ],
      body: tableDataFormatted,
      styles: { fontSize: 6 },
      headStyles,
    })

    doc.save(`${fileName}.pdf`)
  }

  const isValueInArray = (value: any, array: any) => {
    return array.some((subArray: any) => subArray.includes(value))
  }
 
  const dateFormated = existingDataPedido.map((date: any) => formatDate(date));

  return (
    <Container onDrop={handleDrop} onDragOver={handleDragOver}>
      <div>
        <p>Importar Pagtos</p>
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
          {!loading && (
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <div>
                <DownloadSimple
                  color="rgb(13, 169, 164)"
                  style={{ marginLeft: 70 }}
                  size={30}
                />
                <p style={{ fontSize: 11, marginTop: 2 }}>
                  Clique aqui e Selecione um arquivo
                </p>
              </div>
            </div>
          )}
          {!loading && (
            <div
              style={{
                display: 'flex',
                marginTop: 10,
                gap: 3,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {file && <p style={{ fontSize: 12 }}>Arquivo selecionado:</p>}
              {file && (
                <p style={{ fontSize: 12, color: '#787878' }}>{file.name}</p>
              )}
            </div>
          )}

          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 15,
              marginTop: 20,
            }}
          >
            {file && !loading && (
              <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                <Button
                  style={{
                    margin: '0px',
                    fontSize: '12px',
                    width: '6.5rem',
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
            )}
          </div>
        </div>
      </Box>

      {loading && (
        <div style={{ justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ marginLeft: '38%' }}>
            Processando pagamentos, por favor aguarde…
          </p>
          <Loading />
        </div>
      )}

      {file && !loading && tableData.length > 0 && (
        <TableContainer style={{ marginTop: 20 }} component={Paper}>
          <Table sx={{ minWidth: 1000 }} aria-label="simple table">
            <TableHead>
              <TableRow style={{ backgroundColor: 'rgb(13, 169, 164)' }}>
                <TableCell style={{ color: '#FFF' }}>ID</TableCell>
                <TableCell style={{ color: '#FFF' }} align="center">
                  Matr SAERJ
                </TableCell>
                <TableCell style={{ color: '#FFF' }} align="center">
                  Data Pedido
                </TableCell>
                <TableCell style={{ color: '#FFF' }} align="center">
                  Data Pgto
                </TableCell>
                <TableCell style={{ color: '#FFF' }} align="center">
                  Status
                </TableCell>
                <TableCell style={{ color: '#FFF' }} align="center">
                  Valor
                </TableCell>
                <TableCell style={{ color: '#FFF' }} align="center">
                  Método
                </TableCell>
                <TableCell style={{ color: '#FFF' }} align="center">
                  Nome
                </TableCell>
                <TableCell
                  style={{ paddingLeft: 50, color: '#FFF' }}
                  align="left"
                >
                  Sobrenome
                </TableCell>
                <TableCell style={{ color: '#FFF' }} align="center">
                  CPF Titular
                </TableCell>
                <TableCell style={{ color: '#FFF' }} align="center">
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
                  <TableCell
                    style={{ fontSize: 11 }}
                    component="th"
                    scope="row"
                  >
                    {row.order_id}
                  </TableCell>
                  <TableCell style={{ fontSize: 11 }} align="center">
                    {row.matricula_SAERJ}
                  </TableCell>
                  <TableCell
                    style={{ fontSize: 11 }}
                    sx={{ maxWidth: 100 }}
                    align="center"
                  >
                    {row.order_date}
                  </TableCell>
                  <TableCell
                    style={{ fontSize: 11 }}
                    sx={{ maxWidth: 100 }}
                    align="center"
                  >
                    {row.paid_date}
                  </TableCell>
                  <TableCell style={{ fontSize: 11 }} align="center">
                    {row.status}
                  </TableCell>
                  <TableCell style={{ fontSize: 11 }} align="center">
                    {row.order_total}
                  </TableCell>
                  <TableCell
                    style={{ fontSize: 11 }}
                    align="center"
                    sx={{ maxWidth: 140 }}
                  >
                    {row.payment_method_title}
                  </TableCell>
                  <TableCell
                    style={{ fontSize: 11 }}
                    sx={{ maxWidth: 80 }}
                    align="center"
                  >
                    {row.billing_first_name}
                  </TableCell>
                  <TableCell
                    style={{ paddingLeft: 50, fontSize: 11 }}
                    sx={{ maxWidth: 190 }}
                    align="left"
                  >
                    {row.billing_last_name}
                  </TableCell>
                  <TableCell align="center" style={{ fontSize: 11 }}>
                    {notFoundCpfs.includes(row.customer_note)
                      ? `${row.customer_note}`
                      : row.customer_note}
                  </TableCell>
                  <TableCell style={{ fontSize: 11 }} align="center">
                    {(() => {
                    if (!errorOnUpload) {
                      if (notFoundCpfs.includes(row.customer_note) || row.customer_note === null) {
                         return 'CPF não encontrado'; // Caso o CPF não seja encontrado
                      } else if (row.status !== 'completed') {
                         return 'Ignorado'; // Ignora se não estiver completo
                      } else if (row.status === 'completed') {
                      // Formatar a data antes da verificação
                    const formattedPaidDate = formatDate(row.paid_date);
                    const isDuplicated = isValueInArray(row.matricula_SAERJ, existingMatricula) &&
                                isValueInArray(String(row.order_total).substring(0, 3), existingValor) &&
                                isValueInArray(formattedPaidDate, dateFormated);
                         return isDuplicated ? 'Duplicado' : 'Importado';
                     }
                    }
                  return ''; // Se houver erro no upload, não mostra nada
                   })()}
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
