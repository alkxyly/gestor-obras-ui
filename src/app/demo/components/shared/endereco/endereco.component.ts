import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CepService } from 'src/app/demo/service/cep.service';

@Component({
  selector: 'app-endereco',
  templateUrl: './endereco.component.html',
  styleUrl: './endereco.component.scss'
})
export class EnderecoComponent {

 @Input() enderecoForm: FormGroup;

  constructor(private cepService: CepService) {}

  buscarCep(): void { 
    const cep = this.enderecoForm.get('cep')?.value;
     if (cep) { 
      this.cepService.buscarCep(cep).subscribe( (data) => {
         if (data) { 
          this.enderecoForm.patchValue({
             logradouro: data.logradouro,
              bairro: data.bairro,
               cidade: data.localidade, 
               estado: data.uf }); } },
         (error) => { 
          //this.messages = [{severity: 'error', summary: 'Erro', detail: 'CEP não encontrado.' }];
         }
      ); 
    } 
  }
}
