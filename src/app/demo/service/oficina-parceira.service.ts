import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListarOficinaParceiraPaginadaDTO, OficinaParceiraFiltroDTO, CadastrarOficinaParceiraDTO } from '../components/core/model';

@Injectable({
  providedIn: 'root'
})
export class OficinaParceiraService {
 
  url: string;

  constructor(private http: HttpClient) { 
    this.url = environment.apiUrl+"/api/v1/oficinas-parceiras";
  }

  listarOficinaParceira(filtro: OficinaParceiraFiltroDTO):Observable<ListarOficinaParceiraPaginadaDTO>{

    let params = this.extrairParametrosFilter(filtro);

    return this.http.get<ListarOficinaParceiraPaginadaDTO>(`${this.url}`, { params: params });
  }

  cadastrarOficinaParceira(oficina: CadastrarOficinaParceiraDTO): Observable<void> {
    return this.http.post<void>(`${this.url}`, oficina);
  }

  private extrairParametrosFilter(filtro: OficinaParceiraFiltroDTO) {
    let params = new HttpParams();
   
    params = params.set('pagina', filtro.pagina.toString());
    params = params.set('porPagina', filtro.porPagina.toString());
   
    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }
    return params;
  }

  atualizarOficinaParceira(oficina: CadastrarOficinaParceiraDTO): Observable<void>{
    return this.http.put<void>(`${this.url}/${oficina.id}`, oficina);
  }

}
