import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { EquipeItemDTO, EquipeService } from 'src/app/demo/service/equipe.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { UsuarioDTO } from '../../core/model';

@Component({
  selector: 'app-listar-equipes',
  templateUrl: './listar-equipes.component.html',
  styleUrl: './listar-equipes.component.scss'
})
export class ListarEquipesComponent implements OnInit {

  equipes: EquipeItemDTO[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  rowsPerPage: number = 10;
  paginaAtual: number = 0;
  usuariosMap: Map<string, string> = new Map();

  // Edição
  exibirDialogoEdicao: boolean = false;
  equipeEditForm!: FormGroup;
  equipeEditId: number = 0;
  salvandoEdicao: boolean = false;
  encarregados: UsuarioDTO[] = [];

  constructor(
    private equipeService: EquipeService,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarUsuarios();
    this.carregarEncarregados();
    this.initEditForm();
  }

  private initEditForm(): void {
    this.equipeEditForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      usuarioId: [null, Validators.required],
      membros: this.fb.array([])
    });
  }

  get membrosEdicao(): FormArray {
    return this.equipeEditForm.get('membros') as FormArray;
  }

  carregarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (usuarios: UsuarioDTO[]) => {
        if (usuarios && Array.isArray(usuarios)) {
          usuarios.forEach(u => {
            if (u.id) {
              this.usuariosMap.set(String(u.id), u.nome);
            }
          });
        }
      },
      error: (err) => console.error('Erro ao carregar usuários:', err)
    });
  }

  carregarEncarregados(): void {
    this.usuarioService.listarEncarregado().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.encarregados = data;
        } else {
          this.buscarEFiltrarEncarregados();
        }
      },
      error: () => {
        this.buscarEFiltrarEncarregados();
      }
    });
  }

  private buscarEFiltrarEncarregados(): void {
    this.usuarioService.listar().subscribe({
      next: (todos) => {
        this.encarregados = todos.filter(u => u.cargo && u.cargo.toUpperCase().includes('ENCARREGADO'));
      },
      error: () => this.encarregados = []
    });
  }

  loadEquipes(event: LazyLoadEvent): void {
    this.loading = true;
    const page = event.first && event.rows ? Math.floor(event.first / event.rows) : 0;
    const size = event.rows || 10;

    this.paginaAtual = page;
    this.rowsPerPage = size;

    this.equipeService.listarPaginado(page, size).subscribe({
      next: (res) => {
        this.equipes = res.itens || [];
        this.totalRecords = res.total || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar equipes:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar a lista de equipes.'
        });
        this.loading = false;
      }
    });
  }

  getEncarregadoNome(item: EquipeItemDTO): string {
    if (item.nomeEncarregado) {
      return item.nomeEncarregado;
    }
    if (item.usuarioId && this.usuariosMap.has(String(item.usuarioId))) {
      return this.usuariosMap.get(String(item.usuarioId))!;
    }
    return item.usuarioId || 'Não informado';
  }

  novaEquipe(): void {
    this.router.navigate(['/equipes']);
  }

  // ========== EDIÇÃO ==========

  abrirDialogoEdicao(equipe: EquipeItemDTO): void {
    this.equipeEditId = equipe.id;
    this.equipeEditForm.reset();
    this.membrosEdicao.clear();

    this.equipeEditForm.patchValue({
      nome: equipe.nome,
      usuarioId: equipe.usuarioId
    });

    if (equipe.membros && equipe.membros.length > 0) {
      equipe.membros.forEach(m => {
        this.membrosEdicao.push(this.fb.group({
          id: [m.id || null],
          nome: [m.nome, Validators.required]
        }));
      });
    }

    this.exibirDialogoEdicao = true;
  }

  addMembroEdicao(): void {
    this.membrosEdicao.push(this.fb.group({
      id: [null],
      nome: ['', Validators.required]
    }));
  }

  removeMembroEdicao(index: number): void {
    this.membrosEdicao.removeAt(index);
  }

  salvarEdicao(): void {
    if (this.equipeEditForm.valid) {
      const formVal = this.equipeEditForm.value;

      const membrosList = this.membrosEdicao.controls.map(c => ({
        id: c.get('id')?.value || null,
        nome: c.get('nome')?.value
      })).filter(m => m.nome && m.nome.trim() !== '');

      if (membrosList.length === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Adicione pelo menos um membro para a equipe.'
        });
        return;
      }

      this.salvandoEdicao = true;

      const payload = {
        nome: formVal.nome,
        usuarioId: formVal.usuarioId,
        membros: membrosList
      };

      this.equipeService.atualizar(this.equipeEditId, payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Equipe atualizada com sucesso!'
          });
          this.exibirDialogoEdicao = false;
          this.salvandoEdicao = false;
          this.recarregarEquipes();
        },
        error: () => {
          this.salvandoEdicao = false;
        }
      });
    }
  }

  // ========== EXCLUSÃO ==========

  confirmarExclusao(equipe: EquipeItemDTO): void {
    this.confirmationService.confirm({
      message: `Deseja realmente excluir a equipe "<b>${equipe.nome}</b>"? Esta ação não poderá ser desfeita.`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.equipeService.excluir(equipe.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Equipe excluída com sucesso!'
            });
            this.recarregarEquipes();
          },
          error: () => { }
        });
      }
    });
  }

  // ========== UTILITÁRIOS ==========

  private recarregarEquipes(): void {
    this.loadEquipes({ first: this.paginaAtual * this.rowsPerPage, rows: this.rowsPerPage });
  }
}
