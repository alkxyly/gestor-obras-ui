import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirmar-pagamento-dialog',
  templateUrl: './confirmar-pagamento-dialog.component.html',
  styleUrl: './confirmar-pagamento-dialog.component.scss'
})
export class ConfirmarPagamentoDialogComponent {

  exibirModal: boolean = false;
  dataSelecionada: Date;
  mostrarCalendario = false;
  @Output() confirmar = new EventEmitter<Date>();
  @Output() cancelar = new EventEmitter<void>();

  abrirDialog() {
    this.exibirModal = true;
  }

  fecharDialog() {
    this.exibirModal = false;
  }

  onConfirmar() {
    this.confirmar.emit(this.dataSelecionada);
    this.fecharDialog();
  }

  onCancelar() {
    this.dataSelecionada = null;
    this.cancelar.emit();
    this.fecharDialog();
  }

  selecionarData(opcao: 'hoje' | 'ontem' | 'outros') {
    const hoje = new Date();
    this.mostrarCalendario = false;

    switch (opcao) {
      case 'hoje':
        this.dataSelecionada = hoje;
        break;
      case 'ontem':
        const ontem = new Date(hoje);
        ontem.setDate(hoje.getDate() - 1);
        this.dataSelecionada = ontem;
        break;
      default:
        this.mostrarCalendario = true;
    }
  }

}
