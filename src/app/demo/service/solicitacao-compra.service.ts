import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SolicitacaoCompraDTO, PaginationSolicitacaoCompra, SolicitacaoCompraFiltro } from '../components/core/model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoCompraService {

  url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + "/api/v1/solicitacoes-compra";
  }

  cadastrar(solicitacao: SolicitacaoCompraDTO): Observable<SolicitacaoCompraDTO> {
    return this.http.post<SolicitacaoCompraDTO>(`${this.url}`, solicitacao);
  }

  listar(filtro: SolicitacaoCompraFiltro): Observable<PaginationSolicitacaoCompra> {
    let params = new HttpParams();
    params = params.set('pagina', filtro.pagina.toString());
    params = params.set('porPagina', filtro.porPagina.toString());
    if (filtro.descricao) {
      params = params.set('descricao', filtro.descricao);
    }
    console.log("params" + params.toString());
    return this.http.get<PaginationSolicitacaoCompra>(`${this.url}`, { params });
  }
}

