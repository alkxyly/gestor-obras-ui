import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitacaoCompraRoutingModule } from './solicitacao-compra-routing.module';
import { CadastrarSolicitacaoCompraComponent } from './cadastrar-solicitacao-compra/cadastrar-solicitacao-compra.component';
import { ListarSolicitacaoCompraComponent } from './listar-solicitacao-compra/listar-solicitacao-compra.component';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    CadastrarSolicitacaoCompraComponent,
    ListarSolicitacaoCompraComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SolicitacaoCompraRoutingModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    CardModule,
    ToastModule,
    ToolbarModule,
    CalendarModule,
    InputNumberModule,
    FileUploadModule,
    DividerModule,
    ImageModule,
    TagModule,
    DialogModule,
    DropdownModule,
    TooltipModule
  ]
})
export class SolicitacaoCompraModule { }

