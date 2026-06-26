import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CadastrarSolicitacaoCompraComponent } from './cadastrar-solicitacao-compra/cadastrar-solicitacao-compra.component';
import { ListarSolicitacaoCompraComponent } from './listar-solicitacao-compra/listar-solicitacao-compra.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ListarSolicitacaoCompraComponent },
    { path: 'novo', component: CadastrarSolicitacaoCompraComponent },
    { path: 'editar/:id', component: CadastrarSolicitacaoCompraComponent }
  ])],
  exports: [RouterModule]
})
export class SolicitacaoCompraRoutingModule { }
