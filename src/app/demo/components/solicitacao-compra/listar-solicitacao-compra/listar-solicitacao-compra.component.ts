import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SolicitacaoCompraService } from 'src/app/demo/service/solicitacao-compra.service';
import { SolicitacaoCompraFiltro, SolicitacaoCompraListDTO } from '../../core/model';

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
    { label: 'Em Andamento', value: 'EM ANDAMENTO' },
    { label: 'Concluído', value: 'CONCLUIDO' },
    { label: 'Rejeitado', value: 'REJEITADO' }
  ];

  constructor(
    private router: Router,
    private solicitacaoCompraService: SolicitacaoCompraService
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
    if (this.solicitacaoSelecionada) {
      this.solicitacaoSelecionada.situacao = this.novaSituacao;
    }
    this.exibirDialogoSituacao = false;
  }

  getSeverity(status: string): string {
    switch (status) {
      case 'ABERTO':
      case 'ABERTA':
        return 'info';
      case 'EM ANDAMENTO':
        return 'warning';
      case 'CONCLUIDO':
      case 'CONCLUÍDO':
        return 'success';
      case 'REJEITADO':
      case 'REJEITADA':
        return 'danger';
      default:
        return 'info';
    }
  }
}

