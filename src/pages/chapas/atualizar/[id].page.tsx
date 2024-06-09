import { Container, Box } from './styled'
import React, {
  BaseSyntheticEvent,
  HTMLInputTypeAttribute,
  useEffect,
  useState,
} from 'react'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/axios'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next/types'
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
  image: z.any(),
  nome: z.string().min(1, { message: 'O campo nome é obrigatório' }),
  cargo: z.string().min(1, { message: 'O campo cargo é obrigatório' }),
})

// const fileSchema = z.object({
//   name: z.string(),
//   lastModified: z.number(),
//   lastModifiedDate: z.date(),
//   webkitRelativePath: z.string(),
//   size: z.number(),
//   type: z.string(),
//   nomeChapa: z.string(),
//   nomeMembro: z.string(),
// });

const schemaChapaForm = z.object({
  nome_da_chapa: z
    .string()
    .min(1, { message: 'O campo nome da chapa é obrigatório' }),
  integrantes: z.array(integranteSchema).nonempty(),
  anexos: z.any(),
})

type SchemaChapaForm = z.infer<typeof schemaChapaForm>

type Props = {
  data: any
  dataAssociados: any
  dataCargos: any
}

const configInputFile = {
  type: ['image/jpeg', 'image/png'],
  size: 5, // Valor em megabytes
}

