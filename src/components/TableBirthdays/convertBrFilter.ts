export const convertBrFilter = {
  columnMenuUnsort: 'não classificado',
  columnMenuSortAsc: 'Classificar por ordem crescente',
  columnMenuSortDesc: 'Classificar por ordem decrescente',
  columnMenuFilter: 'Pesquisa direta',
  columnMenuHideColumn: 'Ocultar',
  columnMenuShowColumns: 'Mostrar colunas',
  columnMenuManageColumns: 'Gerenciar colunas',
  // Filter panel text
  filterPanelAddFilter: 'Adicionar filtro',
  filterPanelDeleteIconLabel: 'Excluir',
  filterPanelOperator: 'Operadores',
  filterPanelOperatorAnd: 'E',
  filterPanelOperatorOr: 'Ou',
  filterPanelColumns: 'Colunas',
  filterPanelInputLabel: 'Valor',
  filterPanelInputPlaceholder: 'Filtrar valor',
  // Filter operators text
  filterOperatorContains: 'contém',
  filterOperatorEquals: 'é igual a',
  filterOperatorStartsWith: 'começa com',
  filterOperatorEndsWith: 'termina com',
  filterOperatorIs: 'é',
  filterOperatorNot: 'não é',
  filterOperatorOnOrAfter: 'em ou após',
  filterOperatorBefore: 'antes de',
  filterOperatorOnOrBefore: 'em ou antes de',
  filterOperatorAfter: 'após',
  filterOperatorIsEmpty: 'está vazio',
  filterOperatorIsAnyOf: 'é qualquer',
  filterOperatorIsNotEmpty: 'não está vazio',
  MuiTablePagination: {
    labelDisplayedRows: ({
      from,
      to,
      count,
    }: {
      from: any
      to: any
      count: any
    }) => `${from} - ${to} num total de ${count}`,
    labelRowsPerPage: 'Linhas por página',
  },

  // Column header text
  columnHeaderFiltersTooltipActive: (count: any) =>
    `${count} ${count !== 1 ? 'filtros' : 'filtro'} ${
      count !== 1 ? 'ativos' : 'ativo'
    }`,
  columnHeaderFiltersLabel: 'Exibir Filtros',
  columnHeaderSortIconLabel: 'Ordenar',
  // Column menu text
  columnMenuLabel: 'Menu',
  // Total rows footer text
  footerTotalRows: 'Total de linhas:',

  // Total visible rows footer text
  footerTotalVisibleRows: (visibleCount: any, totalCount: any) =>
    `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,
  // Rows selected footer text
  footerRowSelected: (count: any) =>
    count !== 1
      ? `${count.toLocaleString()} linhas selecionadas`
      : `${count.toLocaleString()} linha selecionada`,
}
