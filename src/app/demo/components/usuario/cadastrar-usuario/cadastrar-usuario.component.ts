import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UsuarioDTO } from '../../core/model';
import { UsuarioService } from 'src/app/demo/service/usuario.service';

@Component({
  selector: 'app-cadastrar-usuario',
  templateUrl: './cadastrar-usuario.component.html',
  styleUrls: ['./cadastrar-usuario.component.scss'],
  providers: [MessageService]
})
export class CadastrarUsuarioComponent implements OnInit {

  usuario: UsuarioDTO = {
    nome: '',
    email: '',
    cpfCnpj: '',
    senha: '',
    perfil: '',
    ativo: true
  };

  confirmarSenha: string = '';

  perfis = [
    { label: 'Administrador', value: 'ADMINISTRADOR' },
    { label: 'Engenheiro', value: 'ENGENHEIRO' },
    { label: 'Encarregado', value: 'ENCARREGADO' }
  ];

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  salvar() {
    if (this.usuario.senha !== this.confirmarSenha) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'As senhas não coincidem.' });
      return;
    }

    this.usuarioService.cadastrar(this.usuario).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário cadastrado com sucesso!' });
        setTimeout(() => {
          this.router.navigate(['/usuarios/listar-usuarios']);
        }, 1000);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao cadastrar usuário.' });
      }
    });
  }
}
