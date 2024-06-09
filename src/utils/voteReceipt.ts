import { jsPDF } from 'jspdf';

interface VoteReceiptProps {
  matricula_saerj: string;
  cpf: string;
  nome: string;
  autenticacao: string;
  chapaVote: string;
}

export const ExibirReciboVoto = (recibo: VoteReceiptProps) => {
  var doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
  });

  const {
    matricula_saerj,
    cpf,
    nome,
    autenticacao
  } = recibo;

  // Center the ticket at the top of the page
  const pageWidth = doc.internal.pageSize.width;
  const ticketWidth = 90; // Adjust as needed
  const ticketHeight = 60; // Adjust as needed

  const startX = (pageWidth - ticketWidth) / 2;
  const startY = 10; // Adjust as needed

  const borderWidth = 90;
  const borderHeight = 60;
  doc.rect(startX, startY, borderWidth, borderHeight);

  doc.setFontSize(12);
  const splitMatricula = doc.splitTextToSize(`Nome da votação: ${matricula_saerj}`, 80);
  doc.text(splitMatricula, startX + 4, 15 + startY);

  doc.setFontSize(10);
  const splitCPF = doc.splitTextToSize(`CPF: ${cpf}`, 80);
  doc.text(splitCPF, startX + 4, 25 + startY);

  const splitNome = doc.splitTextToSize(`Nome: ${nome}`, 80);
  doc.text(splitNome, startX + 4, 35 + startY);

  const splitAutenticacao = doc.splitTextToSize(`Autenticação: ${autenticacao}`, 80);
  doc.text(splitAutenticacao, startX + 4, 45 + startY);

  const splitDia = doc.splitTextToSize(`Dia: ${new Date().toLocaleDateString()}`, 80);
  doc.text(splitDia, startX + 4, 55 + startY);

  doc.save('recibo_voto.pdf');
};
