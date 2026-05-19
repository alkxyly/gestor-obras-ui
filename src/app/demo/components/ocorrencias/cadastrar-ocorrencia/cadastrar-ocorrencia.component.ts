import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OcorrenciaService } from 'src/app/demo/service/ocorrencia.service';
import { OcorrenciaDTO } from '../../core/model';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cadastrar-ocorrencia',
  templateUrl: './cadastrar-ocorrencia.component.html',
  styleUrl: './cadastrar-ocorrencia.component.scss'
})
export class CadastrarOcorrenciaComponent {


  ocorrenciaForm!: FormGroup;
  isEditMode: boolean = false;
  ocorrenciaId: number | null = null;

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
    { label: 'Mês (MES)', value: 'MES' },
    { label: 'Metros Cúbicos (M3)', value: 'M3' },
    { label: 'Metros Quadrados (M2)', value: 'M2' },
    { label: 'Metro (M)', value: 'M' },
    { label: 'Pares (PR)', value: 'PR' },
    { label: 'Caixa (CX)', value: 'CX' },
    { label: 'Cento (CT)', value: 'CT' },
    { label: 'Grama (G)', value: 'G' },
    { label: 'Hora (H)', value: 'H' },
    { label: 'Kit (KIT)', value: 'KIT' },
    { label: 'Mililitro (ML)', value: 'ML' },
    { label: 'Pacote (PAC)', value: 'PAC' },
    { label: 'Rolo (RL)', value: 'RL' },
    { label: 'Tonelada (TON)', value: 'TON' }
  ];

  constructor(
    private fb: FormBuilder,
    private ocorrenciaService: OcorrenciaService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private checkEditMode(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.ocorrenciaId = Number(idParam);
      this.ocorrenciaService.buscarOcorrenciaPorId(this.ocorrenciaId).subscribe({
        next: (ocorrencia) => {
          this.ocorrenciaForm.patchValue({
            descricao: ocorrencia.descricao,
            unidade: ocorrencia.unidade,
            valor: ocorrencia.valor
          });
        },
        error: () => {
          this.router.navigate(['/ocorrencias/minhas-ocorrencias']);
        }
      });
    }
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

      if (this.isEditMode && this.ocorrenciaId) {
        this.ocorrenciaService.atualizarOcorrencia(this.ocorrenciaId, ocorrenciaDTO).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Ocorrência atualizada com sucesso!'
            });
            setTimeout(() => {
              this.router.navigate(['/ocorrencias/minhas-ocorrencias']);
            }, 1000);
          }
        });
      } else {
        this.ocorrenciaService.cadastrarOcorrencia(ocorrenciaDTO).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Ocorrência cadastrada com sucesso!'
            });

            this.ocorrenciaForm.reset();
            this.ocorrenciaForm.patchValue({ unidade: 'UN' });
          }
        });
      }
    }
  }
}
