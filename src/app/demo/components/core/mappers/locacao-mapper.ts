import { CadastrarLocacaoDTO } from "../model";

export class LocacaoMapper{
    
        static toCadastrarLocacaoDTO(formValues: any): CadastrarLocacaoDTO{
            return {
                dataLocacao: formValues.dataLocacao,
                valor: formValues.valor,
                valorCaucao: formValues.valorCaucao,
                periodoPagamento: formValues.periodoPagamento,
                diaPagamento: formValues.diaPagamento.id,
                dataDevolucao: formValues.dataDevolucao,
                locatarioId: formValues.locatarioId.id,
                veiculoId: formValues.veiculoId.id,
                kilometragemAtual: formValues.kilometragemAtual
            }
        }
}