import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EquipeDTO } from '../components/core/model';

export interface PaginatedEquipeResponse {
  currentPage: number;
  perPage: number;
  total: number;
  itens: EquipeItemDTO[];
}

export interface EquipeItemDTO {
  id: number;
  nome: string;
  usuarioId: string;
  nomeEncarregado?: string;
  membros: { id?: number; nome: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class EquipeService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/api/v1/equipe`;
  }

  buscarPorContrato(contratoId: number): Observable<EquipeDTO[]> {
    return this.http.get<EquipeDTO[]>(`${this.url}/contrato/${contratoId}`);
  }

  listarPaginado(pagina: number = 0, porPagina: number = 10): Observable<PaginatedEquipeResponse> {
    return this.http.get<PaginatedEquipeResponse>(`${this.url}?page=${pagina}&pagina=${pagina}&size=${porPagina}&perPage=${porPagina}&porPagina=${porPagina}`);
  }

  cadastrar(equipe: any): Observable<any> {
    return this.http.post<any>(`${this.url}`, equipe);
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  atualizar(id: number, equipe: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, equipe);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
