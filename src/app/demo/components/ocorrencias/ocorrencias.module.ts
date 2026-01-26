import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastrarOcorrenciaComponent } from './cadastrar-ocorrencia/cadastrar-ocorrencia.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OcorrenciasRoutingModule } from './ocorrencias-rounting.module';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ListarOcorrenciaComponent } from './listar-ocorrencia/listar-ocorrencia.component';



@NgModule({
  declarations: [CadastrarOcorrenciaComponent, ListarOcorrenciaComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputNumberModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    OcorrenciasRoutingModule  
  ]
})
export class OcorrenciasModule { }
