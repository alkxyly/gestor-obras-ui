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

  uploadFile(url: string, file: File): Observable<any> {
    return new Observable(observer => {
      fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      }).then(response => {
        if (response.ok) {
          observer.next(response);
          observer.complete();
        } else {
          observer.error(response);
        }
      }).catch(err => {
        observer.error(err);
      });
    });
  }
}
