import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastrarContratosComponent } from './cadastrar-contratos/cadastrar-contratos.component';
import { ContratosRoutingModule } from './contratos-rounting.module';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ListarContratosComponent } from './listar-contratos/listar-contratos.component';
import { PickListModule } from 'primeng/picklist';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';




@NgModule({
  declarations: [CadastrarContratosComponent, ListarContratosComponent],
  imports: [
    CommonModule,
    FormsModule,
    // Componentes PrimeNG
    InputTextareaModule,
    InputTextModule,
    CalendarModule,
    ButtonModule,
    ToastModule,
    MultiSelectModule,
    TableModule,
    DropdownModule,
    PickListModule,
    ContratosRoutingModule
  ],
  providers: [

  ]
})
export class ContratosModule { }
