import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ContratoDTO, RelatorioDiarioDetalhadoDTO, RelatorioDiarioDTO } from '../components/core/model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class relatorioDiarioService {

  url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + "/api/v1/relatorio-diario";
  }

  cadastrar(relatorioDiario: RelatorioDiarioDTO): Observable<RelatorioDiarioDTO> {
    return this.http.post<RelatorioDiarioDTO>(`${this.url}`, relatorioDiario);
  }

  buscarPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  atualizar(id: string, relatorioDiario: RelatorioDiarioDTO): Observable<RelatorioDiarioDTO> {
    return this.http.put<RelatorioDiarioDTO>(`${this.url}/${id}`, relatorioDiario);
  }

  listarRelatorioDiarioDetalhado(contratoId: number, dataInicio: string, dataFim: string): Observable<RelatorioDiarioDetalhadoDTO[]> {
    return this.http.get<RelatorioDiarioDetalhadoDTO[]>(`${this.url}?contratoId=${contratoId}&dataInicio=${dataInicio}&dataFim=${dataFim}`);
  }

  downloadRdo(relatorioId: string): Observable<Blob> {
    return this.http.get(`${this.url}/${relatorioId}/download-rdo`, { responseType: 'blob' });
  }

  deletar(relatorioId: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${relatorioId}`);
  }
}

