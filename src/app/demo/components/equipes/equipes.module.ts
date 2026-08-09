import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CadastrarEquipeComponent } from './cadastrar-equipe/cadastrar-equipe.component';
import { ListarEquipesComponent } from './listar-equipes/listar-equipes.component';
import { EquipesRoutingModule } from './equipes-routing.module';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    CadastrarEquipeComponent,
    ListarEquipesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    ButtonModule,
    CardModule,
    ToastModule,
    TableModule,
    EquipesRoutingModule
  ]
})
export class EquipesModule { }
