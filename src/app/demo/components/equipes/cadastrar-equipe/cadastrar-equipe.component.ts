import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { EquipeService } from 'src/app/demo/service/equipe.service';
import { UsuarioDTO } from '../../core/model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastrar-equipe',
  templateUrl: './cadastrar-equipe.component.html',
  styleUrl: './cadastrar-equipe.component.scss'
})
export class CadastrarEquipeComponent implements OnInit {

  equipeForm!: FormGroup;
  encarregados: UsuarioDTO[] = [];
  salvando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private equipeService: EquipeService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.carregarEncarregados();
    this.addMembro();
  }

  private initForm(): void {
    this.equipeForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      usuarioId: [null, Validators.required],
      membros: this.fb.array([])
    });
  }

  get membros(): FormArray {
    return this.equipeForm.get('membros') as FormArray;
  }

  addMembro(nome: string = ''): void {
    this.membros.push(this.fb.group({
      nome: [nome, Validators.required]
    }));
  }

  removeMembro(index: number): void {
    this.membros.removeAt(index);
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

  salvar(): void {
    if (this.equipeForm.valid) {
      const formVal = this.equipeForm.value;

      const membrosList = this.membros.controls.map(c => ({
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

      this.salvando = true;

      const payload = {
        nome: formVal.nome,
        usuarioId: formVal.usuarioId,
        membros: membrosList
      };

      this.equipeService.cadastrar(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Equipe cadastrada com sucesso!'
          });
          this.equipeForm.reset();
          this.membros.clear();
          this.addMembro();
          this.salvando = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao cadastrar equipe.'
          });
          this.salvando = false;
        }
      });
    }
  }
}
