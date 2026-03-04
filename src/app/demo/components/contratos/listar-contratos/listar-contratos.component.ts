import { Component, OnInit } from '@angular/core';
import { ContratoService } from 'src/app/demo/service/contrato.service';
import { ContratoDTO, UsuarioDTO } from '../../core/model';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-listar-contratos',
  templateUrl: './listar-contratos.component.html',
  styleUrl: './listar-contratos.component.scss'
})
export class ListarContratosComponent implements OnInit {

  contratos: ContratoDTO[] = [];
  cols: any[] = [];

  usuarios: UsuarioDTO[] = [];
  encarregadosSelecionados: UsuarioDTO[] = [];
  contratoSelecionado: ContratoDTO;
  mostrarDialogEncarregado: boolean = false;

  constructor(
    private constratoService: ContratoService,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.carregarContratos();

    this.cols = [
      { field: 'nome', header: 'Nome' },
      { field: 'descricao', header: 'Descrição' },
      { field: 'dataInicio', header: 'Início' },
      { field: 'dataFim', header: 'Fim' }
    ];
  }

  carregarContratos() {
    this.constratoService.listarPorResponsavel().subscribe(response => this.contratos = response);
  }

  abrirDialogEncarregado(contrato: ContratoDTO) {
    this.contratoSelecionado = contrato;
    this.mostrarDialogEncarregado = true;
    this.encarregadosSelecionados = [];
    this.usuarioService.listarEncarregado().subscribe(response => this.usuarios = response);
  }

  salvarEncarregado() {
    if (this.contratoSelecionado && this.encarregadosSelecionados && this.encarregadosSelecionados.length > 0) {
      const idsUsuarios = this.encarregadosSelecionados.map(u => u.id!);

      this.constratoService.definirEncarregados(this.contratoSelecionado.id!, idsUsuarios)
        .subscribe(() => {
          this.mostrarDialogEncarregado = false;
          this.encarregadosSelecionados = [];
          this.contratoSelecionado = null as any;
          this.carregarContratos();
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Encarregado(s) definido(s) com sucesso' });
        });
    }
  }
}
