import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ContratoRelatorioResponse } from '../components/core/model';


@Injectable({
  providedIn: 'root'
})
export class ContratoRelatorioService {

  url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + "/api/v1/contrato-relatorio";
  }

  listarContratoRelatorio(contratoId: number, dataInicio: string, dataFim: string): Observable<ContratoRelatorioResponse> {
    const params = new HttpParams()
      .set('contratoId', contratoId.toString())
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);

    return this.http.get<ContratoRelatorioResponse>(`${this.url}`, { params });
  }

}
