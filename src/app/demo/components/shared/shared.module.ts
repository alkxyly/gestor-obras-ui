import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderPaginaComponent } from './header-pagina/header-pagina.component';
import { EnderecoComponent } from './endereco/endereco.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { FormatarPlacaPipe } from './pipe/formatar-placa.pipe';
import { CpfCnpjPipe } from './pipe/cpf-cnpj.pipe';
import { ConfirmarPagamentoDialogComponent } from './confirmar-pagamento-dialog/confirmar-pagamento-dialog.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardValorComponent } from './card-valor/card-valor.component';
import { CardModule } from 'primeng/card';
import { CidadeEstadoComponent } from './cidade-estado/cidade-estado.component';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [
    HeaderPaginaComponent,
    EnderecoComponent,
    ErrorMessageComponent,
    FormatarPlacaPipe,
    ConfirmarPagamentoDialogComponent,
    CardValorComponent,
    CardValorComponent,
    CidadeEstadoComponent,
    CpfCnpjPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    DialogModule,
    DropdownModule,
    ButtonModule,
    CalendarModule,
    CardModule
  ],
  exports: [
    HeaderPaginaComponent,
    EnderecoComponent,
    ErrorMessageComponent,
    FormatarPlacaPipe,
    ConfirmarPagamentoDialogComponent,
    CardValorComponent,
    CardValorComponent,
    CidadeEstadoComponent,
    CpfCnpjPipe
  ]
})
export class SharedModule { }
