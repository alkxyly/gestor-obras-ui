import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { FilterHttpInterceptor } from './http-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './auth.guard';


export function tokenGetter(): string {  return localStorage.getItem('token');}

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule
    ],
    providers:[        
        {
            provide: HTTP_INTERCEPTORS,
            useClass: FilterHttpInterceptor,
            multi:true
        },
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        AuthGuard,
        JwtHelperService]
})
export class AuthModule {

 }
