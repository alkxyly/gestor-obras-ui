import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UploadRequestDTO, UploadResponseDTO } from '../components/core/model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + '/api/v1/upload'
  }

  obterUrlPreAssinada(uploadRequestDTO: UploadRequestDTO): Observable<UploadResponseDTO> {
    return this.http.post<UploadResponseDTO>(`${this.url}`, uploadRequestDTO);
  }
}
