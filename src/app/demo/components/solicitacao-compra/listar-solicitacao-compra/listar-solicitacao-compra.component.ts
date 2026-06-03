import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-solicitacao-compra',
  templateUrl: './listar-solicitacao-compra.component.html',
  styleUrls: ['./listar-solicitacao-compra.component.scss']
})
export class ListarSolicitacaoCompraComponent implements OnInit {

  solicitacoes: any[] = [];
  exibirDialogoSituacao: boolean = false;
  solicitacaoSelecionada: any = null;
  novaSituacao: string = '';
  opcoesSituacao: any[] = [
    { label: 'Aberto', value: 'ABERTO' },
    { label: 'Em Andamento', value: 'EM ANDAMENTO' },
    { label: 'Concluído', value: 'CONCLUIDO' },
    { label: 'Rejeitado', value: 'REJEITADO' }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Mock de dados
    this.solicitacoes = [
      { 
        id: 1, descricao: 'Materiais de escritório', prazoLimite: '15/10/2026', situacao: 'ABERTO',
        itens: [
          { descricao: 'Papel A4', numeroCatalogo: '1029', quantidade: 10, foto: null },
          { descricao: 'Canetas Azuis', numeroCatalogo: '1030', quantidade: 50, foto: null }
        ]
      },
      { 
        id: 2, descricao: 'Equipamentos de EPI', prazoLimite: '20/10/2026', situacao: 'EM ANDAMENTO',
        itens: [
          { descricao: 'Capacete de segurança', numeroCatalogo: 'EPI-01', quantidade: 15, foto: null }
        ]
      },
      { 
        id: 3, descricao: 'Ferramentas elétricas', prazoLimite: '05/09/2026', situacao: 'CONCLUIDO',
        itens: [
          { descricao: 'Furadeira Bosch', numeroCatalogo: 'FB-200', quantidade: 2, foto: null },
          { descricao: 'Esmerilhadeira', numeroCatalogo: 'ES-100', quantidade: 1, foto: null }
        ]
      },
      { 
        id: 4, descricao: 'Cimento e areia', prazoLimite: '01/10/2026', situacao: 'REJEITADO',
        itens: [
          { descricao: 'Saco de Cimento 50kg', numeroCatalogo: 'CM-50', quantidade: 100, foto: null }
        ]
      }
    ];
  }

  novaSolicitacao(): void {
    this.router.navigate(['/solicitacao-compra/novo']);
  }

  visualizar(id: number): void {
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
        return 'info';
      case 'EM ANDAMENTO':
        return 'warning';
      case 'CONCLUIDO':
        return 'success';
      case 'REJEITADO':
        return 'danger';
      default:
        return 'info';
    }
  }
}
