import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ComboDTO } from '../components/core/model';

@Injectable({
  providedIn: 'root'
})
export class TipoVeiculoService {

  url: string;
  
  constructor(private http: HttpClient) { 
    this.url = environment.apiUrl + '/api/v1/tipo'
  }

  buscarMarcas(): Observable<ComboDTO[]>{
    return this.http.get<ComboDTO[]>(this.url + "/marca");
  }

  buscarModelosPorMarca(marcaId: number): Observable<ComboDTO[]>{
    return this.http.get<ComboDTO[]>(this.url + "/marca/"+marcaId+"/modelo");
  }
}
