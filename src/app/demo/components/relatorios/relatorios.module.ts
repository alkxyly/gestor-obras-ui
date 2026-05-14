import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatoriosoRoutingModule } from './relatorio-routing.module';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ContratoRelatorioComponent } from './contrato-relatorio/contrato-relatorio.component';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';




@NgModule({
  declarations: [ContratoRelatorioComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ChartModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    RelatoriosoRoutingModule
  ]
})
export class RelatoriosModule { }
