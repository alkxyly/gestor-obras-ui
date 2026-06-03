import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastrar-solicitacao-compra',
  templateUrl: './cadastrar-solicitacao-compra.component.html',
  styleUrls: ['./cadastrar-solicitacao-compra.component.scss']
})
export class CadastrarSolicitacaoCompraComponent implements OnInit {

  solicitacao: any = {
    descricao: '',
    prazoLimite: null,
    itens: []
  };

  novoItem: any = {
    descricao: '',
    numeroCatalogo: '',
    quantidade: 1,
    foto: null
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  adicionarItem(): void {
    if (this.novoItem.descricao && this.novoItem.quantidade > 0) {
      this.solicitacao.itens.push({ ...this.novoItem });
      // Resetar o novoItem
      this.novoItem = {
        descricao: '',
        numeroCatalogo: '',
        quantidade: 1,
        foto: null
      };
    }
  }

  removerItem(index: number): void {
    this.solicitacao.itens.splice(index, 1);
  }

  removerFotoItem(): void {
    this.novoItem.foto = null;
  }

  onBasicUpload(event: any, item: any, fileUpload: any): void {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        item.foto = e.target.result; // Armazena o preview (base64)
      };
      reader.readAsDataURL(file);
      fileUpload.clear(); // Limpa o estado para permitir selecionar de novo a mesma imagem ou outra
    }
  }

  salvar(): void {
    console.log('Solicitação salva:', this.solicitacao);
    this.voltar();
  }

  voltar(): void {
    this.router.navigate(['/solicitacao-compra']);
  }
}

