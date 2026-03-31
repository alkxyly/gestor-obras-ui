import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { DashboardService } from '../../service/dashboard.service';
import { DespesaReceitaPorMotoDTO, ResponsePagamentosSemanaDTO, ResponseResumoDashboardDTO, ValorProduzidoPorContratoDTO } from '../core/model';
import { Router } from '@angular/router';
import { DateUtilsService } from '../../service/DateUtilService';
import { ContratoService } from '../../service/contrato.service';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

    items!: MenuItem[];
    products!: Product[];
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;
    receitas: number[] = [];
    despesas: number[] = [];
    pagamentosSemana: ResponsePagamentosSemanaDTO[] = [];
    mostrarValores: boolean = true;
    data: any[] = [{ value: 1 }]
    resumoDashboard: ResponseResumoDashboardDTO = new ResponseResumoDashboardDTO();
    displayCalendar: boolean = false;
    dataSelecionada: Date | null = new Date();
    expandedRows: { [key: string]: boolean } = {};
    gastosMensaisData: any;
    gastosMensaisOptions: any;
    gastosPorObraData: any;
    gastosPorObraOptions: any;
    valorProduzitoPorContrato: ValorProduzidoPorContratoDTO[] = [];

    totalContratos: number = 0;
    totalFuncionarios: number = 0;
    totalValor: number = 0;
    ultimosSeisMeses: number[] = [];

    relatoriosDiarios: any[] = [
        {
            obra: 'Obra Residencial Centro',
            todosFuncionarios: [
                { nome: 'João Silva', enviou: true, dataEnvio: new Date() },
                { nome: 'Maria Santos', enviou: true, dataEnvio: new Date() },
                { nome: 'Pedro Oliveira', enviou: true, dataEnvio: new Date() },
                { nome: 'Carlos Rodrigues', enviou: false },
                { nome: 'Ana Paula', enviou: false }
            ]
        },
        {
            obra: 'Edifício Comercial Norte',
            todosFuncionarios: [
                { nome: 'Ana Costa', enviou: true, dataEnvio: new Date() },
                { nome: 'Carlos Mendes', enviou: true, dataEnvio: new Date() },
                { nome: 'Roberto Silva', enviou: false },
                { nome: 'Juliana Alves', enviou: false }
            ]
        },
        {
            obra: 'Reforma Hospital Municipal',
            todosFuncionarios: [
                { nome: 'Fernanda Lima', enviou: true, dataEnvio: new Date() },
                { nome: 'Roberto Alves', enviou: true, dataEnvio: new Date() },
                { nome: 'Juliana Ferreira', enviou: true, dataEnvio: new Date() },
                { nome: 'Marcos Souza', enviou: true, dataEnvio: new Date() },
                { nome: 'Paulo Santos', enviou: false },
                { nome: 'Lucia Costa', enviou: false }
            ]
        },
        {
            obra: 'Ponte sobre o Rio',
            todosFuncionarios: [
                { nome: 'Lucas Pereira', enviou: true, dataEnvio: new Date() },
                { nome: 'Mariana Silva', enviou: false },
                { nome: 'Ricardo Oliveira', enviou: false }
            ]
        }
    ];

    despesaPorMoto: any;
    receitaPorMoto: any;
    options: any;

    constructor(
        private productService: ProductService,
        public layoutService: LayoutService,
        private dashboardService: DashboardService,
        private router: Router,
        private dataUtil: DateUtilsService) {
    }


    ngOnInit() {
        this.configurarGraficoGastosPorContrato();
        this.listar();
    }

    listar() {
        this.dashboardService.obterDashboard().subscribe({
            next: (response) => {
                this.totalContratos = response.totalContratos;
                this.totalFuncionarios = response.totalFuncionarios;
                this.totalValor = response.totalValor;
                this.ultimosSeisMeses = response.ultimosSeisMeses;
                this.valorProduzitoPorContrato = response.valorProduzidoMensal;
                this.configurarGraficoGastosMensais();
                this.configurarGraficoGastosPorContrato();
            }
        });
    }

    configurarGraficoGastosMensais() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const primaryColor = documentStyle.getPropertyValue('--primary-color');

        // Obter os últimos 6 meses
        const meses = [];
        const valores = this.ultimosSeisMeses
        const hoje = new Date();

        for (let i = 5; i >= 0; i--) {
            const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
            const nomeMes = data.toLocaleDateString('pt-BR', { month: 'short' });
            meses.push(nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1));

            // Valores fictícios para demonstração (em milhares)
            //valores.push(Math.floor(Math.random() * 50000) + 80000);
        }

        this.gastosMensaisData = {
            labels: meses,
            datasets: [
                {
                    label: 'Valor Produzido (R$)',
                    data: this.ultimosSeisMeses,
                    backgroundColor: primaryColor,
                    borderColor: primaryColor,
                    borderWidth: 1
                }
            ]
        };

        this.gastosMensaisOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context: any) {
                            const value = context.parsed.y ?? 0;
                            return ' R$ ' + Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    beginAtZero: true,
                    suggestedMax: Math.max(...this.ultimosSeisMeses) * 1.2 || 1000,
                    ticks: {
                        color: textColorSecondary,
                        callback: function (value: any) {
                            return 'R$ ' + Number(value).toLocaleString('pt-BR');
                        }
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    configurarGraficoGastosPorContrato() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        const contratos = this.valorProduzitoPorContrato.map(item => item.nomeContrato)
        const valores = this.valorProduzitoPorContrato.map(item => item.total)

        const cores = this.getRandomColors(contratos.length);

        this.gastosPorObraData = {
            labels: contratos,
            datasets: [
                {
                    data: valores,
                    backgroundColor: cores,
                    hoverBackgroundColor: cores
                }
            ]
        };

        this.gastosPorObraOptions = {
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context: any) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return label + ': R$ ' + value.toLocaleString('pt-BR') + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        };
    }



    configurarDashboardDespesasReceitas() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [
                {
                    label: 'Despesa',
                    data: this.despesas,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--red-700'),
                    borderColor: documentStyle.getPropertyValue('--red-700'),
                    tension: .4
                },
                {
                    label: 'Receita',
                    data: this.receitas,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: true
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: true
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    mostrarValoresDashboard(): void {
        this.mostrarValores = !this.mostrarValores;
    }

    abrirCalendario() {
        this.displayCalendar = !this.displayCalendar;
    }


    onDateSelect(event: any) {
        this.dataSelecionada = event;
        this.displayCalendar = false;
    }



    private configurarOptionsDashboarReceitaDespesa() {
        this.options = {
            plugins: {
                title: {
                    display: true,
                    fontSize: 16
                },
                legend: {
                    display: false
                }
            }
        };
    }

    private popularChartDespesasPorMoto(response: DespesaReceitaPorMotoDTO) {
        this.despesaPorMoto = {
            labels: response.placasDespesas,
            datasets: [
                {
                    data: response.valoresDespesas,
                    backgroundColor: this.getRandomColors(response.placasDespesas.length),
                    hoverBackgroundColor: this.getRandomColors(response.placasDespesas.length)
                }
            ]
        };
    }

    private popularChartReceitasPorMoto(response: DespesaReceitaPorMotoDTO) {
        this.receitaPorMoto = {
            labels: response.placasReceitas,
            datasets: [
                {
                    data: response.valoresReceitas,
                    backgroundColor: this.getRandomColors(response.placasReceitas.length),
                    hoverBackgroundColor: this.getRandomColors(response.placasReceitas.length)
                }
            ]
        };
    }


    getRandomColors(count: number): string[] {
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(this.getRandomColor());
        }
        return colors;
    }

    getRandomColor(): string {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    onRedirecionarReceitas() {
        const dataSelecionada = this.dataUtil.getMesEAnoApartirDeData(this.dataSelecionada);
        this.router.navigate(['/receitas', dataSelecionada]);
    }

    onRedirecionarDespesas() {
        const dataSelecionada = this.dataUtil.getMesEAnoApartirDeData(this.dataSelecionada);
        this.router.navigate(['/despesas', dataSelecionada]);
    }

    getStatusCnhSeverity(statusCnh: string): string {
        switch (statusCnh?.toUpperCase()) {
            case 'VENCIDA':
                return 'danger';
            case 'PROXIMO_VENCIMENTO':
                return 'warning';
            case 'VALIDA':
                return 'success';
            default:
                return 'info';
        }
    }

    getStatusCnhIcon(statusCnh: string): string {
        switch (statusCnh?.toUpperCase()) {
            case 'VENCIDA':
                return 'pi pi-exclamation-triangle';
            case 'A VENCER':
                return 'pi pi-clock';
            case 'VALIDA':
                return 'pi pi-check-circle';
            default:
                return 'pi pi-info-circle';
        }
    }
}
