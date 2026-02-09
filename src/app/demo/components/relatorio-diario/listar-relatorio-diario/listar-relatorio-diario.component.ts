import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContratoDTO, OcorrenciaDTO, RelatorioDiarioDTO, UsuarioDTO } from '../../core/model';
import { ContratoService } from 'src/app/demo/service/contrato.service';
import { OcorrenciaService } from 'src/app/demo/service/ocorrencia.service';
import { relatorioDiarioService } from 'src/app/demo/service/relatorio-diario.service';
import { MessageService } from 'primeng/api';
import { UsuarioService } from 'src/app/demo/service/usuario.service';

interface StatusOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-listar-relatorio-diario',
  templateUrl: './listar-relatorio-diario.component.html',
  styleUrl: './listar-relatorio-diario.component.scss'
})
export class ListarRelatorioDiarioComponent implements OnInit {

  reportForm!: FormGroup;
  funcionarios: UsuarioDTO[] = [];
  contratos: ContratoDTO[] = [];
  contratoSelecionado: ContratoDTO;
  tiposOcorrencias: OcorrenciaDTO[] = [];
  climaOptions: any[] = [
    { label: 'Sol', value: 0, icon: 'pi pi-sun' },
    { label: 'Nublado', value: 1, icon: 'pi pi-cloud' },
    { label: 'Chuva', value: 2, icon: 'pi pi-align-justify' }
  ];

  constructor(
    private fb: FormBuilder,
    private contratoService: ContratoService,
    private ocorrenciaService: OcorrenciaService,
    private relatorioDiarioService: relatorioDiarioService,
    private messageService: MessageService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.listarPorResponsavel();
  }


  listarFuncionarios(contratoId: number) {
    this.contratoService.listarFuncionariosDoContrato(contratoId).subscribe(response => {
      this.funcionarios = response;
    })
  }


  listarOcorrenciasPorContrato(contratoId: any) {
    this.ocorrenciaService.listarOcorrenciaPorContrato(contratoId).subscribe(response => {
      this.tiposOcorrencias = response;
    })
  }

  listarPorResponsavel() {
    this.contratoService.listarPorResponsavel().subscribe(response => {
      this.contratos = response;
    })
  }

  private initForm(): void {
    this.reportForm = this.fb.group({
      dataCadastro: [new Date(), Validators.required],
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descricao: ['', [Validators.required, Validators.maxLength(500)]],
      condicaoClimatica: [0, Validators.required],
      ocorrencias: this.fb.array([]),
      funcionariosAusentesId: [[]],
      localizacao: [null, Validators.required]
    });
  }

  onSubmit(): void {

    if (this.reportForm.valid) {
      this.relatorioDiarioService.cadastrar(this.transformToDTO(this.reportForm.value)).subscribe(response => {
        this.reportForm.reset();
        this.contratoSelecionado = null;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Relatório diário cadastrado com sucesso' });
      });
    }
  }

  onUpload(event: any) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  }

  private transformToDTO(reportData: any): RelatorioDiarioDTO {
    const dataCadastro = new Date(reportData.dataCadastro).toISOString().split('T')[0];
    return {
      dataCadastro: dataCadastro,
      titulo: reportData.titulo,
      descricao: reportData.descricao,
      condicaoClimatica: reportData.condicaoClimatica,
      estado: reportData.localizacao?.estado?.sigla || '',
      cidade: reportData.localizacao?.cidade?.nome || '',
      contratoId: this.contratoSelecionado?.id,
      ocorrenciaItens: reportData.ocorrencias.map((item: any) => {
        const ocorrenciaTipo = this.tiposOcorrencias.find(t => t.id === item.tipo);
        return {
          id: item.tipo,
          quantidade: item.quantidade,
          valor: ocorrenciaTipo ? ocorrenciaTipo.valor : 0
        };
      }),
      funcionariosAusentesId: reportData.funcionariosAusentesId ? reportData.funcionariosAusentesId.map((usuario: UsuarioDTO) => usuario.id) : []
    };
  }


  get ocorrencias(): FormArray {
    return this.reportForm.get('ocorrencias') as FormArray;
  }



  addOcorrencia(): void {
    const item = this.fb.group({
      tipo: [null, Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]], valor: [0, Validators.required],

    });
    this.ocorrencias.push(item);
  }

  removeOcorrencia(index: number): void {
    this.ocorrencias.removeAt(index);
  }

  get totalValorOcorrencias(): number {
    return this.ocorrencias.controls.reduce((total, control) => {
      const tipoId = control.get('tipo')?.value;
      const quantidade = control.get('quantidade')?.value || 0;

      const ocorrencia = this.tiposOcorrencias.find(o => o.id === tipoId);
      const valor = ocorrencia ? ocorrencia.valor : 0;

      return total + (valor * quantidade);
    }, 0);
  }


  onContratoChange(event: any): void {
    const contrato = event.value;

    console.log(contrato)

    if (contrato && contrato.id) {
      this.listarOcorrenciasPorContrato(contrato.id);
      this.listarFuncionarios(contrato.id);
    } else {
      this.tiposOcorrencias = []; // Limpa se o contrato for desmarcado
    }
  }
}
