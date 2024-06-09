import Link from "next/link";
import { Box, Container } from "./styled";
import { ArrowBendDownLeft, CaretRight } from "phosphor-react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { api } from "@/lib/axios";
import { useRouter } from "next/router";

const schemaDiretoriaForm = z.object({
  numero_eleicao: z.number().min(1, "Informe o número da eleição"),
  cod_chapa: z.string().min(1, "Informe o código da chapa"),
  matricula_saerj: z.number().min(1, "Informe a matrícula saerj"),
  candidato_cargo: z.string().min(1, "Informe o candidato ao cargo"),
});

type SchemaDiretoriaForm = z.infer<typeof schemaDiretoriaForm>;

export default function Cadastro() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SchemaDiretoriaForm>({
    resolver: zodResolver(schemaDiretoriaForm),
    defaultValues: {
      candidato_cargo: "",
      cod_chapa: "",
      matricula_saerj: 0,
      numero_eleicao: 0,
    },
  });

  async function handleOnSubmit(data: SchemaDiretoriaForm) {
    try {
      await api.post("/diretorias/cadastro", {
        numero_eleicao: data.numero_eleicao,
        cod_chapa: data.cod_chapa,
        matricula_saerj: data.matricula_saerj,
        candidato_cargo: data.candidato_cargo,
      });
      router.push("/diretorias");
      return toast.success("Operação concluída com sucesso!");
    } catch (error) {
      return toast.error("Ops algo deu errado...");
    }
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Box style={{ justifyContent: "end" }}>
          <Link
            href="/diretorias"
            style={{
              textDecoration: "none",
              fontFamily: "Roboto",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
              color: "#000",
            }}
          >
            <ArrowBendDownLeft size={32} />
            Retornar
          </Link>
        </Box>
        <fieldset>
          <legend>
            <Link href={"/diretorias"}>Diretorias</Link>
            <CaretRight size={14} />
            <span>Incluir</span>
          </legend>

          <Box>
            <TextInput
              title="Numero da Eleição"
              type="number"
              messageError={errors.numero_eleicao?.message}
              {...register("numero_eleicao", {
                valueAsNumber: true,
              })}
            />
            <TextInput
              title="Codigo da chapa"
              {...register("cod_chapa")}
              messageError={errors.cod_chapa?.message}
            />

            <TextInput
              title="Matrícula SAERJ"
              type="number"
              {...register("matricula_saerj", {
                valueAsNumber: true,
              })}
              messageError={errors.matricula_saerj?.message}
            />

            <TextInput
              title="Candidato ao cargo"
              {...register("candidato_cargo")}
              messageError={errors.candidato_cargo?.message}
            />
          </Box>
          <Button
            title={isSubmitting ? "Enviando..." : "Enviar"}
            type="submit"
            disabled={isSubmitting}
          />
        </fieldset>
      </form>
    </Container>
  );
}
