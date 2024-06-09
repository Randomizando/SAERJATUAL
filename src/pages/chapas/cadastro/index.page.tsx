import { Container, Box } from './styled'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { SelectOptions } from '@/components/SelectOptions'
import axios from 'axios'
import {
  ContainerInputFile,
  ContentInputFile,
} from '@/pages/associados/atualizar/styled'
import Image from 'next/image'

const integranteSchema = z.object({
  nome: z.string().min(1, { message: 'O campo nome é obrigatório' }),
  cargo: z.string().min(1, { message: 'O campo cargo é obrigatório' }),
  image: z.any(),
})

const schemaChapaForm = z.object({
  nome_chapa: z
    .string()
    .min(1, { message: 'O campo nome da chapa é obrigatório' }),
  membros_chapa: z.array(integranteSchema).nonempty(),
})

type SchemaChapaForm = z.infer<typeof schemaChapaForm>

const configInputFile = {
  type: ['image/jpeg', 'image/png'],
  size: 2, // Tranformar em bytes quando for utilizar
}

export default function VotacaoCreate({ chapas }: any) {
  const router = useRouter()
  const [cargos, setCargos] = useState<any>([])
  const [associados, setAssociados] = useState<any>([])
  const [sendFiles, setSendFiles] = useState<File[]>([])

  useEffect(() => {
    async function getCargosTabelas() {
      const responseCargos = await api.get('/tabelas/get/cargos')
      const responseAssociados = await api.get('/associados/getAll')
      const dataAssociados = responseAssociados.data.filter(
        (associado: any) => associado.id !== 1,
      )

      setAssociados(dataAssociados)
      setCargos(responseCargos.data)
    }
    getCargosTabelas()
  }, [])

  const dataCargos = cargos.map((cargo: any) => {
    return {
      id: cargo.id,
      label: cargo.ocorrencia_tabela,
    }
  })

  const dataAssociados = associados.map((associado: any) => {
    return {
      id: associado.id,
      label: associado.nome_completo,
    }
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
    watch,
  } = useForm<SchemaChapaForm>({
    resolver: zodResolver(schemaChapaForm),
  })

  const { fields, append, remove } = useFieldArray({
    name: 'membros_chapa',
    control,
  })

  async function handleOnSubmit(data: SchemaChapaForm) {
    // console.log(data)
    // Verifica cargos duplicados
    const cargos = data.membros_chapa.map((element) => element.cargo)
    const checkDuplicity = new Set(cargos).size !== cargos.length

    if (checkDuplicity) {
      toast.error('Não pode haver mais de 1 membro com mesmo cargo!')
      return
    }

    const verifyImagesMember = data.membros_chapa.filter((member) => {
      if (
        member.image[0]?.type &&
        !configInputFile.type.includes(member.image[0]?.type)
      )
        return member

      if (member.image[0]?.size > configInputFile.size * 1000000) return member
    })

    if (verifyImagesMember.length > 0) {
      toast.error(
        'Todas as imagens deve estar no formato .jpg ou .png e ter no máximo 5mb',
      )
      return
    }

    // if (file.size > configInputFile.size * 1000000) {
    //   toast.error(
    //     `Tamanho da foto deve ser no máximo ${configInputFile.size}mb`
    //   );
    //   return;
    // }

    // if (file.type !== "image/jpeg" && file.type !== "image/png") {
    //   toast.error(`Foto deve ser nos formatos .jpg ou .png`);
    //   return;
    // }

    const formData = new FormData()
    data.membros_chapa.forEach((file) => {
      if (file.image[0]?.name) {
        const typeFile = file.image[0]?.type?.split('/')[1]
        const newFile = new File(
          [file.image[0]],
          `${data.nome_chapa}-${file.nome}.${typeFile}`,
          { type: file.image[0].type },
        )
        formData.append('anexos', newFile)
      }
    })

    const handlePostUpload = async () => {
      try {
        const response = await axios.post('/api/upload/images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        console.log(response.data)
        const nameFile = response.data.names_arquivos?.map((item: any) => {
          return item.anexoProtocolo
        })

        return response.data
      } catch (error: any) {
        toast.error(error?.response?.data.error)
        console.log(error?.response?.data.error)
      }
    }

    const upload = await handlePostUpload()

    const dataToSend = {
      nome_chapa: data.nome_chapa,
      membros_chapa: data.membros_chapa,
    }

    // imagens para o banco
    const dataInsert = {
      nome_chapa: dataToSend.nome_chapa,
      membros_chapa: dataToSend.membros_chapa.map((membro, index) => ({
        ...membro,
        image: upload[index], // Usando o upload para image
      })),
    }

    await api.post('/votacao/cadastro', dataInsert)

    router.push('/chapas')
    return toast.success('Operação concluída com sucesso!')
  }

  useEffect(() => {
    if (errors.membros_chapa) {
      toast.error('A chapa precisa ter no mínimo 1 membro!')
    }
  }, [errors])

  // function handleChangeFile(event: BaseSyntheticEvent) {
  //   const file = event?.target?.files[0]
  //   if (!file) return

  //   if (file.size > configInputFile.size * 1000000) {
  //     toast.error(
  //       `Tamanho da foto deve ser no máximo ${configInputFile.size}mb`,
  //     )
  //     return
  //   }

  //   if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
  //     toast.error(`Foto deve ser nos formatos .jpg ou .png`)
  //     return
  //   }

  //   setSendFiles([...sendFiles, file])
  // }
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  function handleChangeFile(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > configInputFile.size * 1000000) {
      toast.error(
        `Tamanho da foto deve ser no máximo ${configInputFile.size}mb`,
      )
      return
    }

    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      toast.error(`Foto deve ser nos formatos .jpg ou .png`)
      return
    }

    // Read the file as a Data URL to display the preview
    const reader = new FileReader()
    reader.onload = () => {
      const preview = reader.result as string
      setImagePreviews((prevPreviews) => {
        const newPreviews = [...prevPreviews]
        newPreviews[index] = preview
        return newPreviews
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Box style={{ justifyContent: 'end' }}>
          <Link
            href="/chapas"
            style={{
              textDecoration: 'none',
              fontFamily: 'Roboto',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              color: '#000',
            }}
          >
            <ArrowBendDownLeft size={32} />
            Retornar
          </Link>
        </Box>
        <fieldset>
          <legend>
            <span>
              <Link href={'/chapas'}>Chapas</Link>
            </span>
            <CaretRight size={14} />
            <span>Incluir</span>
          </legend>
          <Box>
            <TextInput
              title="Nome da chapa *"
              {...register('nome_chapa')}
              helperText={errors.nome_chapa?.message}
              w={1360}
              error={!!errors.nome_chapa?.message}
            />
          </Box>

          <Box>
            <h1>Composição da chapa</h1>
            <Button
              onClick={() =>
                append({
                  cargo: '',
                  nome: '',
                  image:
                    'https://icon-library.com/images/no-user-image-icon/no-user-image-icon-9.jpg',
                })
              }
              type="button"
              title="+ Adicionar membro"
              style={{ margin: '0px', width: '100%', fontSize: '12px' }}
            />
          </Box>
          <section
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            {fields.map((membro, index) => {
              const errorForFieldText2 =
                errors?.membros_chapa?.[index]?.nome?.message

              const errorForFieldText3 =
                errors?.membros_chapa?.[index]?.cargo?.message

              return (
                <Box
                  key={index}
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '24rem',
                    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                    padding: '1rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    {imagePreviews[index] && (
                      <Image
                        width={200}
                        height={120}
                        style={{ width: '100%', height: '10rem' }}
                        src={imagePreviews[index]}
                        alt={`Preview do membro ${index}`}
                      />
                    )}
                    <p
                      style={{
                        marginBottom: 16,
                        fontFamily: 'Roboto',
                        fontSize: '12px',
                        color: 'rgba(0, 0, 0, 0.6)',
                      }}
                    >
                      Foto do membro (.jpg ou .png)
                    </p>
                    <ContainerInputFile style={{ width: '250px' }}>
                      <Button title="Selecionar" />
                      <ContentInputFile style={{ width: '250px' }}>
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          {...register(`membros_chapa.${index}.image`)}
                          onChange={(event) => handleChangeFile(event, index)} // Pass index to handle multiple previews correctly
                        />
                        <p>
                          {sendFiles &&
                          sendFiles[0] &&
                          sendFiles[0].name !== undefined
                            ? `${sendFiles[index]?.name}`
                            : 'Selecione a imagem:'}
                        </p>
                      </ContentInputFile>
                    </ContainerInputFile>
                  </div>

                  <SelectOptions
                    w={300}
                    description="Nome do membro *"
                    data={dataAssociados}
                    {...register(`membros_chapa.${index}.nome` as const)}
                    error={!!errorForFieldText2}
                    helperText={errorForFieldText2}
                  />

                  <SelectOptions
                    w={300}
                    description="Cargo"
                    data={dataCargos}
                    {...register(`membros_chapa.${index}.cargo` as const)}
                    error={!!errorForFieldText3}
                    helperText={errorForFieldText3}
                  />

                  {/* <TextInput
                  title="Nome do membro *"
                  {...register(`membros_chapa.${index}.nome` as const)}
                  error={!!errorForFieldText2}
                  helperText={errorForFieldText2}
                /> */}

                  {/* <TextInput
                  title="Cargo do membro *"
                  {...register(`membros_chapa.${index}.cargo` as const)}
                  error={!!errorForFieldText3}
                /> */}

                  <Button
                    onClick={() => remove(index)}
                    type="button"
                    title="Remover membro"
                    style={{ margin: '0px', width: '100%', fontSize: '12px' }}
                  />
                </Box>
              )
            })}
          </section>
          <Button
            title={isSubmitting ? 'Enviando...' : 'Enviar'}
            type="submit"
            disabled={isSubmitting}
          />
        </fieldset>
      </form>
    </Container>
  )
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const data = await prisma.tabelas.findMany();
//     console.log(data)
//     return {
//       props: {
//         chapas: data,
//       },
//     };

//   } catch (error) {
//     console.error("Erro ao obter dados de tipo de empresa:", error);
//     return {
//       props: {
//         data: [],
//       },
//     };
//   } finally {
//     prisma.$disconnect();
//   }
// };
