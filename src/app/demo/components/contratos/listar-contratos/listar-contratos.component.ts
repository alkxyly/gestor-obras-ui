import { Component, OnInit } from '@angular/core';
import { ContratoService } from 'src/app/demo/service/contrato.service';
import { ContratoDTO, UsuarioDTO } from '../../core/model';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-listar-contratos',
  templateUrl: './listar-contratos.component.html',
  styleUrl: './listar-contratos.component.scss'
})
export class ListarContratosComponent implements OnInit {

  contratos: ContratoDTO[] = [];
  cols: any[] = [];

  usuarios: UsuarioDTO[] = [];
  encarregadoSelecionado: UsuarioDTO;
  contratoSelecionado: ContratoDTO;
  mostrarDialogEncarregado: boolean = false;

  constructor(
    private constratoService: ContratoService,
    private usuarioService: UsuarioService,
    private messageService: MessageService
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
    this.constratoService.listar().subscribe(response => this.contratos = response);
  }

  abrirDialogEncarregado(contrato: ContratoDTO) {
    this.contratoSelecionado = contrato;
    this.mostrarDialogEncarregado = true;
    this.usuarioService.listarEncarregado().subscribe(response => this.usuarios = response);
  }

  salvarEncarregado() {
    if (this.contratoSelecionado && this.encarregadoSelecionado) {
      this.constratoService.definirEncarregado(this.contratoSelecionado.id, this.encarregadoSelecionado.id)
        .subscribe(() => {
          this.mostrarDialogEncarregado = false;
          this.encarregadoSelecionado = null;
          this.contratoSelecionado = null;
          this.carregarContratos();
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Encarregado definido com sucesso' });
        });
    }
  }
}
