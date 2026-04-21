import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { ContratoDTO, OcorrenciaDTO, RelatorioDiarioDTO, UploadRequestDTO, UsuarioDTO, ImageDTO, Role } from '../../core/model';
import { ContratoService } from 'src/app/demo/service/contrato.service';
import { OcorrenciaService } from 'src/app/demo/service/ocorrencia.service';
import { relatorioDiarioService } from 'src/app/demo/service/relatorio-diario.service';
import { MessageService } from 'primeng/api';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { UploadService } from 'src/app/demo/service/upload.service';
import { AuthService } from 'src/app/demo/components/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

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

  uploading: boolean = false;
  uploadedFiles: any[] = [];
  @ViewChild('fileUpload') fileUpload: any;

  relatorioId: string | null = null;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private contratoService: ContratoService,
    private ocorrenciaService: OcorrenciaService,
    private relatorioDiarioService: relatorioDiarioService,
    private messageService: MessageService,
    private usuarioService: UsuarioService,
    private uploadService: UploadService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) { }

  get podeConsultarValorTotal(): boolean {
    return this.authService.temPermissao(Role.CONSULTAR_DASHBOARD);
  }

  ngOnInit(): void {
    this.initForm();
    this.listarPorResponsavel();

    this.route.paramMap.subscribe(params => {
      this.relatorioId = params.get('id');
      if (this.relatorioId) {
        this.isEditMode = true;
        this.carregarRelatorio(this.relatorioId);
      }
    });
  }

  carregarRelatorio(id: string) {
    this.relatorioDiarioService.buscarPorId(id).subscribe({
      next: (relatorio: any) => {
        const relatorioContratoId = relatorio.contratoId || (relatorio.contrato ? relatorio.contrato.id : undefined);
        if (relatorioContratoId) {
          this.contratoSelecionado = this.contratos.find(c => c.id == relatorioContratoId) || relatorioContratoId;
          const cid = typeof this.contratoSelecionado === 'object' ? this.contratoSelecionado.id : relatorioContratoId;
          this.listarOcorrenciasPorContrato(cid);
          this.listarFuncionarios(cid);
        }

        let localizacao = null;
        if (relatorio.estado && relatorio.cidade) {
          localizacao = {
            estado: { sigla: relatorio.estado },
            cidade: { nome: relatorio.cidade }
          };
        }

        let ano, mes, dia;
        if (relatorio.dataCadastro) {
          if (relatorio.dataCadastro.includes('T')) {
            [ano, mes, dia] = relatorio.dataCadastro.split('T')[0].split('-');
          } else {
            [ano, mes, dia] = relatorio.dataCadastro.split('-');
          }
        }

        let funcionariosObjArray = [];
        if (relatorio.funcionariosAusentes && Array.isArray(relatorio.funcionariosAusentes)) {
          funcionariosObjArray = relatorio.funcionariosAusentes;
        }

        if (relatorio.fotos && Array.isArray(relatorio.fotos)) {
          relatorio.fotos.forEach(async (url: string) => {
             const fileName = url.split('/').pop()?.split('?')[0] || 'foto.jpg';
             
             let finalObjectURL: any;
             let fileSize: number;
             let rawFile: any;

             try {
                 const response = await fetch(url);
                 const blob = await response.blob();
                 finalObjectURL = URL.createObjectURL(blob);
                 fileSize = blob.size;
                 rawFile = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
             } catch(e) {
                 fileSize = 100 * 1024;
                 finalObjectURL = this.sanitizer.bypassSecurityTrustUrl(url);
                 const emptyBlob = new Blob([' '], { type: 'image/jpeg' });
                 rawFile = new File([emptyBlob], fileName, { type: 'image/jpeg' });
                 Object.defineProperty(rawFile, 'size', { value: fileSize });
             }

             const mockFile: any = rawFile;
             mockFile.objectURL = finalObjectURL; 
             mockFile.isMock = true; 
             mockFile.originalRemoteUrl = fileName; 
             
             this.uploadedFiles.push(mockFile);
             
             if (this.fileUpload) {
                 this.fileUpload.files = [...this.uploadedFiles];
                 // Força explicitamente o PrimeNG a processar os dados injetados via código sem aguardar click do "Escolher"
                 if (this.fileUpload.cd) {
                     this.fileUpload.cd.detectChanges();
                 }
                 this.cdr.detectChanges();
             }
          });
        }

        this.reportForm.patchValue({
          dataCadastro: ano ? new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia)) : new Date(),
          titulo: relatorio.titulo,
          descricao: relatorio.descricao,
          condicaoClimatica: relatorio.condicaoClimatica,
          localizacao: localizacao,
          linha: relatorio.linha,
          estrutura: relatorio.estrutura,
          kmPercorrido: relatorio.kmPercorrido,
          funcionariosAusentesId: funcionariosObjArray
        });

        this.ocorrencias.clear();
        const ocorrenciasArray = relatorio.ocorrenciaItens || relatorio.ocorrencias || [];
        if (ocorrenciasArray && ocorrenciasArray.length > 0) {

          let fallbackTipos = ocorrenciasArray.map((item: any) => {
            let tipoId = item.id || item.ocorrenciaId || item.tipo;
            if (item.ocorrencia) tipoId = item.ocorrencia.id || tipoId;

            return {
              id: Number(tipoId),
              descricao: item.descricao || item.ocorrencia?.descricao || ('Ocorrência ' + tipoId),
              valor: item.valor || 0,
              unidade: item.unidade || ''
            }
          });

          const existingIds = new Set(this.tiposOcorrencias.map(t => t.id));
          let hasNew = false;
          fallbackTipos.forEach((f: any) => {
            if (!existingIds.has(f.id)) {
              this.tiposOcorrencias.push(f);
              hasNew = true;
            }
          });
          if (hasNew) {
            this.tiposOcorrencias = [...this.tiposOcorrencias]; // trigger array change references
          }

          ocorrenciasArray.forEach((item: any) => {
            let tipoId = item.id || item.ocorrenciaId || item.tipo;
            if (item.ocorrencia) {
              tipoId = item.ocorrencia.id || tipoId;
            }
            this.ocorrencias.push(this.fb.group({
              tipo: [tipoId ? Number(tipoId) : null, Validators.required],
              quantidade: [item.quantidade || 1, [Validators.required, Validators.min(1)]],
              valor: [item.valor || 0, Validators.required]
            }));
          });
        }
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar relatório para edição.' });
      }
    });
  }


  listarFuncionarios(contratoId: number) {
    this.contratoService.listarFuncionariosDoContrato(contratoId).subscribe(response => {
      this.funcionarios = response;
    })
  }


  listarOcorrenciasPorContrato(contratoId: any) {
    this.ocorrenciaService.listarOcorrenciaPorContrato(contratoId).subscribe(response => {
      const dbTipos = response.map((o: any) => ({ ...o, id: Number(o.id) }));
      const serverIds = new Set(dbTipos.map((r: any) => r.id));
      const historicos = this.tiposOcorrencias.filter(t => !serverIds.has(t.id));
      this.tiposOcorrencias = [...dbTipos, ...historicos];

      if (this.isEditMode && this.ocorrencias.length > 0) {
        setTimeout(() => {
          this.ocorrencias.controls.forEach(ctrl => {
            const val = ctrl.get('tipo')?.value;
            if (val) {
              ctrl.get('tipo')?.setValue(null, { emitEvent: false });
              ctrl.get('tipo')?.setValue(Number(val));
            }
          });
        });
      }
    })
  }

  listarPorResponsavel() {
    this.contratoService.listarPorResponsavel().subscribe(response => {
      this.contratos = response;
      if (this.contratoSelecionado && typeof this.contratoSelecionado !== 'object') {
        this.contratoSelecionado = this.contratos.find(c => c.id == (this.contratoSelecionado as any)) as any;
      }
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
      localizacao: [null, Validators.required],
      linha: [''],
      estrutura: [''],
      kmPercorrido: [0]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.reportForm.valid) {
      this.uploading = true;
      try {
        let fotos: ImageDTO[] = [];

        // Lemos diretamente da array interna do componente, que é a única fonte da verdade sempre atualizada
        const validFiles = (this.fileUpload && this.fileUpload.files) ? this.fileUpload.files : this.uploadedFiles;

        if (validFiles && validFiles.length > 0) {
          for (const file of validFiles) {
            if (file.isMock) {
               fotos.push({ nomeRemoto: file.originalRemoteUrl, tamanho: file.size || 0 });
            } else {
               const uploadRequestDTO: UploadRequestDTO = {
                 originalFileName: file.name,
                 contentLength: file.size
               };

               const response = await lastValueFrom(this.uploadService.obterUrlPreAssinada(uploadRequestDTO));

               if (response && response.uploadSignedUrl) {
                 const url = response.uploadSignedUrl;
                 const remoteFileName = response.remoteFileName;
                 console.log(remoteFileName);
                 await lastValueFrom(this.uploadService.uploadFile(url, file));
                 fotos.push({ nomeRemoto: remoteFileName, tamanho: file.size });
               }
            }
          }
        }

        const dto = this.transformToDTO(this.reportForm.value);
        dto.fotos = fotos;

        if (this.isEditMode && this.relatorioId) {
          this.relatorioDiarioService.atualizar(this.relatorioId, dto).subscribe(
            response => {
              this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Relatório diário atualizado com sucesso' });
              this.uploading = false;
              setTimeout(() => this.router.navigate(['/relatorio-diario/meus-relatorios']), 1500);
            },
            error => {
              this.uploading = false;
            }
          );
        } else {
          this.relatorioDiarioService.cadastrar(dto).subscribe(
            response => {
              this.reportForm.reset();
              this.contratoSelecionado = null as any;
              this.uploadedFiles = [];
              if (this.fileUpload) {
                this.fileUpload.clear();
              }
              this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Relatório diário cadastrado com sucesso' });
              this.uploading = false;
            },
            error => {
              this.uploading = false;
            }
          );
        }
      } catch (error) {
        this.uploading = false;
      }
    }
  }

  // No PrimeNG 14+, 'event' do onSelect contém 'currentFiles', mas o onRemove contém apena 'file'.
  // Portanto, para evitar bugs do array ficar undefined ao tentar ler currentFiles no Remove, deixamos os métodos vazios 
  // e faremos com que o botão de Salvar leia a lista DIRETAMENTE do this.fileUpload.files da tela sempre.
  onSelect(event: any) { }

  onRemove(event: any) { }

  onClear() { }

  private transformToDTO(reportData: any, fotos: ImageDTO[] = []): RelatorioDiarioDTO {
    const d = new Date(reportData.dataCadastro);
    const dataCadastro = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return {
      dataCadastro: dataCadastro,
      titulo: reportData.titulo,
      descricao: reportData.descricao,
      condicaoClimatica: reportData.condicaoClimatica,
      estado: reportData.localizacao?.estado?.sigla || '',
      cidade: reportData.localizacao?.cidade?.nome || '',
      contratoId: this.contratoSelecionado?.id,
      ocorrenciaItens: reportData.ocorrencias.map((item: any) => {
        const ocorrenciaTipo = this.tiposOcorrencias.find(t => t.id == item.tipo);
        return {
          id: item.tipo,
          quantidade: item.quantidade,
          valor: ocorrenciaTipo ? ocorrenciaTipo.valor : (item.valor || 0)
        };
      }),
      funcionariosAusentesId: reportData.funcionariosAusentesId ? reportData.funcionariosAusentesId.map((usuario: UsuarioDTO) => usuario.id) : [],
      fotos: fotos,
      linha: reportData.linha,
      estrutura: reportData.estrutura,
      kmPercorrido: reportData.kmPercorrido
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

      const ocorrencia = this.tiposOcorrencias.find(o => o.id == tipoId);
      const valorBase = ocorrencia ? ocorrencia.valor : Number(control.get('valor')?.value || 0);

      return total + (valorBase * quantidade);
    }, 0);
  }


  onContratoChange(event: any): void {
    const contrato = event.value;

    console.log(contrato)

    if (contrato && contrato.id) {
      this.listarOcorrenciasPorContrato(contrato.id);
      this.listarFuncionarios(contrato.id);
    } else {
      this.tiposOcorrencias = [];
    }
  }
}
