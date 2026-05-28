export class Veiculo {
    id: number;
    tipo: TipoVeiculo;
    modelo: ModeloVeiculo;
    modeloId: number;
    marca: ComboDTO;
    ano: number;
    placa: string = '';
    kilometragem: number;
    vencimentoLicenciamento: Date;
    renavam: string;
    chassi: string;
    vencimentoSeguro: Date;
    valorCompra: number;
    dataCompra: Date;
}

export class BuscarVeiculoDTO {
    id: number;
    tipo: TipoVeiculo;
    modelo: ModeloVeiculo;
    modeloId: number;
    marca: ComboDTO;
    ano: number;
    placa: string = '';
    kilometragem: number;
    vencimentoLicenciamento: Date;
    renavam: string;
    chassi: string;
    vencimentoSeguro: Date;
    valorCompra: number;
    dataCompra: Date;
}

export class TipoVeiculo {
    id: number;
    descricao: string;
}

export class MarcaVeiculo {
    id: number;
    descricao: string;
}

export class ModeloVeiculo {
    id: number;
    descricao: string;
}


export class ListarVeiculoDTO {
    veiculo: number;
    descricaoModelo: string;
    ano: number;
    placa: string = '';
    kilometragem: number;
    vencimentoLicenciamento: Date;
    renavam: string;
    chassi: string;
    vencimentoSeguro: Date;
    valorCompra: number;
    dataCompra: Date;
    disponivel: Boolean;
    modeloId: number;
}


export class ListarManutencaoDTO {
    manutencaoId: number;
    descricao: string;
    dataManutencao: string;
    tipo: string;
    valor: number;
    responsavel: string;
    situacao: boolean;
    kilometragem: number;
    dataPagamento: string;
}

export class TiposManutencaoDTO {
    tipoId: number;
    descricao: string;
}

/**Manutenção */

export class CadastrarManutencaoDTO {
    manutencaoId: number;
    descricao: string;
    valor: number;
    dataManutencao: string;
    dataPagamento: string;
    kilometragem: number;
    flagLocatario: boolean;
    tipoManutencaoId: number;
    veiculoId: number;
    situacao: boolean

}

export class AlterarSituacaoDTO {
    manutencaoId: number;
    veiculoId: number;
    situacao: boolean;
    dataPagamento: Date;
}


export class Endereco {
    logradouro: string;
    bairro: string;
    cidade: string;
    estado: string;
    numero: number;
    complemento?: string;
    cep: string;
}

export class CadastrarLocatarioDTO {
    nome: string;
    email: string;
    celular: string;
    cnh: string;
    cpf: string;
    rg: string;
    dataNascimento: string;
    dataVencimentoCnh: string;
    endereco: Endereco;
}


export class ListarLocatarioDTO {
    nome: string;
    email: string;
    celular: string;
    cnh: string;
    cpf: string;
    rg: string;
    dataNascimento: string;
    dataVencimentoCnh: string;
    situacao: boolean = true;
    dataCadastro: String;
}

export class Locatario {
    id: number;
    nome: string;
    email: string;
}

export class ComboDTO {
    id: number;
    descricao: string;
}

export class CadastrarLocacaoDTO {
    dataLocacao: string;
    valor: number;
    valorCaucao: number;
    periodoPagamento: number;
    diaPagamento: number;
    dataDevolucao: string;
    locatarioId: number;
    veiculoId: number;
    kilometragemAtual: number;
}

export class ListarLocacaoDTO {
    id: number;
    dataLocacao: string;
    valor: number;
    valorCaucao: number;
    periodoPagamento: number;
    diaPagamento: number;
    diaPagamentoId: number;
    dataDevolucao: string;
    locatario: string;
    veiculo: string;
    veiculoId: number;
    locatarioId: number;
    diasRestantes: number;
    kilometragemAtual: number;
    situacao: boolean;
}

export class CadastrarPagamentoDTO {
    id: number;
    valor: number;
    juros: number = 0.0;
    dataPagamentoPrevisto;
    dataPagamento: string;
    descricao: string;
    situacao: number;
    locacaoId: number;
}


