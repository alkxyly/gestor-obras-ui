import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SolicitacaoCompraService } from 'src/app/demo/service/solicitacao-compra.service';
import { UploadService } from 'src/app/demo/service/upload.service';
import { SolicitacaoCompraDTO } from '../../core/model';
import { lastValueFrom } from 'rxjs';

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
    foto: null,
    file: null
  };

  constructor(
    private router: Router,
    private solicitacaoCompraService: SolicitacaoCompraService,
    private uploadService: UploadService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  adicionarItem(): void {
    if (this.novoItem.descricao && this.novoItem.quantidade > 0) {
      this.solicitacao.itens = [...this.solicitacao.itens, { ...this.novoItem }];
      // Resetar o novoItem
      this.novoItem = {
        descricao: '',
        numeroCatalogo: '',
        quantidade: 1,
        foto: null,
        file: null
      };
    }
  }

  removerItem(index: number): void {
    this.solicitacao.itens.splice(index, 1);
    this.solicitacao.itens = [...this.solicitacao.itens];
  }

  removerFotoItem(): void {
    this.novoItem.foto = null;
    this.novoItem.file = null;
  }

  onBasicUpload(event: any, item: any, fileUpload: any): void {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      item.file = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        item.foto = e.target.result; // Armazena o preview (base64)
      };
      reader.readAsDataURL(file);
      fileUpload.clear(); // Limpa o estado para permitir selecionar de novo a mesma imagem ou outra
    }
  }

  async salvar(): Promise<void> {
    try {
      // Se o usuário preencheu o novoItem mas esqueceu de clicar no "+", adicionamos automaticamente
      if (this.novoItem.descricao && this.novoItem.quantidade > 0) {
        this.adicionarItem();
      }

      if (this.solicitacao.itens.length === 0) {
        this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Adicione pelo menos um item à solicitação.' });
        return;
      }

      // Para cada item, se houver 'file', faz o upload primeiro
      for (const item of this.solicitacao.itens) {
        if (item.file) {
          const uploadRequest = {
            originalFileName: item.file.name,
            contentLength: item.file.size
          };
          const uploadResp = await lastValueFrom(this.uploadService.obterUrlPreAssinada(uploadRequest));
          if (uploadResp && uploadResp.uploadSignedUrl) {
            await lastValueFrom(this.uploadService.uploadFile(uploadResp.uploadSignedUrl, item.file));
            item.fotoUuid = uploadResp.remoteFileName;
          }
        }
      }

      // Converte a data para yyyy-MM-dd
      const dataPrevistaFormatted = this.solicitacao.prazoLimite
        ? new Date(this.solicitacao.prazoLimite).toISOString().slice(0, 10)
        : null;

      const body: SolicitacaoCompraDTO = {
        descricao: this.solicitacao.descricao,
        dataPrevista: dataPrevistaFormatted,
        itens: this.solicitacao.itens.map(item => ({
          descricao: item.descricao,
          numeroCatalogo: item.numeroCatalogo || null,
          quantidade: item.quantidade,
          fotoUuid: item.fotoUuid || null
        }))
      };

      this.solicitacaoCompraService.cadastrar(body).subscribe({
        next: (res) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Solicitação de compra criada com sucesso!' });
          this.voltar();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar solicitação de compra.' });
        }
      });

    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao fazer upload da imagem do item.' });
    }
  }

  voltar(): void {
    this.router.navigate(['/solicitacao-compra']);
  }
}


