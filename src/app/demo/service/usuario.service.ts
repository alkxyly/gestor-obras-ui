import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioDTO } from '../components/core/model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + "/api/v1/usuarios";
  }

  listar(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(`${this.url}`);
  }

  cadastrar(usuario: UsuarioDTO): Observable<any> {
    return this.http.post(this.url, usuario, { responseType: 'text' });
  }

  listarEncarregado(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(`${this.url}/encarregado`);
  }

  listarEngenheiro(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(`${this.url}/engenheiro`);
  }

  inativar(usuarioId: string): Observable<any> {
    return this.http.put(`${this.url}/${usuarioId}/inativar`, null);
  }

  ativar(usuarioId: string): Observable<any> {
    return this.http.put(`${this.url}/${usuarioId}/ativar`, null);
  }
}
