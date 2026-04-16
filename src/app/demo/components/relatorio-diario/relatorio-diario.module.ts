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
import { MeusRelatoriosComponent } from './meus-relatorios/meus-relatorios.component';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [ListarRelatorioDiarioComponent, MeusRelatoriosComponent],
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
    TableModule,
    TagModule,
    FileUploadModule,
    TooltipModule,
    DialogModule,
    ProgressBarModule,
    ImageModule,
    ReactiveFormsModule,
    SharedModule,
    RelatorioDiarioRoutingModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService]
})
export class RelatorioDiarioModule { }
