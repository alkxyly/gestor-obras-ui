import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateUtilsService {
  
   getPrimeiroEUltimoDiaDoMesAtual(): { primeiroDia: Date; ultimoDia: Date } {
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();

    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);

    return { primeiroDia, ultimoDia };
  }

  getPrimeiroEUltimoDiaDaDataInformada(mesAno: string): { primeiroDia: Date; ultimoDia: Date } {
    const mes = parseInt(mesAno.substring(0, 2));
    const ano = parseInt(mesAno.substring(2));

    const primeiroDia = new Date(ano, mes - 1, 1);
    const ultimoDia = new Date(ano, mes, 0);

    return { primeiroDia, ultimoDia };
  }

  getMesEAnoApartirDeData(data: Date): string {
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();

    return `${mes}${ano}`;
  }

  getAnoApartirDeData(data: Date): number {
    const ano = data.getFullYear();
    return data.getFullYear();
  }




}
