import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { relatorioDiarioService } from 'src/app/demo/service/relatorio-diario.service';
import { ContratoDTO, RelatorioDiarioDetalhadoDTO, RelatorioDiarioDTO, Role } from '../../core/model';
import { ContratoService } from 'src/app/demo/service/contrato.service';
import { AuthService } from '../../auth/auth.service';


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

  downloadandoIds = new Set<string>();

  constructor(private fb: FormBuilder,
    private relatorioService: relatorioDiarioService,
    private contratoService: ContratoService,
    private authService: AuthService) { }

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

  enviarMensagemWhatsapp(numero: string) {
    window.open(`https://api.whatsapp.com/send?phone=55${numero}&text=Olá, Tudo bem !`);
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

  downloadRelatorio(relatorioId: string) {
    this.downloadandoIds.add(relatorioId);
    this.relatorioService.downloadRdo(relatorioId).subscribe({
      next: blob => {
        const uuid = crypto.randomUUID();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${uuid}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.downloadandoIds.delete(relatorioId);
      },
      error: () => {
        this.downloadandoIds.delete(relatorioId);
      }
    });
  }


  get podeConsultarValorTotal(): boolean {
    return this.authService.temPermissao(Role.CONSULTAR_DASHBOARD);
  }
}
