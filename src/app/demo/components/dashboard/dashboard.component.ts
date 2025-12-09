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
    
    despesaPorMoto: any;
    receitaPorMoto: any;
    options: any;

    constructor(
        private productService: ProductService, 
        public layoutService: LayoutService,
        private dashboardService: DashboardService,
        private router: Router,
        private dataUtil: DateUtilsService) {
        
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {  this.configurarDashboardDespesasReceitas();  });
    }


    ngOnInit() {
        const dataAtual = new Date();
        this.productService.getProductsSmall().then(data => this.products = data);
      
        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];

        this.obterDespesasReceitasAnuais(this.dataUtil.getAnoApartirDeData(dataAtual));    
        this.obterPagamentosSemana();
        this.obterResumoDashboard(this.dataUtil.getMesEAnoApartirDeData(dataAtual));
        this.configurarOptionsDashboarReceitaDespesa();
        this.obterDadosDespesaPorMoto(this.dataUtil.getMesEAnoApartirDeData(dataAtual));
    }

    obterResumoDashboard(data: string){
        this.dashboardService.listarResumoDashboard(data).subscribe({ 
            next: (response) => { this.resumoDashboard = response; }, 
            error: (err) => { } 
        });
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
        this.obterResumoDashboard(this.dataUtil.getMesEAnoApartirDeData(this.dataSelecionada));
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
