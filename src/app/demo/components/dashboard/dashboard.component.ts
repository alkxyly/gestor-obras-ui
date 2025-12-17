import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener, ElementRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { DashboardService } from '../../service/dashboard.service';
import { DespesaReceitaPorMotoDTO, ResponsePagamentosSemanaDTO, ResponseResumoDashboardDTO } from '../core/model';
import { Router } from '@angular/router';
import { DateUtilsService } from '../../service/DateUtilService';

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
    despesas: number[] = []

    pagamentosSemana: ResponsePagamentosSemanaDTO[] = [];
    mostrarValores: boolean = true;

    data: any[]= [{value : 1}]

    resumoDashboard: ResponseResumoDashboardDTO  = new ResponseResumoDashboardDTO();

    displayCalendar: boolean = false; 
    dataSelecionada: Date | null = new Date();

    // Controle de expansão da tabela de obras
    expandedRows: { [key: string]: boolean } = {};

    // Dados do gráfico de gastos dos últimos 6 meses
    gastosMensaisData: any;
    gastosMensaisOptions: any;

    // Dados do gráfico de pizza - valor gasto por obra
    gastosPorObraData: any;
    gastosPorObraOptions: any;

    // Dados estáticos do dashboard
    totalContratos: number = 45;
    totalFuncionarios: number = 128;
    totalObras: number = 23;
    valorTotalGastoMes: number = 125000.50;

    // Dados da tabela de relatórios diários
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
        
        // this.subscription = this.layoutService.configUpdate$
        //     .pipe(debounceTime(25))
        //     .subscribe((config) => {  this.configurarDashboardDespesasReceitas();  });
    }


    ngOnInit() {
    //     const dataAtual = new Date();
    //     this.productService.getProductsSmall().then(data => this.products = data);
      
    //     this.items = [
    //         { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    //         { label: 'Remove', icon: 'pi pi-fw pi-minus' }
    //     ];

    //     this.obterDespesasReceitasAnuais(this.dataUtil.getAnoApartirDeData(dataAtual));    
    //     this.obterPagamentosSemana();
    //     this.obterResumoDashboard(this.dataUtil.getMesEAnoApartirDeData(dataAtual));
    //     this.configurarOptionsDashboarReceitaDespesa();
    //     this.obterDadosDespesaPorMoto(this.dataUtil.getMesEAnoApartirDeData(dataAtual));
    // }

    // obterResumoDashboard(data: string){
    //     this.dashboardService.listarResumoDashboard(data).subscribe({ 
    //         next: (response) => { this.resumoDashboard = response; }, 
    //         error: (err) => { } 
    //     });
        this.configurarGraficoGastosMensais();
        this.configurarGraficoGastosPorObra();
    }

    configurarGraficoGastosMensais() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const primaryColor = documentStyle.getPropertyValue('--primary-color');

        // Obter os últimos 6 meses
        const meses = [];
        const valores = [];
        const hoje = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
            const nomeMes = data.toLocaleDateString('pt-BR', { month: 'short' });
            meses.push(nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1));
            
            // Valores fictícios para demonstração (em milhares)
            valores.push(Math.floor(Math.random() * 50000) + 80000);
        }

        this.gastosMensaisData = {
            labels: meses,
            datasets: [
                {
                    label: 'Valor Gasto (R$)',
                    data: valores,
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
                    ticks: {
                        color: textColorSecondary,
                        callback: function(value: any) {
                            return 'R$ ' + (value / 1000).toFixed(0) + 'k';
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

    configurarGraficoGastosPorObra() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        // Dados de exemplo - valores gastos por obra
        const obras = this.relatoriosDiarios.map(obra => obra.obra);
        const valores = [
            125000,  // Obra Residencial Centro
            98000,   // Edifício Comercial Norte
            156000,  // Reforma Hospital Municipal
            75000    // Ponte sobre o Rio
        ];

        // Cores para cada fatia do gráfico
        const cores = [
            '#667eea', // Azul
            '#f5576c', // Vermelho/Laranja
            '#00f2fe', // Ciano
            '#43e97b'  // Verde
        ];

        this.gastosPorObraData = {
            labels: obras,
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
                    position: 'bottom',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context: any) {
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

    obterPagamentosSemana(){
        this.dashboardService.listarPagamentosSemana().subscribe({
            next: (response) => { this.pagamentosSemana = response; },
            error: (err) => { }
        });
    }

    get totalValorVisivel(): number {
        return this.pagamentosSemana.reduce((total, pagamento) => total + pagamento.valor, 0);
    }

    obterDespesasReceitasAnuais(ano: number){
        this.dashboardService.listarLocacoesPorSituacao(ano).subscribe({
            next: (response) => {
                this.receitas = response.receitas;
                this.despesas = response.despesas;
                this.configurarDashboardDespesasReceitas();
            },
            error: (err) => {}
            
        });
    }

    configurarDashboardDespesasReceitas() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov','Dez'],
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

        this.obterDadosDespesaPorMoto(this.dataUtil.getMesEAnoApartirDeData(this.dataSelecionada));
        // this.obterResumoDashboard(this.dataUtil.getMesEAnoApartirDeData(this.dataSelecionada));
    }


    obterDadosDespesaPorMoto(data: string){
        this.dashboardService.listarDespesasReceitasPorMoto(data).subscribe({
            next: (response) => {
                this.popularChartDespesasPorMoto(response);   
                this.popularChartReceitasPorMoto(response)               
            }
        });       
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
        this.router.navigate(['/receitas', dataSelecionada ]);
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
