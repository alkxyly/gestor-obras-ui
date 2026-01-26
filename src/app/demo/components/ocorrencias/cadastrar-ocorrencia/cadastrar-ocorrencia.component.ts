import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OcorrenciaService } from 'src/app/demo/service/ocorrencia.service';
import { OcorrenciaDTO } from '../../core/model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cadastrar-ocorrencia',
  templateUrl: './cadastrar-ocorrencia.component.html',
  styleUrl: './cadastrar-ocorrencia.component.scss'
})
export class CadastrarOcorrenciaComponent {


  ocorrenciaForm!: FormGroup;
  
  // Lista de unidades simulando um serviço ou constante
  units: any[] = [
    { label: 'Unidade (UN)', value: 'UN' },
    { label: 'Cordão (C)', value: 'C' },
    { label: 'Dúzia (DZ)', value: 'DZ' },
    { label: 'Fardo (FD)', value: 'FD' },
    { label: 'Galão (GAL)', value: 'GAL' },
    { label: 'Kilograma (KG)', value: 'KG' },
    { label: 'Peça (P)', value: 'P' },
    { label: 'Quilowatt-hora (KWH)', value: 'KWH' },
    { label: 'Saco (SC)', value: 'SC' },
    { label: 'Torre (T)', value: 'T' },
    { label: 'Verba (V)', value: 'V' },
    { label: 'Litro (L)', value: 'L' },
  ];

  constructor(
    private fb: FormBuilder,
    private ocorrenciaService: OcorrenciaService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.ocorrenciaForm = this.fb.group({
      descricao: ['', [Validators.required, Validators.minLength(3)]],
      unidade: ['UN', Validators.required],
      valor: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.ocorrenciaForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.ocorrenciaForm.valid) {

      const ocorrenciaDTO: OcorrenciaDTO = {
        descricao: this.ocorrenciaForm.value.descricao,
        unidade: this.ocorrenciaForm.value.unidade,
        valor: this.ocorrenciaForm.value.valor
      }

      this.ocorrenciaService.cadastrarOcorrencia(ocorrenciaDTO).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Ocorrência cadastrada com sucesso!'
          });

          this.ocorrenciaForm.reset();
        }
      });
    }
  }
}
