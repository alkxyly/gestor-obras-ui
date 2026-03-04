import { Component, Renderer2 } from '@angular/core';
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

  dataSelecionada: Date = new Date();

  displayFotos: boolean = false;
  fotosSelecionadas: string[] = [];

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
    if (!this.contratoSelecionado?.id) return;

    const year = this.dataSelecionada.getFullYear();
    const month = this.dataSelecionada.getMonth();

    // Primeiro dia do mês
    const dataInicio = new Date(year, month, 1).toISOString().split('T')[0];

    // Último dia do mês
    const dataFim = new Date(year, month + 1, 0).toISOString().split('T')[0];

    this.relatorioService.listarRelatorioDiarioDetalhado(this.contratoSelecionado.id, dataInicio, dataFim).subscribe(response => {
      this.relatorios = response;
    })
  }

  onContratoChange(event: any): void {
    const contrato = event.value;
    if (contrato && contrato.id) {
      this.listarRelatorioDiarioDetalhado();
    } else {

    }
  }

  onSubmit() {

  }

  abrirWhatsapp(celular: string) {
    if (celular) {
      const numeroLimpo = celular.replace(/\D/g, '');
      const url = `https://api.whatsapp.com/send?phone=55${numeroLimpo}&text=Olá, gostaria de falar sobre o relatório.`;
      window.open(url, '_blank');
    }
  }

  getValorTotal(ocorrencias: any[]): number {
    if (!ocorrencias) return 0;
    return ocorrencias.reduce((total, item) => total + (item.quantidade * item.valor), 0);
  }

  get totalGeral(): number {
    return this.relatorios.reduce((total, relatorio) => total + this.getValorTotal(relatorio.ocorrenciaItens), 0);
  }

  getClimaTexto(condicao: number): string {
    const labels = {
      0: 'Ensolarado',
      1: 'Nublado',
      2: 'Chuvoso'
    };
    return labels[condicao] || 'Desconhecido';
  }

  abrirFotos(fotos: string[]) {
    this.fotosSelecionadas = fotos;
    this.displayFotos = true;
  }
}
