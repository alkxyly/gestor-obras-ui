import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthService } from "./auth.service";


export class NotAuthenticatedError {}

@Injectable()
export class FilterHttpInterceptor implements HttpInterceptor{


    constructor(private auth: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      
      const token = localStorage.getItem('token');
      
      if (!req.url.includes('/auth/login') && this.auth.isAccessTokenInvalido()) {
            return from(this.auth.obterNovoAccessToken())
            .pipe(
              mergeMap(() => {
              
                if (this.auth.isAccessTokenInvalido()) {
                  throw new NotAuthenticatedError();
                }
    
                req = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                  }
                });
    
                return next.handle(req);
              })
            );
        }else if(token && !this.auth.isAccessTokenInvalido()){
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