import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { MessageService } from "primeng/api";
import { catchError, throwError } from "rxjs";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let summary = 'Erro';
      let detail = 'Ocorreu um erro inesperado.';

      console.log(error);
      switch (error.status) {
        case 0:
          summary = 'Sem Conexão';
          detail = 'Não foi possível conectar ao servidor. Verifique sua internet.';
          break;
        case 400:
          summary = error.error?.title;
          detail = error.error?.detail;
          break;
        case 401:
          summary = 'Sessão Expirada';
          detail = 'Por favor, faça login novamente.';
          break;
        case 403:
          summary = 'Acesso Negado';
          detail = 'Você não tem permissão para realizar esta operação.';
          break;
        case 404:
          summary = 'Não Encontrado';
          detail = 'O recurso solicitado não foi encontrado.';
          break;
        case 500:
          summary = 'Erro Interno';
          detail = 'Erro no servidor. Nossa equipe técnica já foi notificada.';
          break;
        default:
          detail = `Erro desconhecido: ${error.status}`;
      }

      messageService.add({
        severity: 'error',
        summary: summary,
        detail: detail
      });

      return throwError(() => error);
    })
  );
};