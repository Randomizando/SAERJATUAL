/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
import { Button } from '@/components/Button';
import Modal from '@/components/Modal';
import { SelectOptions } from '@/components/SelectOptions';
import { SwitchInput } from '@/components/SwitchInput';
import { TextInput } from '@/components/TextInput';
import { api } from '@/lib/axios';
import { prisma } from '@/lib/prisma';
import { ContainerInputFile, ContentInputFile } from '@/pages/associados/atualizar/styled';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CaretRight } from 'phosphor-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { BackPage } from '../../../components/BackPage';
import { useArrayDate } from '../../../utils/useArrayDate';
import { FilesContainer } from '../incluir/styled';
import { Box, Container, FormError, Text } from './styled';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// import 'react-date-picker/dist/DatePicker.css';
// import 'react-calendar/dist/Calendar.css';

const schemaProtocoloForm = z.object({
  id: z.number(),
  num_protocolo: z.string({ required_error: 'Campo Obrigatório' }).min(1, 'Campo Obrigatório'),
  assunto_protocolo: z.string({ required_error: 'Campo Obrigatório' }).min(1, 'Campo Obrigatório'),
  tipo_protocolo: z.string({ required_error: 'Campo Obrigatório' }).min(1, 'Campo Obrigatório'),
  data_recebimento_dia: z.coerce.string(),
  data_recebimento_mes: z.coerce.string(),
  data_recebimento_ano: z.coerce.string(),
  data_envio_dia: z.coerce.string(),
  data_envio_mes: z.coerce.string(),
  data_envio_ano: z.coerce.string(),
  meio_recebimento: z.string(),
  meio_envio: z.string(),
  entregue_em_maos: z.boolean(),
  obrigatoria_resp_receb: z.boolean(),
  anexos: z.any(), // ALTERAR PARA ANEXO DE ARQUIVO
  anexos2: z.any(), // ALTERAR PARA ANEXO DE ARQUIVO
  data_encerramento_protocolo_dia: z.coerce.string(),
  data_encerramento_protocolo_mes: z.coerce.string(),
  data_encerramento_protocolo_ano: z.coerce.string(),
  usuario_encerramento: z.string({ required_error: 'Campo Obrigatório' }).min(1, 'Campo Obrigatório'), // ALTERAR PARA USUÁRIO
});

type SchemaProtocoloForm = z.infer<typeof schemaProtocoloForm>;
interface schemaProtocoloProps {
  data: any;
  dataMeioProtocol: any;
  dataCategory: any;
  ignoreErrors: boolean;
}

interface schemaFormError {
  data_recebimento?: { message: string | null; };
  meio_envio?: { message: string | null; };
  data_envio?: { message: string | null; };
  meio_recebimento?: { message: string | null; };
}

