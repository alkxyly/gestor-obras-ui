import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { relatorioDiarioService } from 'src/app/demo/service/relatorio-diario.service';
import { ContratoDTO, RelatorioDiarioDetalhadoDTO, RelatorioDiarioDTO } from '../../core/model';
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
  relatorios: RelatorioDiarioDetalhadoDTO[] = [];

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

  listarRelatorioDiarioDetalhado() {
    this.relatorioService.listarRelatorioDiarioDetalhado(this.contratoSelecionado.id, "2026-01-01", "2026-01-10").subscribe(response => {
      this.relatorios = response;
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

  get totalGeral(): number {
    return this.relatorios.reduce((total, relatorio) => total + this.getValorTotal(relatorio.ocorrenciaItens), 0);
  }
}