export class ListarDetalheLocacaoDTO {
    locacao: ListarLocacaoDTO;
    pagamentos: ListarPagamentoDTO;
}

export class ListarPagamentoDTO {
    id: number;
    dataPagamento: Date;
    dataPagamentoPrevisto: Date;
    valor: number;
    juros: number;
    situacao: string;
    pago: boolean;
}

export class AlterarSituacaoPagamentoDTO {
    pagamentoId: number;
    situacao: boolean;
    dataPagamento: Date;
}

export class ResponseReceitasDepesasAnualDTO {
    receitas: number[];
    despesas: number[];
}


export class ResponsePagamentosSemanaDTO {
    pagamentoId: number;
    dataPagamentoPrevisto: string;
    diaSemana: string;
    situacao: string;
    locatario: string;
    veiculo: string;
    valor: number;
    dataVencimentoCnh: Date;
    statusCnh: string;
}

export class ResponseResumoDashboardDTO {
    totalVeiculos: number;
    veiculosAlugados: number;
    veiculosDisponiveis: number;
    totalValorInvestido: number;
    totalReceitas: number = 0;
    totalDespesas: number = 0;
}


export class DespesaReceitaPorMotoDTO {
    placasDespesas: string[];
    valoresDespesas: number[];
    placasReceitas: string[];
    valoresReceitas: number[];
}


export class ReceitasDTO {
    id: number;
    dataPagamento: Date;
    dataPagamentoPrevisto: Date;
    valor: number;
    juros: number;
    situacao: string;
    pago: boolean;
    locacaoId: number;
}

export class ReceitasFiltro {
    descricao: string;
    dataInicio?: Date;
    dataFim?: Date;
    situacao: number;
    pagina: number = 0;
    itensPorPagina: number = 10;
    veiculoId: number;
}

export class DespesasFiltro {
    dataInicio: Date;
    dataFim: Date;
    situacao: boolean;
    veiculoId: number;
    tipoManutencaoId: number;
    pagina: number = 0;
    itensPorPagina: number = 10;
}

export class PaginationReceitas {
    currentPage: number;
    perPage: number;
    total: number;
    itens: ReceitasDTO[];
}

export class PaginationDespesas {
    currentPage: number;
    perPage: number;
    total: number;
    itens: ListarDespesasDTO[];
}

export class ListarDespesasDTO {
    id: number;
    situacao: boolean;
    placa: string;
    valor: number;
    tipoManutencao: string;
}

export class ResumoReceitaDTO {
    totalRecebido: number;
    totalPendente: number;
    totalAtrasado: number;
    total: number;
}


export class ResumoDespesaDTO {
    totalPago: number;
    totalPendente: number;
    total: number
}

export class ListarTrocaOleoDTO {
    id: number;
    placa: string;
    descricao: string;
    situacao: boolean;
    kmTroca: number;
    kmProximaTroca: number;
    dataTroca: Date;
}

export class ListarUltimasTrocasOleoDTO {
    trocaOleoId: number;
    dataTrocaOleo: Date;
    kmTrocaOleo: number;
    kmProximaTrocaOleo: number;
    valorTrocaOleo: number;
    situacaoTrocaOleo: boolean;
    veiculoId: number;
    placaVeiculo: string;
    oleoId: number;
    marcaOleo: string;
    descricaoOleo: string;
    diasDesdeTroca: number;
}

export class CadastrarTrocaOleoDTO {
    veiculoId: number;
    dataTroca: Date;
    kmTroca: number;
    kmProximaTroca: number;
    valor: number;
    oleoId: number;
    situacao: boolean = true;
    descricao: string;
}

export class ListarOleoDTO {
    id: number;
    marca: string;
    nome: string;
    descricao: string;
    tipo: string;
}

export class ListarOficinaParceiraPaginadaDTO {
    currentPage: number;
    perPage: number;
    total: number;
    itens: ListarOficinaParceiraDTO[];
}

