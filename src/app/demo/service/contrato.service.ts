import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ContratoDTO, UsuarioDTO } from '../components/core/model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + "/api/v1/contrato";
  }

  cadastrar(contrato: ContratoDTO): Observable<ContratoDTO> {
    return this.http.post<ContratoDTO>(`${this.url}`, contrato);
  }

  listar(): Observable<ContratoDTO[]> {
    return this.http.get<ContratoDTO[]>(`${this.url}`);
  }

  listarPorResponsavel(): Observable<ContratoDTO[]> {
    return this.http.get<ContratoDTO[]>(`${this.url}/responsavel`);
  }

  listarFuncionariosDoContrato(id: number): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(`${this.url}/${id}/funcionarios`);
  }

  definirEncarregado(idContrato: number, idUsuario: string): Observable<void> {
    return this.http.put<void>(`${this.url}/${idContrato}/encarregado/${idUsuario}`, {});
  }
}
