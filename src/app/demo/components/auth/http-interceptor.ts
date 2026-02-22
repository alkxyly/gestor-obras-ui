import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthService } from "./auth.service";
import { Router } from '@angular/router';


export class NotAuthenticatedError { }

@Injectable()
export class FilterHttpInterceptor implements HttpInterceptor {


  constructor(private auth: AuthService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');

    if (!req.url.includes('/auth/login') && this.auth.isAccessTokenInvalido()) {
      return from(this.auth.obterNovoAccessToken())
        .pipe(
          mergeMap(() => {

            if (this.auth.isAccessTokenInvalido()) {
              this.auth.limparAccessToken();
              this.router.navigate(['/auth/login']);
              throw new NotAuthenticatedError();
            }

            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              }
            });

            return next.handle(req);
          })
        );
    } else if (token && !this.auth.isAccessTokenInvalido()) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      return next.handle(authReq);
    }

    return next.handle(req);
  }
}