export class ListarOficinaParceiraDTO {
    id: string;
    nome: string;
    endereco: string;
    email: string;
    telefone: string;
    ativo: boolean;
}

export class OficinaParceiraFiltroDTO {
    pagina: number = 0;
    porPagina: number = 10;
    nome?: string;
}

export class CadastrarOficinaParceiraDTO {
    id: string;
    nome: string;
    endereco: string;
    email: string;
    telefone: string;
    ativo: boolean;
}

export class OcorrenciaDTO {
    id?: number;
    descricao: string;
    valor: number;
    unidade: string;
}

export class ContratoDTO {
    id?: number;
    nome: string;
    descricao: string;
    dataInicio: string;
    dataFim: string;
    ocorrenciasId: number[] = []
    responsavel: string;
    nomeResponsavel?: string;
    nomeEncarregado?: string;
    funcionariosId?: string[];
    contratoManutencao?: boolean;
    valorManutencao?: number;
}

export class UsuarioDTO {
    id?: string;
    nome: string;
    cpfCnpj: string;
    email: string;
    celular?: string;
    senha?: string;
    ativo?: boolean;
    cargo: string;
    telefone: string;
    confirmacaoSenha?: string;
}

export class RelatorioDiarioDTO {
    dataCadastro: string;
    titulo: string;
    descricao: string;
    condicaoClimatica: number;
    ocorrenciaItens: OcorrenciaItemDTO[] = [];
    estado: string;
    cidade: string;
    contratoId: number;
    funcionariosAusentesId?: UsuarioDTO[];
    fotos?: ImageDTO[];
    linha: string;
    estrutura: string;
    kmPercorrido: number;
}

export class OcorrenciaItemDTO {
    id?: number;
    valor: number;
    quantidade: number;
}

export class RelatorioDiarioDetalhadoDTO {
    id: string;
    titulo: string;
    descricao: string;
    condicaoClimatica: number;
    cidade: string;
    estado: string;
    dataCadastro: string;
    funcionariosAusentes: UsuarioDTO[];
    ocorrenciaItens: OcorrenciaItemDTO[];
    relatadoPor: UsuarioDTO;
    fotos?: string[];
}


export class UploadRequestDTO {
    originalFileName: string;
    contentLength: number;
}

export class UploadResponseDTO {

    uploadSignedUrl: string;
    remoteFileName: string;
    contentLength: number;
    contentType: string;
    expiresAt: Date;
}

export class ImageDTO {
    nomeRemoto: string;
    tamanho: number;
}

export class DashboardDTO {
    totalContratos: number;
    totalFuncionarios: number;
    totalValor: number;
    ultimosSeisMeses: number[];
    valorProduzidoMensal: ValorProduzidoPorContratoDTO[];
}

export class ValorProduzidoPorContratoDTO {
    contratoId: number;
    nomeContrato: string;
    total: number;
}

export interface QuilometroPercorridoDTO {
    nome: string;
    total: number;
    usuarioId: string;
}

export interface OcorrenciaTotalDTO {
    ocorrenciaId: number;
    descricao: string
    total: number;
}

export interface ClimaContagemDTO {
    condicaoClimatica: string | number;
    quantidade: number;
}

export interface ContratoRelatorioResponse {
    quilometrosPercorridos: QuilometroPercorridoDTO[];
    ocorrenciaTotal: OcorrenciaTotalDTO[];
    climaContagem: ClimaContagemDTO[];
}

export enum Role {
    CONSULTAR_DASHBOARD = 'ROLE_CONSULTAR_DASHBOARD',
    EDITAR_CONTRATO = 'ROLE_EDITAR_CONTRATO',
    CONSULTAR_CONTRATO = 'ROLE_CONSULTAR_CONTRATO',
    EDITAR_OCORRENCIA = 'ROLE_EDITAR_OCORRENCIA',
    EDITAR_USUARIO = 'ROLE_EDITAR_USUARIO',
}