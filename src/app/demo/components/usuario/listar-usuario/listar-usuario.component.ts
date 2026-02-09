import { Component, OnInit } from '@angular/core';
import { UsuarioDTO } from '../../core/model';
import { UsuarioService } from 'src/app/demo/service/usuario.service';

@Component({
  selector: 'app-listar-usuario',
  templateUrl: './listar-usuario.component.html',
  styleUrl: './listar-usuario.component.scss'
})
export class ListarUsuarioComponent implements OnInit {

  usuarios: UsuarioDTO[] = [];
  cols: any[] = [];

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.listarUsuarios();

    this.cols = [
      { field: 'nome', header: 'Nome' },
      { field: 'email', header: 'Email' },
      { field: 'cpfCnpj', header: 'CPF/CNPJ' },
      { field: 'perfil', header: 'Perfil' },
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
}
