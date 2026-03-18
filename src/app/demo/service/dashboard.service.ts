import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DashboardDTO, DespesaReceitaPorMotoDTO, ResponsePagamentosSemanaDTO, ResponseReceitasDepesasAnualDTO, ResponseResumoDashboardDTO } from '../components/core/model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + "/api/v1/dashboard";
  }

  obterDashboard(): Observable<DashboardDTO> {
    return this.http.get<DashboardDTO>(this.url);
  }
}
