import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosRoutingModule } from './usuarios-rounting.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedModule } from '../shared/shared.module';
import { CadastrarUsuarioComponent } from './cadastrar-usuario/cadastrar-usuario.component';
import { ListarUsuarioComponent } from './listar-usuario/listar-usuario.component';

@NgModule({
  declarations: [CadastrarUsuarioComponent, ListarUsuarioComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    InputMaskModule,
    PasswordModule,
    InputSwitchModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    SharedModule,
    UsuariosRoutingModule
  ]
})
export class UsuarioModule { }
