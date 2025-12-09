
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-valor',
  templateUrl: './card-valor.component.html',
  styleUrls: ['./card-valor.component.scss']
})
export class CardValorComponent {
  @Input() titulo: string = ''; 
  @Input() valor: number = 0; 
  @Input() icone: string = 'pi-wallet';
  @Input() tooltip: string = ''; 
}