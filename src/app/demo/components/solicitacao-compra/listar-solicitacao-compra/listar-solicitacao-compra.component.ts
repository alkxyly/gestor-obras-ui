import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SolicitacaoCompraService } from 'src/app/demo/service/solicitacao-compra.service';
import { AlterarSituacaoSolicitacaoCompraDTO, SolicitacaoCompraFiltro, SolicitacaoCompraListDTO } from '../../core/model';

@Component({
  selector: 'app-listar-solicitacao-compra',
  templateUrl: './listar-solicitacao-compra.component.html',
  styleUrls: ['./listar-solicitacao-compra.component.scss']
})
export class ListarSolicitacaoCompraComponent implements OnInit {

  solicitacoes: SolicitacaoCompraListDTO[] = [];
  totalRecords: number = 0;
  loading: boolean = false;

  filtro: SolicitacaoCompraFiltro = new SolicitacaoCompraFiltro();

  exibirDialogoSituacao: boolean = false;
  solicitacaoSelecionada: any = null;
  novaSituacao: string = '';
  opcoesSituacao: any[] = [
    { label: 'Aberto', value: 'ABERTA' },
    { label: 'Em Andamento', value: 'EM_ANDAMENTO' },
    { label: 'Concluído', value: 'CONCLUIDA' },
    { label: 'Rejeitado', value: 'REJEITADA' }
  ];

  salvandoSituacao: boolean = false;

  constructor(
    private router: Router,
    private solicitacaoCompraService: SolicitacaoCompraService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  loadSolicitacoes(event: any): void {
    this.loading = true;
    this.filtro.pagina = event.first / event.rows;
    this.filtro.porPagina = event.rows;

    this.solicitacaoCompraService.listar(this.filtro).subscribe({
      next: (res) => {
        this.solicitacoes = res.itens;
        this.totalRecords = res.total;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao listar solicitações de compra:', err);
        this.loading = false;
      }
    });
  }

  novaSolicitacao(): void {
    this.router.navigate(['/solicitacao-compra/novo']);
  }

  visualizar(id: string): void {
    this.router.navigate(['/solicitacao-compra/editar', id]);
  }

  baixarPdf(solicitacao: any): void {
    // Mock da geração de PDF
    console.log('Gerando PDF para a solicitação:', solicitacao.id);
    alert('O download do PDF da Solicitação #' + solicitacao.id + ' começou!');
  }

  abrirDialogoSituacao(solicitacao: any): void {
    this.solicitacaoSelecionada = solicitacao;
    this.novaSituacao = solicitacao.situacao;
    this.exibirDialogoSituacao = true;
  }

  salvarSituacao(): void {
    if (!this.solicitacaoSelecionada) return;

    const body: AlterarSituacaoSolicitacaoCompraDTO = {
      solicitacaoCompraId: this.solicitacaoSelecionada.id,
      situacao: this.novaSituacao
    };

    this.salvandoSituacao = true;
    this.solicitacaoCompraService.alterarSituacao(this.solicitacaoSelecionada.id, body).subscribe({
      next: () => {
        this.solicitacaoSelecionada.situacao = this.novaSituacao;
        this.exibirDialogoSituacao = false;
        this.salvandoSituacao = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Situação alterada com sucesso!'
        });
      },
      error: (err) => {
        console.error('Erro ao alterar situação:', err);
        this.salvandoSituacao = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível alterar a situação. Tente novamente.'
        });
      }
    });
  }

  getSeverity(status: string): string {
    switch (status) {
      case 'ABERTA':
        return 'info';
      case 'EM_ANDAMENTO':
        return 'warning';
      case 'CONCLUIDA':
        return 'success';
      case 'REJEITADA':
        return 'danger';
      default:
        return 'info';
    }
  }

  getLabel(status: string): string {
    switch (status) {
      case 'ABERTA':       return 'Aberta';
      case 'EM_ANDAMENTO': return 'Em Andamento';
      case 'CONCLUIDA':    return 'Concluída';
      case 'REJEITADA':    return 'Rejeitada';
      default:             return status;
    }
  }
}

