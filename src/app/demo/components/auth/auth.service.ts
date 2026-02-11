import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  oauthTokenUrl: string;
  jwtPayload: any;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService) {
    this.oauthTokenUrl = environment.apiUrl + "/auth/login";
    this.carregarToken();
  }

  login(email: string, senha: string): Observable<any> {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');

    const body = { email: email, senha: senha };
    return this.http.post(this.oauthTokenUrl, body, { headers })
      .pipe(
        map(response => {
          this.armazenarToken(response['token']);
          return response;
        }
        ),
        catchError(error => {
          if (error.status === 400) {
            return throwError('Usuário ou senha inválida!');
          } else {
            console.error('An unexpected error occurred:', error);
            return throwError('An error occurred during login. Please try again.');
          }
        }
        )
      );
  }

  public armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('email', this.jwtPayload?.sub);
    localStorage.setItem('nome', this.jwtPayload?.nome);
  }

  getUserEmail(): string | null {
    return localStorage.getItem('email');
  }

  getUserNome(): string | null {
    return localStorage.getItem('nome');
  }


  temPermissao(role: string) {
    return this.jwtPayload?.roles.includes(role);
  }

  temQualquerPermissao(roles: string[]): boolean {
    for (const role of roles) {
      if (this.temPermissao(role))
        return true;
    }
    return false;
  }


  obterNovoAccessToken(): Promise<void> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');

    const body = 'grant_type=refresh_token';

    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        this.armazenarToken(response['access_token'])
      }).catch(response => {
        return Promise.resolve(null);
      });
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');
    return !token || this.jwtHelper.isTokenExpired(token);
  }

  limparAccessToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.jwtPayload = null;
  }

  carregarToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.armazenarToken(token);
    }
  }

}
