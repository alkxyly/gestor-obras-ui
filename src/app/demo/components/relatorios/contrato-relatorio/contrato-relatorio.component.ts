import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ContratoService } from 'src/app/demo/service/contrato.service';
import { ContratoDTO } from '../../core/model';

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
  contracts: ContratoDTO[] = [];
  summary: ContractSummary = {
    valorProduzido: 154750.00,
    totalRelatorios: 42,
    mediaDiaria: 1.4
  };


  private destroy$ = new Subject<void>();

  chartData: any;
  chartOptions: any;

  constructor(private fb: FormBuilder, private contratoService: ContratoService) {
    this.initForm();
  }

  private initForm() {
    this.filterForm = this.fb.group({
      contractId: [null, Validators.required],
      dateRange: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.initChart();
    this.loadContracts();
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);

    this.chartData = {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      datasets: [
        {
          label: 'Produção (R$)',
          data: [35000, 48000, 32000, 39750],
          fill: true,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4,
          backgroundColor: 'rgba(59, 130, 246, 0.2)'
        }
      ]
    };

    this.chartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: documentStyle.getPropertyValue('--surface-border') }
        }
      }
    };
  }

  private loadContracts() {
    this.contratoService.listarPorResponsavel().subscribe((contracts) => {
      this.contracts = contracts;
    })
  }

  onFilter() {
    if (this.filterForm.invalid) {
      // Aqui você poderia disparar um Toast do PrimeNG
      return;
    }

    const { contractId, dateRange } = this.filterForm.value;
    console.log('Buscando dados para o contrato:', contractId, 'no período:', dateRange);

    // Lógica para chamar o serviço e atualizar this.summary e this.chartData
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
