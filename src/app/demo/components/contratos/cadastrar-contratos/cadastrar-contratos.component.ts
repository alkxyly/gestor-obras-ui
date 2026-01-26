import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OcorrenciaService } from 'src/app/demo/service/ocorrencia.service';
import { ContratoDTO, OcorrenciaDTO, UsuarioDTO } from '../../core/model';
import { ContratoService } from 'src/app/demo/service/contrato.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';


@Component({
  selector: 'app-cadastrar-contratos',
  templateUrl: './cadastrar-contratos.component.html',
  styleUrl: './cadastrar-contratos.component.scss'
})
export class CadastrarContratosComponent implements OnInit {

  ocorrencias: OcorrenciaDTO[] = [];
  ocorrenciasTarget: OcorrenciaDTO[] = [];

  // Objeto que representa o contrato
  contrato: any = {
    nome: '',
    descricao: '',
    dataInicio: null,
    dataFim: null
  };

  usuarios: UsuarioDTO[] = []
  funcionarios: UsuarioDTO[] = [];
  funcionariosSelecionados: UsuarioDTO[] = [];


  usuarioSelecionado: UsuarioDTO | null = null;

  constructor(
    private messageService: MessageService,
    private ocorrenciaService: OcorrenciaService,
    private contratoService: ContratoService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {

    this.listarOcorrencias();
    this.listarUsuarios();

    this.ocorrenciasTarget = [];
  }

  listarOcorrencias() {
    this.ocorrenciaService.listarOcorrencia().subscribe(response => { this.ocorrencias = response; })
  }

  listarUsuarios() {
    this.usuarioService.listar().subscribe(response => {
      this.usuarios = response;
      this.funcionarios = response;
    })
  }


  salvar() {
    if (this.contrato.descricao && this.contrato.dataInicio) {

      const contratoDTO: ContratoDTO = {
        nome: this.contrato.nome,
        descricao: this.contrato.descricao,
        dataInicio: this.contrato.dataInicio ? new Date(this.contrato.dataInicio).toISOString().slice(0, 10) : null,
        dataFim: this.contrato.dataFim ? new Date(this.contrato.dataFim).toISOString().slice(0, 10) : null,
        ocorrenciasId: this.ocorrenciasTarget.map(o => o.id),
        responsavel: this.usuarioSelecionado.id,
        funcionariosIds: this.funcionariosSelecionados.map(f => f.id)
      };

      this.contratoService.cadastrar(contratoDTO).subscribe(response => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Contrato salvo com sucesso!'
        });
      });
    }
  }
}
