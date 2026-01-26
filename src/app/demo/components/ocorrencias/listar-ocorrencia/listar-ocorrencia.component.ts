import { Component, OnInit } from '@angular/core';
import { OcorrenciaDTO } from '../../core/model';
import { OcorrenciaService } from 'src/app/demo/service/ocorrencia.service';

@Component({
  selector: 'app-listar-ocorrencia',
  templateUrl: './listar-ocorrencia.component.html',
  styleUrl: './listar-ocorrencia.component.scss'
})
export class ListarOcorrenciaComponent implements OnInit{

  ocorrencias: OcorrenciaDTO[] = []
  
  constructor(private ocorrenciaService: OcorrenciaService){

  }

  ngOnInit(): void {
    this.ocorrenciaService.listarOcorrencia().subscribe(response => {
      this.ocorrencias = response;
    })
  }

}
