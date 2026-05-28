import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ContratoService } from 'src/app/demo/service/contrato.service';
import { ContratoDTO, OcorrenciaTotalDTO, QuilometroPercorridoDTO } from '../../core/model';
import { ContratoRelatorioService } from 'src/app/demo/service/contrato-relatorio.service';


interface ContractSummary {
  valorProduzido: number;
  totalRelatorios: number;
  mediaDiaria: number;
}


@Component({
  selector: 'app-contrato-relatorio',
  templateUrl: './contrato-relatorio.component.html',
  styleUrl: './contrato-relatorio.component.scss'
})
export class ContratoRelatorioComponent implements OnInit, OnDestroy {
  filterForm!: FormGroup;
  contratos: ContratoDTO[] = [];
  usuariosKm: QuilometroPercorridoDTO[] = [];
  ocorrenciaTotal: OcorrenciaTotalDTO[] = [];
  climaContagem: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder,
    private contratoService: ContratoService,
    private contratoRelatorioService: ContratoRelatorioService) {
    this.initForm();
  }

  private initForm() {
    this.filterForm = this.fb.group({
      contratoId: [null, Validators.required],
      dateRange: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.carregarContratos();

  }



  private carregarContratos() {
    this.contratoService.listarPorResponsavel().subscribe((contratos) => {
      this.contratos = contratos;
    })
  }

  onFilter() {
    if (this.filterForm.invalid) {
      // Aqui você poderia disparar um Toast do PrimeNG
      return;
    }

    const { contratoId, dateRange } = this.filterForm.value;

    const formatData = (d: Date) => d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '';
    const dataInicio = formatData(dateRange[0]);
    const dataFim = formatData(dateRange[1]);

    console.log('Buscando dados para o contrato:', contratoId, 'no período:', dataInicio, 'até', dataFim);

    this.contratoRelatorioService.listarContratoRelatorio(contratoId, dataInicio, dataFim).subscribe((response) => {
      this.usuariosKm = response.quilometrosPercorridos;
      this.ocorrenciaTotal = response.ocorrenciaTotal;
      this.processarClimaContagem(response.climaContagem);
    })
  }

  private processarClimaContagem(dados: any[]) {
    const mapaClima: { [key: string]: number } = {
      'ENSOLARADO': 0,
      '0': 0,
      'NUBLADO': 0,
      '1': 0,
      'CHUVOSO': 0,
      '2': 0
    };

    if (dados && Array.isArray(dados)) {
      dados.forEach(item => {
        if (item.condicaoClimatica !== null && item.condicaoClimatica !== undefined) {
          const condicao = String(item.condicaoClimatica).toUpperCase();
          mapaClima[condicao] = Number(item.quantidade || 0);
        }
      });
    }

    const solQtd = (mapaClima['ENSOLARADO'] || 0) + (mapaClima['0'] || 0);
    const nubladoQtd = (mapaClima['NUBLADO'] || 0) + (mapaClima['1'] || 0);
    const chuvaQtd = (mapaClima['CHUVOSO'] || 0) + (mapaClima['2'] || 0);

    this.climaContagem = [
      {
        label: 'Sol / Ensolarado',
        quantidade: solQtd,
        icon: 'pi pi-sun text-amber-500',
        bgClass: 'bg-orange-50 border-orange-200 text-orange-800'
      },
      {
        label: 'Nublado',
        quantidade: nubladoQtd,
        icon: 'pi pi-cloud text-bluegray-500',
        bgClass: 'bg-bluegray-50 border-bluegray-200 text-bluegray-800'
      },
      {
        label: 'Chuva / Chuvoso',
        quantidade: chuvaQtd,
        icon: 'pi pi-align-justify text-blue-500',
        bgClass: 'bg-blue-50 border-blue-200 text-blue-800'
      }
    ];
  }

  exportPdf() {
    console.log('Exportando relatório em PDF...');
    // TODO: Adicionar lógica para gerar/baixar o PDF
  }

  exportExcel() {
    console.log('Exportando relatório em Excel...');
    // TODO: Adicionar lógica para gerar/baixar o Excel
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
