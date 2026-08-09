import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, LazyLoadEvent } from 'primeng/api';
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

  constructor(
    private equipeService: EquipeService,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarUsuarios();
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
}
