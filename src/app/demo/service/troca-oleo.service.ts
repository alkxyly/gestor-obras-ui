import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListarTrocaOleoDTO, ListarUltimasTrocasOleoDTO, CadastrarTrocaOleoDTO, ComboDTO, ListarOleoDTO } from '../components/core/model';

@Injectable({
  providedIn: 'root'
})
export class TrocaOleoService {

   url: string;
    
    constructor(private http: HttpClient) { 
      this.url = environment.apiUrl + '/api/v1/troca-oleo'
    }

    listarTrocaOleo(veiculoId: number): Observable<ListarTrocaOleoDTO[]>{
        return this.http.get<ListarTrocaOleoDTO[]>(`${this.url}/${veiculoId}`);
    }

    listarUltimasTrocas(): Observable<ListarUltimasTrocasOleoDTO[]>{
      return this.http.get<ListarUltimasTrocasOleoDTO[]>(`${this.url}/ultimas`);
    }

    cadastrarTrocaOleo(trocaOleo: CadastrarTrocaOleoDTO): Observable<any>{
      return this.http.post<any>(`${this.url}`, trocaOleo);
    }

    buscarOleos(): Observable<ListarOleoDTO[]>{
      return this.http.get<ListarOleoDTO[]>(`${this.url}/oleos`);
    }
}
