import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DespesaReceitaPorMotoDTO, ResponsePagamentosSemanaDTO, ResponseReceitasDepesasAnualDTO, ResponseResumoDashboardDTO } from '../components/core/model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {


    url: string;
    
  constructor(private http: HttpClient) { 
    this.url = environment.apiUrl+"/api/v1/dashboard";
  }


  listarLocacoesPorSituacao(ano: number):Observable<ResponseReceitasDepesasAnualDTO>{
      return this.http.get<ResponseReceitasDepesasAnualDTO>(this.url+"/receitas-despesas-anual?ano=" + ano);
  }

  listarPagamentosSemana(): Observable<ResponsePagamentosSemanaDTO[]>{
    return this.http.get<ResponsePagamentosSemanaDTO[]>(this.url+"/pagamentos-semana");
  }

  listarResumoDashboard(data: string):Observable<ResponseResumoDashboardDTO>{
    return this.http.get<ResponseResumoDashboardDTO>(this.url+"/resumo?data="+data);
  }

  listarDespesasReceitasPorMoto(data: string): Observable<DespesaReceitaPorMotoDTO>{
    return this.http.get<DespesaReceitaPorMotoDTO>(this.url+"/despesa-receita-por-moto?data="+ data);
  }
}
