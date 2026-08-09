import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EquipeDTO } from '../components/core/model';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.apiUrl}/api/v1/equipe`;
  }

  buscarPorContrato(contratoId: number): Observable<EquipeDTO[]> {
    return this.http.get<EquipeDTO[]>(`${this.url}/contrato/${contratoId}`);
  }
}
