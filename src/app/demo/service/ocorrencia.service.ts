import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OcorrenciaDTO } from '../components/core/model';

@Injectable({
  providedIn: 'root'
})
export class OcorrenciaService {

  url: string;

  constructor(private http: HttpClient) { 
    this.url = environment.apiUrl+"/api/v1/ocorrencias";
  }

  cadastrarOcorrencia(ocorrencia: OcorrenciaDTO): Observable<OcorrenciaDTO> {
    return this.http.post<OcorrenciaDTO>(`${this.url}`, ocorrencia);
  }

  listarOcorrencia(): Observable<OcorrenciaDTO[]>{
    return this.http.get<OcorrenciaDTO[]>(this.url);
  }

  listarOcorrenciaPorContrato(contratoId: number): Observable<OcorrenciaDTO[]>{
    return this.http.get<OcorrenciaDTO[]>(`${this.url}/contrato/${contratoId}`);
  }

  buscarOcorrenciaPorId(id: number): Observable<OcorrenciaDTO> {
    return this.http.get<OcorrenciaDTO>(`${this.url}/${id}`);
  }

  atualizarOcorrencia(id: number, ocorrencia: OcorrenciaDTO): Observable<OcorrenciaDTO> {
    return this.http.put<OcorrenciaDTO>(`${this.url}/${id}`, ocorrencia);
  }
}
