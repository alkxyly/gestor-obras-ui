import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContratoDTO, OcorrenciaDTO } from '../../core/model';
import { ContratoService } from 'src/app/demo/service/contrato.service';
import { OcorrenciaService } from 'src/app/demo/service/ocorrencia.service';

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
  statusOptions: StatusOption[] = [
    { label: 'Concluído', value: 'completed' },
    { label: 'Em Andamento', value: 'in_progress' },
    { label: 'Impedido', value: 'blocked' }
  ];


  funcionarios: any[] = []; // Lista para o MultiSelect

  contratos: ContratoDTO[] = [];
  constratoSelecionado: ContratoDTO;

  tiposOcorrencias: OcorrenciaDTO[] = []

  climaOptions: any[] = [
    { label: 'Sol', value: 'sol', icon: 'pi pi-sun' },
    { label: 'Nublado', value: 'nublado', icon: 'pi pi-cloud' },
    { label: 'Chuva', value: 'chuva', icon: 'pi pi-align-justify' },
    { label: 'Trovoada', value: 'trovoada', icon: 'pi pi-bolt' }
  ];

  constructor(
    private fb: FormBuilder,
    private contratoService: ContratoService,
    private ocorrenciaService: OcorrenciaService
  ) { }

  ngOnInit(): void {
    this.funcionarios = [
      { nome: 'Ana Silva', id: 1 },
      { nome: 'João Souza', id: 2 },
      { nome: 'Carlos Oliveira', id: 3 },
      { nome: 'Beatriz Costa', id: 4 },
      { nome: 'Ricardo Santos', id: 5 }
    ];
    this.initForm();
    this.listarPorResponsavel();

  }


  listarOcorrenciasPorContrato(contratoId: any) {
    this.ocorrenciaService.listarOcorrenciaPorContrato(contratoId).subscribe(response => {
      this.tiposOcorrencias = response
    })
  }

  listarPorResponsavel() {
    this.contratoService.listarPorResponsavel().subscribe(response => {
      this.contratos = response;
    })
  }

  private initForm(): void {
    this.reportForm = this.fb.group({
      date: [new Date(), Validators.required],
      endereco: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      status: ['in_progress', Validators.required],
      clima: ['sol', Validators.required],
      ocorrencias: this.fb.array([]),
      faltas: [[]],
      localizacao: [null, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      const reportData = this.reportForm.value;
      console.log('Dados do Relatório:', reportData);
      // Aqui integraria com um Service para salvar os dados
    }
  }

  // Dentro da sua classe
  get ocorrencias(): FormArray {
    return this.reportForm.get('ocorrencias') as FormArray;
  }



  addOcorrencia(): void {
    const item = this.fb.group({
      tipo: [null, Validators.required], // Agora é o valor do dropdown
      quantidade: [1, [Validators.required, Validators.min(1)]]
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
    // O event.value contém o objeto selecionado (devido ao optionLabel)
    const contrato = event.value;

    console.log(contrato)

    if (contrato && contrato.id) {
      this.listarOcorrenciasPorContrato(contrato.id);
    } else {
      this.tiposOcorrencias = []; // Limpa se o contrato for desmarcado
    }
  }
}
