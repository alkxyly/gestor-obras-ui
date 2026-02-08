import { Component, OnInit } from '@angular/core';
import { ContratoService } from 'src/app/demo/service/contrato.service';
import { ContratoDTO } from '../../core/model';

@Component({
  selector: 'app-listar-contratos',
  templateUrl: './listar-contratos.component.html',
  styleUrl: './listar-contratos.component.scss'
})
export class ListarContratosComponent implements OnInit {

  contratos: ContratoDTO[] = [];
  cols: any[] = [];


  constructor(private constratoService: ContratoService) {

  }

  ngOnInit() {

    this.constratoService.listar().subscribe(response => this.contratos = response);

    this.cols = [
      { field: 'nome', header: 'Nome' },
      { field: 'descricao', header: 'Descrição' },
      { field: 'dataInicio', header: 'Início' },
      { field: 'dataFim', header: 'Fim' }
    ];
  }

}