export default function VotacaoAtualizar({
  data,
  dataAssociados,
  dataCargos,
}: Props) {
  const router = useRouter()
  const [sendFiles, setSendFiles] = useState<File[]>([])

  const fitlerCargos = dataCargos.map((cargo: any) => {
    return {
      label: cargo,
    }
  })

  const fitlerAssociados = dataAssociados.map((associado: any) => {
    return {
      label: associado,
    }
  })

  const { id }: any = router.query
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
    control,
  } = useForm<SchemaChapaForm>({
    resolver: zodResolver(schemaChapaForm),
  })

  const { fields, append, remove } = useFieldArray({
    name: 'integrantes',
    control,
  })

  async function handleOnSubmit(data: SchemaChapaForm) {
    // Verifica cargos duplicados
    console.log(data)
    const cargos = data.integrantes.map((element) => element.cargo)
    const checkDuplicity = new Set(cargos).size !== cargos.length

    if (checkDuplicity) {
      toast.error('Não pode haver mais de 1 membro com mesmo cargo!')
      return
    }

    const verifyImagesMember = data.integrantes.filter((member) => {
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

    const formData = new FormData()
    data.integrantes.forEach((file) => {
      if (file.image[0]?.name) {
        const typeFile = file.image[0]?.type?.split('/')[1]
        const newFile = new File(
          [file.image[0]],
          `${data.nome_da_chapa}-${file.nome}.${typeFile}`,
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
        return response.data
      } catch (error: any) {
        toast.error(error?.response?.data.error)
        console.log(error?.response?.data.error)
      }
    }

    const upload = await handlePostUpload()

    const dataToSend = {
      nome_chapa: data.nome_da_chapa,
      membros_chapa: data.integrantes,
    }

    // imagens para o banco
    const dataInsert = {
      id: Number(id),
      nome_chapa: dataToSend.nome_chapa,
      membros_chapa: dataToSend.membros_chapa.map((membro, index) => {
        // console.log(membro, index)
        // console.log(typeof membro.image)
        const isFileList = membro.image instanceof FileList
        console.log(isFileList)
        console.log(upload)
        console.log(upload[0])
        return {
          ...membro,
          image: isFileList ? upload[0] : membro.image,
        }
      }),
    }
    console.log(dataInsert)

    await api.put('/votacao/update', dataInsert)

    router.push('/chapas')

    return toast.success('Operação concluída com sucesso!')
  }

  useEffect(() => {
    setValue('nome_da_chapa', data.nome_chapa)
    setValue('integrantes', data.membros_chapa)
  }, [data, setValue])

  useEffect(() => {
    if (errors.integrantes) {
      toast.error('A chapa precisa ter no mínimo 1 membro!')
    }
  }, [errors])

  // function handleChangeFile(event: BaseSyntheticEvent) {
  //   const file = event?.target?.files[0]
  //   if (!file) return

  //   if (file.size > configInputFile.size * 1000000) {
  //     toast.error(
  //       `Tamanho do arquivo deve ser no máximo ${configInputFile.size}mb`,
  //     )
  //     return
  //   }

  //   if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
  //     toast.error(`O arquivo deve estar no formato .jpg ou .png`)
  //     return
  //   }

  //   setSendFiles([...sendFiles, file])
  // }
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [disabledInputFile, setDisabledInputFile] = useState<boolean>(false)

  function handleChangeFile(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) {
    if (currentIndex !== null && currentIndex !== index) {
      return toast.warn('Selecione uma imagem por vez')
    }
    // console.log(imagePreviews.length)
    // if (imagePreviews.length === 1) {
    //   setImagePreviews([])
    //   setDisabledInputFile(true)
    //   return toast.warn('Selecione uma imagem por vez')
    // }
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
      setCurrentIndex(index)
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
            <Link href="/chapas">Chapas</Link>
            <CaretRight size={14} />
            <span>Ver/Atualizar</span>
          </legend>

          <Box>
            <TextInput
              title="Nome da chapa *"
              {...register('nome_da_chapa')}
              helperText={errors.nome_da_chapa?.message}
              w={1360}
              error={!!errors.nome_da_chapa?.message}
            />
          </Box>

          <Box>
            <h3>Composição da chapa</h3>
            <Button
              onClick={() =>
                append({
                  image:
                    'https://icon-library.com/images/no-user-image-icon/no-user-image-icon-9.jpg',
                  nome: '',
                  cargo: '',
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
              // console.log(membro.image[1])
              const errorForFieldText2 =
                errors?.integrantes?.[index]?.nome?.message

              const errorForFieldText3 =
                errors?.integrantes?.[index]?.cargo?.message

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
                  {/* {imagePreviews[index] && (
                    <Image
                      width={200}
                      height={120}
                      style={{ width: '100%', height: '10rem' }}
                      src={imagePreviews[index]}
                      alt={`Preview do membro ${index}`}
                    />
                  )} */}

                  <Image
                    width={200}
                    height={120}
                    style={{ width: '100%', height: '10rem' }}
                    src={
                      imagePreviews[index] ||
                      `/upload/images/${membro.image[0]}/${
                        membro.image[1]
                      }?timestamp=${Date.now()}`
                    }
                    alt={`${membro.image[1]}`}
                  />

                  <div>
                    <p
                      style={{
                        marginBottom: 16,
                        fontFamily: 'Roboto',
                        fontSize: '12px',
                        color: 'rgba(0, 0, 0, 0.6)',
                      }}
                    >
                      Editar Foto do membro (.jpg ou .png)
                    </p>
                    <ContainerInputFile style={{ width: '250px' }}>
                      <Button title="Selecionar" />
                      <ContentInputFile style={{ width: '250px' }}>
                        {/* <input
                          key={index}
                          type="file"
                          accept="image/png, image/jpeg"
                          {...register(`integrantes.${index}.image`)}
                        /> */}
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          {...register(`integrantes.${index}.image`)}
                          onChange={(event) => handleChangeFile(event, index)} // Pass index to handle multiple previews correctly
                          disabled={disabledInputFile}
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
                    {/* <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onInput={handleChangeFile}
                    multiple
                    {...register(`integrantes.${index}.image`)}
                  /> */}
                  </div>

                  <SelectOptions
                    w={300}
                    description="Nome do membro *"
                    data={fitlerAssociados}
                    defaultValue={membro.nome}
                    {...register(`integrantes.${index}.nome` as const)}
                    error={!!errorForFieldText2}
                    helperText={errorForFieldText2}
                  />

                  <SelectOptions
                    w={300}
                    description="Cargo"
                    data={fitlerCargos}
                    defaultValue={membro.cargo}
                    {...register(`integrantes.${index}.cargo` as const)}
                    error={!!errorForFieldText3}
                    helperText={errorForFieldText3}
                  />

                  {/* <TextInput
                  title="Nome do membro *"
                  {...register(`integrantes.${index}.nome` as const)}
                  error={!!errorForFieldText2}
                />

                <TextInput
                  title="Cargo do membro *"
                  {...register(`integrantes.${index}.cargo` as const)}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: any = context.params

  try {
    const data = await prisma.chapas.findFirst({
      where: {
        id: Number(id),
      },
    })

    const responseAssociados = await prisma.associados.findMany({
      where: {
        id: {
          not: 1,
        },
      },
    })
    const responseCargos = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Cargos_Dir',
        ocorrencia_ativa: true,
      },
    })

    const dataAssociados = responseAssociados.map(
      (membro) => membro.nome_completo,
    )
    const dataCargos = responseCargos.map((cargo) => cargo.ocorrencia_tabela)

    return {
      props: {
        data,
        dataCargos,
        dataAssociados,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados de tipo de empresa:', error)
    return {
      props: {
        data: [],
      },
    }
  } finally {
    prisma.$disconnect()
  }
}
