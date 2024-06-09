// /* eslint-disable eqeqeq */
// import { useContextCustom } from '@/context'
// import { api } from '@/lib/axios'
// import Box from '@mui/material/Box'
// import CircularProgress from '@mui/material/CircularProgress'
// import { DataGrid } from '@mui/x-data-grid'
// import { useEffect, useState } from 'react'
// import { convertBrFilter } from './convertBrFilter'
// import { Container } from './styled'
// import { Cookie } from 'next/font/google'

// export default function DataGridDemo({ rows, columns, w }: any) {
//   const { setSelection, selectedRowIds, setVoltarPagina, voltarPagina } =
//     useContextCustom()
//   const [pageCache, setPageCache] = useState(0)
//   const [linhasPorPagina, setLinhasPorPagina] = useState(10)
//   const [linhas, setLinhas] = useState([])

//   const [visibleRows, setVisibleRows] = useState([])

//   const handleSelectionModelChange = (newSelectionModel: any) => {
//     console.log(rows)
//     const visibleSelection = newSelectionModel.filter((id: any) =>
//       rows
//         .slice(pageCache * linhasPorPagina, (pageCache + 1) * linhasPorPagina)
//         .map((row: any) => row.id)
//         .includes(id),
//     )

//     setSelection(visibleSelection)

//     if (visibleSelection.length) {
//       localStorage.setItem('@pageCache', JSON.stringify(pageCache))
//       setVoltarPagina(pageCache)
//     }
//   }

//   function handleSetLocalStorage() {
//     const cacheLocalStorage = localStorage.getItem('@pageCache')
//     if (cacheLocalStorage !== null) {
//       setVoltarPagina(cacheLocalStorage)
//     }
//   }

//   useEffect(() => {
//     async function GetParams() {
//       try {
//         await new Promise((resolve) => setTimeout(resolve, 500))
//         const response = await api.get('/parametros')
//         const quantidadeLinhasParametros = await response.data.map(
//           (item: { quantidade_linhas_listas: number }): any =>
//             item.quantidade_linhas_listas,
//         )
//         setLinhas(quantidadeLinhasParametros)
//         setLinhasPorPagina(quantidadeLinhasParametros)
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     GetParams()
//     handleSetLocalStorage()
//   }, [])

//   useEffect(() => {
//     if (rows.length > 0) {
//       // Handle rows update
//       const currentVisibleRows = rows.slice(0, 8)
//       setVisibleRows(currentVisibleRows)
//     } else {
//       setVisibleRows([])
//     }
//   }, [rows])

//   return (
//     <Container style={{ width: '100%' }}>
//       <Box
//         sx={{
//           height: linhas[0] === 8 ? '60%' : '50vh',
//           width: w,
//           marginTop: '1rem',
//         }}
//       >
//         {linhas.length > 0 ? (
//           <>
//             {rows && (
//               <DataGrid
//                 localeText={convertBrFilter}
//                 rows={rows}
//                 rowHeight={34}
//                 columns={columns}
//                 initialState={{
//                   pagination: {
//                     paginationModel: {
//                       page: voltarPagina,
//                       pageSize: linhas[0] !== undefined ? linhas[0] : 10,
//                     },
//                   },
//                 }}
//                 pageSizeOptions={linhas !== undefined ? linhas : [10]}
//                 disableVirtualization
//                 rowSelectionModel={selectedRowIds}
//                 checkboxSelection
//                 onRowSelectionModelChange={handleSelectionModelChange}
//                 onPaginationModelChange={(params) => setPageCache(params.page)}
//               />
//             )}
//           </>
//         ) : (
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               height: '100%',
//             }}
//           >
//             <CircularProgress color="primary" />
//           </Box>
//         )}
//       </Box>
//     </Container>
//   )
// }
/* eslint-disable eqeqeq */

import { useContextCustom } from '@/context'
import { api } from '@/lib/axios'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { convertBrFilter } from './convertBrFilter'
import { Container } from './styled'

export default function DataGridDemo({ rows, columns, w }: any) {
  const { setSelection, selectedRowIds, setVoltarPagina, voltarPagina } =
    useContextCustom()

  const [pageCache, setPageCache] = useState(0)

  const [linhas, setLinhas] = useState([])

  const handleSelectionModelChange = (newSelectionModel: any) => {
    setSelection(newSelectionModel)
    if (newSelectionModel) {
      localStorage.setItem('@pageCache', JSON.stringify(pageCache))
      setPageCache(pageCache)
      setVoltarPagina(pageCache)
    }
  }

  function handleSetLocalStorage() {
    const cacheLocalStorage = localStorage.getItem('@pageCache')
    if (cacheLocalStorage !== null) {
      setVoltarPagina(cacheLocalStorage)
    }
  }

  useEffect(() => {
    async function GetParams() {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        const response = await api.get('/parametros')
        const quantidadeLinhasParametros = await response.data.map(
          (item: { quantidade_linhas_listas: number }): any =>
            item.quantidade_linhas_listas,
        )
        setLinhas(quantidadeLinhasParametros)
      } catch (error) {
        console.log(error)
      }
    }
    GetParams()
    handleSetLocalStorage()
  }, [])

  useEffect(() => {
    if (rows.length == 1) {
      setSelection([rows[0].id])
    } else {
      setSelection([])
    }
    // console.log('renderizou')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows])
  // console.log(linhas)
  // console.log(rows)

  return (
    <Container style={{ width: '100%' }}>
      <Box
        sx={{
          height: linhas[0] === 8 ? '60%' : '50vh',
          width: w,
          marginTop: '1rem',
        }}
      >
        {linhas.length > 0 ? (
          <>
            {rows && (
              <DataGrid
                localeText={convertBrFilter}
                rows={rows}
                rowHeight={34}
                slotProps={{
                  panel: {
                    sx: {
                      top: '-7.75rem !important',
                    },
                  },
                }}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      // setar valor da paginacao
                      page: voltarPagina,
                      pageSize: linhas[0] !== undefined ? linhas[0] : 10,
                    },
                  },
                }}
                pageSizeOptions={linhas !== undefined ? linhas : [10]}
                disableVirtualization
                checkboxSelection
                rowSelectionModel={selectedRowIds}
                onRowSelectionModelChange={handleSelectionModelChange}
                // buscar pagina atual
                onPaginationModelChange={params => setPageCache(params.page)}
              />
            )}
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        )}
      </Box>
    </Container>
  )
}
