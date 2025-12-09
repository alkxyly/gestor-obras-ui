import { NgModule, LOCALE_ID  } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { ToastModule } from 'primeng/toast';
import { LoadingComponent } from './loading/loading.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './interceptor/loading.interceptor';
import { ProgressSpinnerModule  } from 'primeng/progressspinner';


registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [LoadingComponent],
  imports: [
    CommonModule,
    ToastModule,
    ProgressSpinnerModule
  ],
  exports:[LoadingComponent],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ]
})
export class CoreModule { }
