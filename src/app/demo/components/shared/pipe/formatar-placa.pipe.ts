import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatarPlaca',
})
export class FormatarPlacaPipe implements PipeTransform {
  transform(placa: string): string {
    if (!placa) return ''; // Retorna vazio se a placa for nula ou indefinida

    // Insere o hífen na posição correta (exemplo: ABC1234 -> ABC-1234)
    return placa.slice(0, 3) + '-' + placa.slice(3);
  }
}