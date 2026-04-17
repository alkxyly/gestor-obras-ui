import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OcorrenciaService } from 'src/app/demo/service/ocorrencia.service';
import { ContratoDTO, OcorrenciaDTO, UsuarioDTO } from '../../core/model';
import { ContratoService } from 'src/app/demo/service/contrato.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-cadastrar-contratos',
  templateUrl: './cadastrar-contratos.component.html',
  styleUrl: './cadastrar-contratos.component.scss'
})
export class CadastrarContratosComponent implements OnInit {

  ocorrencias: OcorrenciaDTO[] = [];
  ocorrenciasTarget: OcorrenciaDTO[] = [];

  contrato: any = {
    nome: '',
    descricao: '',
    dataInicio: null,
    dataFim: null
  };

  usuarios: UsuarioDTO[] = [];
  funcionarios: UsuarioDTO[] = [];
  funcionariosSelecionados: UsuarioDTO[] = [];

  usuarioSelecionado: UsuarioDTO | null = null;
  isContratoManutencao: boolean = false;
  valorManutencao: number | null = null;

  contratoId: number | null = null;
  get modoEdicao(): boolean { return this.contratoId !== null; }

  constructor(
    private messageService: MessageService,
    private ocorrenciaService: OcorrenciaService,
    private contratoService: ContratoService,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.contratoId = +id;
      // Em modo edição, carregarContrato() já recarrega ocorrências e usuários com os dados pré-selecionados
      this.listarUsuarios();
      this.carregarContrato(this.contratoId);
    } else {
      this.listarOcorrencias();
      this.listarUsuarios();
    }
  }

  listarOcorrencias() {
    this.ocorrenciaService.listarOcorrencia().subscribe(response => {
      this.ocorrencias = response;
      this.ocorrenciasTarget = [];
    });
  }

  listarUsuarios() {
    this.usuarioService.listar().subscribe(response => {
      this.funcionarios = response;
    });

    this.usuarioService.listarEngenheiro().subscribe(response => {
      this.usuarios = response;
    });
  }

  carregarContrato(id: number) {
    this.contratoService.buscarPorId(id).subscribe(response => {
      this.contrato = {
        nome: response.nome,
        descricao: response.descricao,
        dataInicio: response.dataInicio ? new Date(response.dataInicio) : null,
        dataFim: response.dataFim ? new Date(response.dataFim) : null,
      };
      this.isContratoManutencao = response.contratoManutencao ?? (response.valorManutencao != null && response.valorManutencao > 0);
      this.valorManutencao = response.valorManutencao ?? null;

      // Pré-seleciona o engenheiro responsável
      this.usuarioService.listarEngenheiro().subscribe(engenheiros => {
        this.usuarios = engenheiros;
        this.usuarioSelecionado = engenheiros.find(u => u.id === response.responsavel) ?? null;
      });

      // Pré-seleciona os funcionários do contrato
      this.usuarioService.listar().subscribe(todosFuncionarios => {
        this.funcionarios = todosFuncionarios;
        const idsFuncionarios = new Set(response.funcionariosId ?? []);
        this.funcionariosSelecionados = todosFuncionarios.filter(f => idsFuncionarios.has(f.id));
      });

      // Pré-seleciona as ocorrências do contrato
      this.ocorrenciaService.listarOcorrencia().subscribe(todasOcorrencias => {
        const idsDoContrato = new Set(response.ocorrenciasId);
        this.ocorrenciasTarget = todasOcorrencias.filter(o => idsDoContrato.has(o.id));
        this.ocorrencias = todasOcorrencias.filter(o => !idsDoContrato.has(o.id));
      });
    });
  }

  salvar() {
    if (this.contrato.descricao && this.contrato.dataInicio) {

      const contratoDTO: ContratoDTO = {
        nome: this.contrato.nome,
        descricao: this.contrato.descricao,
        dataInicio: this.contrato.dataInicio ? new Date(this.contrato.dataInicio).toISOString().slice(0, 10) : null,
        dataFim: this.contrato.dataFim ? new Date(this.contrato.dataFim).toISOString().slice(0, 10) : null,
        ocorrenciasId: this.ocorrenciasTarget.map(o => o.id),
        responsavel: this.usuarioSelecionado?.id,
        funcionariosId: this.funcionariosSelecionados.map(f => f.id),
        contratoManutencao: this.isContratoManutencao,
        valorManutencao: this.isContratoManutencao ? this.valorManutencao : null
      };

      if (this.modoEdicao) {
        this.contratoService.atualizar(this.contratoId!, contratoDTO).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Contrato atualizado com sucesso!' });
          this.router.navigate(['/contratos/meus-contratos']);
        });
      } else {
        this.contratoService.cadastrar(contratoDTO).subscribe(() => {
          this.ocorrenciasTarget = [];
          this.usuarioSelecionado = null;
          this.funcionariosSelecionados = [];
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Contrato salvo com sucesso!' });
          this.router.navigate(['/contratos/meus-contratos']);
        });
      }
    }
  }
}
