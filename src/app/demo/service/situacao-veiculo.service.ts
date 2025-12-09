import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SituacaoVeiculoService {

  constructor() { }


  getIcon(situacao: string): string {
    switch (situacao) {
      case 'DISPONIVEL':
        return 'pi pi-check';
      case 'ALUGADO':
        return 'pi pi-shopping-cart';
      case 'VENDIDO':
        return 'pi pi-dollar';
      case 'MANUTENCAO':
        return 'pi pi-wrench';
      default:
        return 'pi pi-question';
    }
  }

  getSeverity(situacao: string): string {
    switch (situacao) {
      case 'DISPONIVEL':
        return 'success';
      case 'ALUGADO':
        return 'info';
      case 'VENDIDO':
        return 'warning';
      case 'MANUTENCAO':
        return 'danger';
      default:
        return 'default';
    }
  }
}
