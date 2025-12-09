import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DespesasFiltro, PaginationDespesas, ResumoDespesaDTO } from '../components/core/model';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DespesaService {

  url = environment.apiUrl + '/api/v1/despesas';

  constructor(private http: HttpClient) { }

  listarResumoDespesas(filtro: DespesasFiltro): Observable<ResumoDespesaDTO> {
    let params = this.extrairParametrosFilter(filtro);

    return this.http.get<ResumoDespesaDTO>(this.url + '/resumo', { params: params });
  }

  listarDespesas(filtro: DespesasFiltro): Observable<PaginationDespesas> {

    let params = this.extrairParametrosFilter(filtro);


    params = params.set("pagina", filtro.pagina.toString());
    params = params.set("porPagina", filtro.itensPorPagina.toString());


    return this.http.get<PaginationDespesas>(this.url, { params: params });
  }


  private extrairParametrosFilter(filtro: DespesasFiltro) {
    let params = new HttpParams();

    if (filtro.dataInicio) {
      params = params.set('dataInicio', formatDate(filtro.dataInicio, 'yyyy-MM-dd', 'en-US'));
    }
    if (filtro.dataFim) {
      params = params.set('dataFim', formatDate(filtro.dataFim, 'yyyy-MM-dd', 'en-US'));
    }

    if (filtro.situacao !== undefined && filtro.situacao !== null) {
      params = params.set('situacao', filtro.situacao);
    }

    if (filtro.veiculoId) {
      params = params.set('veiculoId', filtro.veiculoId.toString());
    }

    return params;
  }
}
