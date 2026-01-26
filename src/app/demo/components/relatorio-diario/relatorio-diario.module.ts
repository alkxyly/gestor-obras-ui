import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ListarRelatorioDiarioComponent } from './listar-relatorio-diario/listar-relatorio-diario.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RelatorioDiarioRoutingModule } from './relatorio-diario-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ListarRelatorioDiarioComponent],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    InputTextareaModule,
    CalendarModule,
    CardModule,
    InputNumberModule,
    MultiSelectModule,
    SelectButtonModule,
    ReactiveFormsModule,
    SharedModule,
    RelatorioDiarioRoutingModule
  ]
})
export class RelatorioDiarioModule { }
