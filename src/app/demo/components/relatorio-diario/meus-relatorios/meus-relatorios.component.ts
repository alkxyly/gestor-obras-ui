import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { relatorioDiarioService } from 'src/app/demo/service/relatorio-diario.service';
import { ContratoDTO, RelatorioDiarioDTO } from '../../core/model';
import { ContratoService } from 'src/app/demo/service/contrato.service';

@Component({
  selector: 'app-meus-relatorios',
  templateUrl: './meus-relatorios.component.html',
  styleUrl: './meus-relatorios.component.scss'
})
export class MeusRelatoriosComponent {

  reportForm!: FormGroup;
  contratos: ContratoDTO[] = [];
  contratoSelecionado: ContratoDTO;
  expandedRows = {};
  relatorios: RelatorioDiarioDTO[] = [
    {
      dataCadastro: '2026-01-01',
      titulo: 'Dia 1 Relatorio contrato GP0001',
      descricao: 'Atividades de fundação concluídas com sucesso.',
      condicaoClimatica: 0,
      ocorrenciaItens: [],
      estado: 'SP',
      cidade: 'São Paulo',
      contratoId: 1,
      faltas: [{ nome: 'João da Silva' }]
    },
    {
      dataCadastro: '2026-01-02',
      titulo: 'Dia 2 Relatorio contrato GP0001',
      descricao: 'Instalação elétrica iniciada no segundo pavimento.',
      condicaoClimatica: 1,
      ocorrenciaItens: [{ id: 1, valor: 100, quantidade: 2 }],
      estado: 'RJ',
      cidade: 'Rio de Janeiro',
      contratoId: 2,
      faltas: []
    },
    {
      dataCadastro: '2026-01-03',
      titulo: 'Dia 3 Relatorio contrato GP0001',
      descricao: 'Chuva impediu a concretagem da laje.',
      condicaoClimatica: 2,
      ocorrenciaItens: [],
      estado: 'MG',
      cidade: 'Belo Horizonte',
      contratoId: 3,
      faltas: [{ nome: 'Maria Oliveira' }, { nome: 'Carlos Souza' }]
    }
  ];

  constructor(private fb: FormBuilder,
    private relatorioService: relatorioDiarioService,
    private contratoService: ContratoService) { }

  ngOnInit(): void {
    this.listarContratoPorResponsavel();
  }

  listarContratoPorResponsavel() {
    this.contratoService.listarPorResponsavel().subscribe(response => {
      this.contratos = response;
    })
  }

  onContratoChange(event: any): void {
    const contrato = event.value;

    console.log(contrato)

    if (contrato && contrato.id) {

    } else {

    }
  }

  onSubmit() {

  }

  getValorTotal(ocorrencias: any[]): number {
    if (!ocorrencias) return 0;
    return ocorrencias.reduce((total, item) => total + (item.quantidade * item.valor), 0);
  }
}
