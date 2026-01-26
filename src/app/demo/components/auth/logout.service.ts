import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  tokensRevokeUrl: string;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { 
    this.tokensRevokeUrl = environment.apiUrl + '/auth/logout';
  }

  logout() {
    return firstValueFrom(
      this.http.delete(this.tokensRevokeUrl, { withCredentials: true })
    ).then(() => {
      this.auth.limparAccessToken();
    });
  }
}