export default function ProtocolosAtualizar({ data, dataMeioProtocol, dataCategory, ignoreErrors }: schemaProtocoloProps) {
  // console.log(data[0].anexos)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFiles2, setSelectedFiles2] = useState<File[]>([]);
  const [formError, setFormError] = useState<schemaFormError>({});
  const [actualAnnex, setActualAnnex] = useState<string[]>(data[0]?.anexos ? data[0].anexos.split(',').filter((item: any) => !!item) : []);
  const [actualAnnex2, setActualAnnex2] = useState<string[]>(data[0]?.anexos2 ? data[0].anexos2.split(',').filter((item: any) => !!item) : []);
  const [reloadEffect, setReloadEffect] = useState(0)
  const dataDays = useArrayDate.Dia();
  const dataMonths = useArrayDate.Mes();
  const dataYears = useArrayDate.AnoAtualMenor();

  // async function handleDeleteFile(fileName: string, annexNumber: 1 | 2) {

  //   const annex = annexNumber === 1 ? actualAnnex : actualAnnex2;
  //   console.log({ annex, actualAnnex2 });
  //   const updatedAnnex = annex.filter(file => file !== fileName);

  //   await api.delete(
  //     '/upload/delete',
  //     { params: { fileName } }
  //   )
  //     .then(async () => {
  //       await api.post(
  //         '/protocolos/update/anexos',
  //         {
  //           id: data[0].id,
  //           ...(annexNumber === 1 ?
  //             { anexos: updatedAnnex.toString() } :
  //             { anexos2: updatedAnnex.toString() }
  //           )
  //         }
  //       ).then(() => {
  //         if (annexNumber === 1) {
  //           setActualAnnex(updatedAnnex);
  //         } else {
  //           setActualAnnex2(updatedAnnex);
  //         }
  //         toast.info('Arquivo excluído com sucesso!');
  //       })
  //         .catch(() => {
  //           toast.error('Erro ao excluir arquivo!');
  //         });
  //     })
  //     .catch(() => {
  //       toast.error('Erro ao excluir arquivo!');
  //     });
  // }

  // const tipoProtocoloOptionsData = [
  //   { id: 1, label: 'Entrada' },
  //   { id: 2, label: 'Saída' },
  // ]

  // const meioProtocoloOptionsData = [
  //   { id: 1, label: 'Corrêio' },
  //   { id: 2, label: 'Email' },
  //   { id: 3, label: 'Whatsapp' },
  //   { id: 4, label: 'Web Site' },
  // ]
  const usuarioEncerramento = [
    {
      id: 1,
      label: 'ALM - Andrea Laino Marinho',
    },
    {
      id: 2,
      label: 'MAA - Marcelo Artur Almeida Santos'
    },
    {
      id: 2,
      label: 'TSA - Tania Santos de Andrade Barbosa'
    }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      const filesArray = Array.from(fileList);
      setSelectedFiles(filesArray);
    }
  };
  const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      const filesArray = Array.from(fileList);
      setSelectedFiles2(filesArray);
    }
  };

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<SchemaProtocoloForm>({
    resolver: zodResolver(schemaProtocoloForm),
    // mode: 'onBlur'
  });
  // console.log(errors)
  async function OnSubmit(dataSubmit: SchemaProtocoloForm) {
    const datasRecebimento = verificaData(dataSubmit, 'recebimento');
    const datasEncerramento = verificaData(dataSubmit, 'encerramento');

    let dataEnvio;
    let dataRecebimento;
    let dataEncerramento;

    if (dataSubmit.data_envio_dia && dataSubmit.data_envio_mes && dataSubmit.data_envio_ano) {
      dataEnvio = useArrayDate.MontarDate(
        dataSubmit.data_envio_ano,
        dataSubmit.data_envio_mes,
        dataSubmit.data_envio_dia,
      );

    }
    if (
      dataSubmit.data_recebimento_dia &&
      dataSubmit.data_recebimento_mes &&
      dataSubmit.data_recebimento_ano
    ) {
      dataRecebimento = useArrayDate.MontarDate(
        dataSubmit.data_recebimento_ano,
        dataSubmit.data_recebimento_mes,
        dataSubmit.data_recebimento_dia,
      )
    }

    if (
      dataSubmit.data_encerramento_protocolo_dia &&
      dataSubmit.data_encerramento_protocolo_mes &&
      dataSubmit.data_encerramento_protocolo_ano
    ) {
      dataEncerramento = useArrayDate.MontarDate(
        dataSubmit.data_encerramento_protocolo_ano,
        dataSubmit.data_encerramento_protocolo_mes,
        dataSubmit.data_encerramento_protocolo_dia,
      );
    }

    if (
      dataEncerramento &&
      dataEnvio &&
      new Date(dataEncerramento) < new Date(dataEnvio)
    ) {
      return toast.warn(
        'A data de encerramento deve ser maior que as demais datas',
      )
    }
    if (
      dataEncerramento &&
      dataRecebimento &&
      new Date(dataEncerramento) < new Date(dataRecebimento)
    ) {
      return toast.warn(
        'A data de encerramento deve ser maior que as demais datas',
      )
    }

    if (dataRecebimento && dataEnvio && dataEnvio < dataRecebimento) {
      return toast.warn('Data de Envio precisa ser maior ou igual a data de recebimento.')
    }
    if (dataRecebimento && dataEncerramento && dataEncerramento < dataRecebimento) {
      return toast.warn('Data de Encerramento precisa ser maior ou igual a data de Recebimento.')
    }

    if (String(dataSubmit.tipo_protocolo.toLowerCase()) === String('saída')) {
      if (dataSubmit.meio_envio === '') {

        setFormError({
          meio_envio: { message: 'Campo Obrigatório' }
        });

        return toast.warn('Meio Envio Obrigatório');
      } else if (dataEnvio === undefined) {

        setFormError({ data_envio: { message: 'Campo Obrigatório' } });
        return toast.warn('Data Envio Incompleta');
      }
    }

    if (String(dataSubmit.tipo_protocolo.toLowerCase()) === String('entrada')) {
      if (dataSubmit.meio_recebimento === '') {
        setFormError({ meio_recebimento: { message: 'Campo Obrigatório' } });
        return toast.warn('Meio Recebimento Obrigatório');
      } else if (dataRecebimento === undefined) {
        setFormError({ data_recebimento: { message: 'Campo Obrigatório' } });
        return toast.warn('Data Recebimento Incompleta');
      }
    }

    // if (
    //   dataSubmit.num_protocolo == '' ||
    //   dataSubmit.tipo_protocolo == '' ||
    //   dataSubmit.assunto_protocolo == ''
    // ) {
    //   toast.error('Preencha os campos obrigatórios (*).');
    // } else if (
    //   (dataEnvio != null &&
    //     dataRecebimento != null) &&
    //   new Date(dataRecebimento) < new Date(dataEnvio)
    // ) {
    //   toast.error('A data de recebimento deve ser maior que a data de envio.');
    // } else if (datasRecebimento == false) {
    //   toast.error(
    //     'A data de recebimento deve ser toda preenchida (dia, mês e ano).',
    //   );
    // }

    const {
      data_envio_dia,
      data_envio_mes,
      data_envio_ano,
      data_recebimento_dia,
      data_recebimento_mes,
      data_recebimento_ano,
      data_encerramento_protocolo_dia,
      data_encerramento_protocolo_mes,
      data_encerramento_protocolo_ano,
      anexos,
      anexos2,
      ...newData
    } = dataSubmit;
    // console.log(selectedFiles, selectedFiles2)
    if (selectedFiles?.length || selectedFiles2?.length) {
      const formData = new FormData();
      // console.log( 'files exist? ===>>', newData, dataSubmit)
      formData.append('entrada_0', selectedFiles[0]);
      formData.append('saida_1', selectedFiles2[0]);

      try {
        const response = await api.post('/upload/protocolos', formData);

        let anexos: string = "";
        let anexos2: string = "";

        response.data.files.forEach((fileName: string) => {
          if (fileName.includes('ENTRADA')) {
            anexos += fileName + ",";
          } else if (fileName.includes('SAIDA')) {
            anexos2 += fileName + ",";
          }
        });
        // console.log(anexos)
        // Remova a última vírgula das strings, se houver
        anexos = anexos.replace(/,$/, "");
        anexos2 = anexos2.replace(/,$/, "");
        // console.log(response.data.files)
        // Verifica se existem tanto anexos quanto anexos2 para atualizar
        if (anexos && anexos2) {
          await api.put('/protocolos/update', {
            ...newData,
            data_envio: dataEnvio || null,
            data_recebimento: dataRecebimento || null,
            data_encerramento: dataEncerramento || null,
            anexos: anexos,
            anexos2: anexos2,
          });
        } else if (anexos) { // Verifica se há apenas anexos para atualizar
          await api.put('/protocolos/update', {
            ...newData,
            data_envio: dataEnvio || null,
            data_recebimento: dataRecebimento || null,
            data_encerramento: dataEncerramento || null,
            anexos: anexos,
          });
        } else if (anexos2) { // Verifica se há apenas anexos2 para atualizar
          await api.put('/protocolos/update', {
            ...newData,
            data_envio: dataEnvio || null,
            data_recebimento: dataRecebimento || null,
            data_encerramento: dataEncerramento || null,
            anexos2: anexos2,
          });
        }
        // await api.put('/protocolos/update', {
        //   ...newData,
        //   data_envio: dataEnvio || null,
        //   data_recebimento: dataRecebimento || null,
        //   data_encerramento: dataEncerramento || null,
        //   anexos: anexos,
        //   anexos2: anexos2,
        // });

        toast.success('Operação concluída com sucesso');
        return router.push('/protocolos');
      } catch (error: any) {
        toast.error('Erro ao salvar arquivo');
        console.log(error);
        return;
      }
    }

    try {
      // console.log(newData, dataSubmit)
      await api.put('/protocolos/update', {
        ...newData,
        data_envio: dataEnvio || null,
        data_recebimento: dataRecebimento || null,
        data_encerramento: dataEncerramento || null,
      });
      toast.success('Operação concluída com sucesso');
      return router.push('/protocolos');
    } catch (error) {
      console.log('Error =>', error)
    }
  }

  const verificaData = (data: SchemaProtocoloForm, tipoData: string) => {
    if (tipoData == 'encerramento') {
      if (
        !Number.isNaN(data.data_encerramento_protocolo_dia) ||
        !Number.isNaN(data.data_encerramento_protocolo_mes) ||
        !Number.isNaN(data.data_encerramento_protocolo_ano)
      ) {
        if (
          Number.isNaN(data.data_encerramento_protocolo_dia) ||
          Number.isNaN(data.data_encerramento_protocolo_mes) ||
          Number.isNaN(data.data_encerramento_protocolo_ano)
        ) {
          return false;
        } else {
          return true;
        }
      }
    }

    if (tipoData == 'recebimento') {
      if (
        !Number.isNaN(data.data_recebimento_dia) ||
        !Number.isNaN(data.data_recebimento_mes) ||
        !Number.isNaN(data.data_recebimento_ano)
      ) {
        if (
          Number.isNaN(data.data_recebimento_dia) ||
          Number.isNaN(data.data_recebimento_mes) ||
          Number.isNaN(data.data_recebimento_ano)
        ) {
          return false;
        } else {
          return true;
        }
      }
    }
  };

  function setInitialValues() {
    setValue('id', data[0].id);
    setValue('num_protocolo', data[0].num_protocolo);
    setValue('assunto_protocolo', data[0].assunto_protocolo);
    setValue('tipo_protocolo', data[0].tipo_protocolo);
    setValue('data_recebimento_dia', data[0].data_recebimento.dia || '');
    setValue('data_recebimento_mes', data[0].data_recebimento.mes || '');
    setValue('data_recebimento_ano', data[0].data_recebimento.ano || '');
    setValue('data_envio_dia', data[0].data_envio.dia || '');
    setValue('data_envio_mes', data[0].data_envio.mes || '');
    setValue('data_envio_ano', data[0].data_envio.ano || '');
    setValue('meio_recebimento', data[0].meio_recebimento);
    setValue('meio_envio', data[0].meio_envio);
    setValue('entregue_em_maos', data[0].entregue_em_maos);
    setValue('obrigatoria_resp_receb', data[0].obrigatoria_resp_receb);
    setValue(
      'data_encerramento_protocolo_dia',
      data[0].data_encerramento.dia || ''
    );
    setValue(
      'data_encerramento_protocolo_mes',
      data[0].data_encerramento.mes || ''
    );
    setValue(
      'data_encerramento_protocolo_ano',
      data[0].data_encerramento.ano || ''
    );
    setValue(
      'usuario_encerramento',
      data[0].usuario_encerramento,
    );
  }
  function handleGetDayNow(type: string) {
    const dateNow: Date = new Date()

    const formatDate = format(dateNow, 'yyyy-MM-dd', {
      locale: ptBR,
    })

    const date = useArrayDate.DesestruturarDate(formatDate.toString())

    if (type === 'recebimento') {
      setValue('data_recebimento_dia', date.dia)
      setValue('data_recebimento_mes', date.mes)
      setValue('data_recebimento_ano', date.ano)
    } else if (type === 'envio') {
      setValue('data_envio_dia', date.dia)
      setValue('data_envio_mes', date.mes)
      setValue('data_envio_ano', date.ano)
    }
  }
  //  SERVE P/ ATUALIZA O CAMPO DO ARQUIVO PARA NULL OPCIONAL/ DELETAR ARQUIVO
  async function handleDeleteFile(fileName: string) {
    try {
      //DELETA O ARQUIVO PERMANENTEMENTE ROTA DELETE
      // await api.delete('/upload/delete', { data: { fileName } });
      const response = await api.put('/protocolos/update', {
        data: {
          id: data[0].id,
          fileName: fileName
        }
      })
      console.log(response.statusText)
      if (response.statusText === 'OK') {
        toast('Arquivo Excluido com sucesso')
      } else {
        toast('Erro ao deletar arquivo')
      }
      router.push(`/protocolos/atualizar/${data[0].id}`)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setInitialValues();
  }, []);

  return (
    <Container>
      <form onSubmit={handleSubmit(
        OnSubmit, (err => {
          console.log(err);
        })
      )}>
        <Box style={{ justifyContent: 'end' }}>
          <BackPage backRoute="/protocolos" />
        </Box>
        <fieldset>
          <legend>
            <span>
              <Link href={'/protocolos'}>Protocolos</Link>
            </span>
            <CaretRight size={14} />
            <span>Ver/Atualizar</span>
          </legend>
          <Box>
            <div style={{ width: '10%' }}>
              <TextInput
                title="Número do Protocolo *"
                {...register('num_protocolo')}
                defaultValue={data[0]?.num_protocolo}
                disabled={true}
              />
            </div>

            <div>
              <SelectOptions
                data={dataCategory}
                description="Tipo Protocolo *"
                w={200}
                {...register('tipo_protocolo')}
                defaultValue={
                  dataCategory.find(
                    (option: any) => option.label === data[0].tipo_protocolo,
                  ) || null
                }
                helperText={errors.tipo_protocolo?.message}
                error={!!errors.tipo_protocolo?.message}
              />
            </div>

            <div>
              <SwitchInput
                title="Documento de entrada requer resposta?"
                {...register('obrigatoria_resp_receb')}
                defaultChecked={data[0].obrigatoria_resp_receb}
              />
            </div>

            <div>
              <SwitchInput
                title="Entregue em mãos?"
                {...register('entregue_em_maos')}
                defaultChecked={data[0].entregue_em_maos}
              />
            </div>

          </Box>
          <div style={{ width: '40%' }}>
            <TextInput
              title="Assunto Protocolo *"
              {...register('assunto_protocolo')}
              defaultValue={data[0].assunto_protocolo}
              helperText={errors.assunto_protocolo?.message}
              error={!!errors.assunto_protocolo?.message}
            />
          </div>

          <Box>

            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'end',
                  width: '27rem',
                }}
              >
                <Text>Data de Recebimento:</Text>
                <SelectOptions
                  data={dataDays}
                  description="Dia"
                  w={100}
                  {...register('data_recebimento_dia')}
                  defaultValue={data[0].data_recebimento.dia}
                />
                <SelectOptions
                  data={dataMonths}
                  description="Mês"
                  w={100}
                  {...register('data_recebimento_mes')}
                  defaultValue={data[0].data_recebimento.mes}
                />
                <SelectOptions
                  data={dataYears}
                  description="Ano"
                  w={150}
                  {...register('data_recebimento_ano')}
                  defaultValue={data[0].data_recebimento.ano}
                />
              </div>
              <span>
                <FormError>{formError.data_recebimento?.message}</FormError>
              </span>
            </div>
            <Button
              type="button"
              style={{ flex: 1 }}
              title="Hoje"
              onClick={() => {
                handleGetDayNow('recebimento')
              }}
            />
            <div>
              <SelectOptions
                data={dataMeioProtocol}
                description="Meio de Recebimento"
                w={225}
                {...register('meio_recebimento')}
                defaultValue={data[0].meio_recebimento}
              />
              <span>
                <FormError>{formError.meio_recebimento?.message}</FormError>
              </span>
            </div>

            <div>

              <div style={{ width: '36rem' }}>
                <ContainerInputFile>
                  <Button id="buttonSelect" title="Selecionar" />
                  <ContentInputFile>
                    <input
                      type="file"
                      {...register('anexos')}
                      onChange={(e: any) => {
                        register('anexos').onChange(e);
                        handleFileChange(e);
                      }}
                    />
                    <p>
                      {selectedFiles &&
                        selectedFiles[0] &&
                        selectedFiles[0].name !== undefined
                        ? `Arquivo Selecionado: ${selectedFiles[0].name}`
                        : 'Selecione o Arquivo:'}
                    </p>
                  </ContentInputFile>
                  <p style={{ fontSize: '0.9rem' }}>Anexos:</p>
                </ContainerInputFile>
              </div>


              <div>
                {actualAnnex.map(annex => (
                  <FilesContainer css={{ marginTop: '0.7rem', }} key={annex} >
                    {/* <p>{annex.split('_ID')[0]}</p> */}
                    <p>{data[0].anexos !== null ? data[0].anexos.replace('ENTRADA_0_', '') : 'Arquivo não enviado'}</p>

                    <a
                      href={`/upload/${annex}`}
                      download
                      id="fileButton"
                    >
                      baixar
                    </a>
                    <div style={{ width: '10rem', marginTop: '-1rem', marginLeft: '-32px' }}>
                      <Modal
                        plural={false}
                        data={annex}
                        title='excluir'
                        fnDelete={() => handleDeleteFile(data[0].anexos)}
                        bgColor='#be0000'
                      />
                    </div>
                  </FilesContainer>
                ))}
              </div>
            </div>

          </Box>
          <Box>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'end',
                  width: '27rem',
                }}
              >
                <Text>Data de Envio:</Text>

                <SelectOptions
                  data={dataDays}
                  description="Dia"
                  w={100}
                  {...register('data_envio_dia')}
                  defaultValue={data[0].data_envio.dia}
                />

                <SelectOptions
                  data={dataMonths}
                  description="Mês"
                  w={100}
                  {...register('data_envio_mes')}
                  defaultValue={data[0].data_envio.mes}
                />

                <SelectOptions
                  data={dataYears}
                  description="Ano"
                  w={150}
                  {...register('data_envio_ano')}
                  defaultValue={data[0].data_envio.ano}
                />

              </div>
              <FormError>{formError.data_envio?.message}</FormError>
            </div>
            <Button
              type="button"
              style={{ flex: 1 }}
              title="Hoje"
              onClick={() => {
                handleGetDayNow('envio')
              }}
            />
            <div>
              <SelectOptions
                data={dataMeioProtocol}
                description="Meio de Envio"
                w={225}
                {...register('meio_envio')}
                defaultValue={String(data[0].meio_envio)}
              />
              <FormError>{formError.meio_envio?.message}</FormError>
            </div>

            <div>
              <div style={{ width: '36rem' }}>
                <ContainerInputFile>
                  <Button id="buttonSelect" title="Selecionar" />
                  <ContentInputFile>
                    <input
                      type="file"
                      {...register('anexos2')}
                      onChange={(e: any) => {
                        register('anexos2').onChange(e);
                        handleFileChange2(e);
                      }}
                    />
                    <p>
                      {selectedFiles2 &&
                        selectedFiles2[0] &&
                        selectedFiles2[0].name !== undefined
                        ? `Arquivo Selecionado: ${selectedFiles2[0].name}`
                        : 'Selecione o Arquivo:'}
                    </p>
                  </ContentInputFile>
                  <p style={{ fontSize: '0.9rem' }}>Anexos:</p>
                </ContainerInputFile>
              </div>


              <div>
                {actualAnnex2.map(annex2 => (
                  <>
                    <FilesContainer>
                      {/* <p>{annex2.split('_ID')[0]}</p> */}
                      <p>{data[0].anexos2 !== null ? data[0].anexos2.replace('SAIDA_1_', '') : 'Arquivo não enviado'}</p>
                      <a
                        href={`/upload/${annex2}`}
                        download
                        id="fileButton"
                      >
                        baixar
                      </a>
                      <div style={{ width: '10rem', marginTop: '-1rem', marginLeft: '-32px' }}>
                        <Modal
                          plural={false}
                          data={annex2}
                          title='excluir'
                          fnDelete={() => handleDeleteFile(data[0].anexos2)}
                          bgColor='#be0000'
                        />
                      </div>
                    </FilesContainer>
                  </>
                ))}
              </div>
            </div>
          </Box>

          <Box>
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                width: '25rem',
              }}
            >
              <Text>Data de Encerramento do Protocolo:</Text>

              <SelectOptions
                data={dataDays}
                description="Dia"
                w={100}
                {...register('data_encerramento_protocolo_dia')}
                defaultValue={data[0].data_encerramento.dia}
              />
              <SelectOptions
                data={dataMonths}
                description="Mês"
                w={100}
                {...register('data_encerramento_protocolo_mes')}
                defaultValue={data[0].data_encerramento.mes}
              />
              <SelectOptions
                data={dataYears}
                description="Ano"
                w={150}
                {...register('data_encerramento_protocolo_ano')}
                defaultValue={data[0].data_encerramento.ano}
              />
            </div>
            <div>
              <SelectOptions
                w={300}
                data={usuarioEncerramento}
                description="Usuário Protocolo *"
                error={!!errors.usuario_encerramento?.message}
                {...register('usuario_encerramento')}
                defaultValue={data[0].usuario_encerramento}
              />
              <FormError>{errors.usuario_encerramento?.message}</FormError>
            </div>
          </Box>

          <Button
            title={isSubmitting ? 'Enviando...' : 'Atualizar'}
            type="submit"
            disabled={isSubmitting}
          />
        </fieldset>
      </form>

    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: any = context.params;

  try {
    const ignoreErrors = await prisma.parametros.findFirst({
      select: {
        permitir_dado_invalido: true
      }
    }).then(res => {
      return !!res?.permitir_dado_invalido;
    });

    console.log(ignoreErrors);


    const data = await prisma.protocolos.findFirst({
      where: {
        id: Number(id),
      },
    });

    const newData = [data]?.map((item: any) => {
      let dataRecebimento;
      let dataEnvio;
      let dataEncerramento;
      if (item.data_recebimento !== null) {
        dataRecebimento = useArrayDate.DesestruturarDate(
          item.data_recebimento,
        );
      } else {
        dataRecebimento = '';
      }

      if (item.data_envio !== null) {
        dataEnvio = useArrayDate.DesestruturarDate(item.data_envio);
      } else {
        dataEnvio = '';
      }

      if (item.data_encerramento !== null) {
        dataEncerramento = useArrayDate.DesestruturarDate(item.data_encerramento);
      } else {
        dataEncerramento = '';
      }

      return {
        ...data,
        data_recebimento: dataRecebimento,
        data_envio: dataEnvio,
        data_encerramento: dataEncerramento,
      };
    });

    const meioProtocol = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Meio_Protocol',
        ocorrencia_ativa: true
      },
    });

    const dataMeioProtocol = meioProtocol?.map(item => {
      return {
        id: item.id,
        label: item.ocorrencia_tabela
      };
    });


    const category = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Tipo_Protocol',
        ocorrencia_ativa: true
      },
    });

    const dataCategory = category?.map(item => {
      return {
        id: item.id,
        label: item.ocorrencia_tabela
      };
    });

    return {
      props: {
        ignoreErrors,
        data: newData,
        dataMeioProtocol,
        dataCategory,
      },
    };
  } catch (error) {
    console.error('Erro ao obter dados de tipo de empresa:', error);
    return {
      props: {
        ignoreErrors: false,
        data: [],
        dataMeioProtocol: [],
        dataCategory: [],
      },
    };
  } finally {
    prisma.$disconnect();
  }
};
