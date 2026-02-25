import { Component, OnInit } from '@angular/core';
import { UsuarioDTO } from '../../core/model';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-listar-usuario',
  templateUrl: './listar-usuario.component.html',
  styleUrl: './listar-usuario.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class ListarUsuarioComponent implements OnInit {

  usuarios: UsuarioDTO[] = [];
  cols: any[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.listarUsuarios();

    this.cols = [
      { field: 'nome', header: 'Nome' },
      { field: 'email', header: 'Email' },
      { field: 'cpfCnpj', header: 'CPF/CNPJ' },
      { field: 'cargo', header: 'Cargo' },
      { field: 'telefone', header: 'Telefone' },
      { field: 'ativo', header: 'Ativo' }
    ];
  }

  listarUsuarios() {
    this.usuarioService.listar().subscribe(response => {
      this.usuarios = response;
    });
  }

  enviarMensagemWhatsapp(numero: string) {
    window.open(`https://api.whatsapp.com/send?phone=55${numero}&text=Olá, Tudo bem !`);
  }

  inativarUsuario(usuario: UsuarioDTO) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja inativar o usuário ${usuario.nome}?`,
      header: 'Confirmar Inativação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        if (usuario.id) {
          this.usuarioService.inativar(usuario.id).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário inativado!' });
              this.listarUsuarios();
            }
          });
        }
      }
    });
  }

  ativarUsuario(usuario: UsuarioDTO) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja ativar o usuário ${usuario.nome}?`,
      header: 'Confirmar Ativação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        if (usuario.id) {
          this.usuarioService.ativar(usuario.id).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário ativado!' });
              this.listarUsuarios();
            }
          });
        }
      }
    });
  }
}
