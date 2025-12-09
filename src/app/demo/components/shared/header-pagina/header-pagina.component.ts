import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-pagina',
  templateUrl: './header-pagina.component.html',
  styleUrl: './header-pagina.component.scss'
})
export class HeaderPaginaComponent {
  @Input() titulo: string = ''; 
  @Input() descricao: string = ''; 
}
