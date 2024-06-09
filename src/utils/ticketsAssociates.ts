
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';

interface EtiquetaProps {
    id?: number;
    data_nascimento?: string;
    data_inicio_especializacao?: string;
    data_previsao_conclusao?: string;
    comprovante_cpf?: string;
    numero_proposta_SBA?: number;
    matricula_SAERJ?: number;
    matricula_SBA?: number;
    situacao?: string;
    uf_crm?: string;
    crm?: number;
    nome_completo: string;
    cpf?: string;
    sexo?: string;
    nome_profissional: string;
    categoria?: string;
    cep: string;
    logradouro: string;
    numero: number;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
    pais?: string;
    telefone_celular?: string;
    telefone_residencial?: string;
    email?: string;
    nome_instituicao_ensino_graduacao?: string;
    ano_conclusao_graduacao?: string;
    residencia_mec_cnrm?: string;
    nivel_residencia?: string;
    nome_hospital_mec?: string;
    uf_prm?: string;
    comprovante_endereco?: string;
    carta_indicacao_2_membros?: string;
    declaracao_hospital?: string;
    diploma_medicina?: string;
    certidao_quitacao_crm?: string;
    certificado_conclusao_especializacao?: string;
    declaro_verdadeiras?: string;
    declaro_quite_SAERJ?: string;
    pendencias_SAERJ?: string;
    nome_presidente_regional?: string;
    sigla_regional?: string;
    tratamento?: string;
}

const formatarCEP = (cep) => {
  const cepNumerico = cep.replace(/\D/g, ''); // Remover caracteres não numéricos
  const cepFormatado = cepNumerico.replace(/^(\d{5})(\d{3})$/, '$1-$2'); // Aplicar a máscara de CEP (XXXXX-XXX)
  return cepFormatado;
};

export const EtiquetaPDF = async (linhas: number[]) => {
  var doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
  });

  const verticalSpacing = 40; // Aumentei o espaçamento vertical para 40 unidades

  let currentPage = 1;
  let startY = 10; // Adjust the starting Y position as needed
  let remainingSpace = doc.internal.pageSize.height - startY;

  for (let index = 0; index < linhas.length; index++) {
    try {
      const response = await fetch(`/api/associados/get/${linhas[index]}`);
      const data = await response.json();

      try {
        const response_saerj = await fetch(`/api/adicionais_saerj/get/${data.matricula_SAERJ}`);
        const data_saerj = await response_saerj.json();

        if (response_saerj.status !== 404) {
          data['tratamento'] = data_saerj.tratamento + ' ';
        } else {
          data['tratamento'] = '';
        }

        const { nome_completo, bairro, cep, cidade, complemento, logradouro, numero, tratamento, uf } = data;

        if (nome_completo == null || nome_completo == '') {
          toast.error('Erro ao gerar etiquetas');
          return false;
        }

        var endereco = '';
        if (logradouro != null && logradouro != '') {
          endereco += '' + logradouro;

          if (numero != null && numero != '') {
            endereco += ', ' + numero;
          }

          if (complemento != null && complemento != '') {
            endereco += ' ' + complemento;
          }
        }

        var linhaCidade = '';

        if (cep != null && cep != '') {
          linhaCidade += '' + formatarCEP(cep) + ' - '; // Aplicar a máscara de CEP
        }


        if ((cidade != null && cidade != '') && (uf != null && uf != '')) {
          linhaCidade += '' + cidade + '/' + uf;
        }

        if (endereco == '' && linhaCidade == '') {
          toast.error('Um ou mais associados selecionados não possui todos os dados para gerar etiqueta.');
          return false;
        }

        // Calculate the space required for the current label
        const spaceRequired = verticalSpacing;

        // Check if there is enough space on the current page
        if (spaceRequired > remainingSpace) {
          // If not enough space, start a new page
          doc.addPage();
          currentPage++;
          startY = 10; // Adjust the starting Y position as needed
          remainingSpace = doc.internal.pageSize.height - startY;
        }

        const startX = 10;

        doc.setFontSize(12);
        const splitNome = doc.splitTextToSize(`${tratamento}${nome_completo}`, 80);
        doc.text(splitNome, startX + 4, startY + 12);

        if (endereco != '') {
          doc.setFontSize(10);
          const splitEndereco = doc.splitTextToSize(`${endereco}`, 80);
          doc.text(splitEndereco, startX + 4, startY + 17);
        }

        if ((bairro != '' && bairro != null) && linhaCidade != '') {
          const splitBairro = doc.splitTextToSize(bairro, 80);
          doc.text(splitBairro, startX + 4, startY + 22);

          const splitCidade = doc.splitTextToSize(`${linhaCidade}`, 80);
          doc.text(splitCidade, startX + 4, startY + 27);
        }

        // Update the remaining space on the current page
        remainingSpace -= spaceRequired;

        // Update the Y position for the next label
        startY += verticalSpacing;
      } catch {
        toast.error('Erro ao gerar etiquetas');
        return false;
      }
    } catch (error) {
      toast.error('Erro ao gerar etiquetas');
      console.error('Erro ao buscar associados:', error);
      return false;
    }
  }

  doc.save(`etiquetas_${currentPage}.pdf`); // Save the PDF with page number
};