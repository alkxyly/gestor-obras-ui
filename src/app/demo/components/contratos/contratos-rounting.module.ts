import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CadastrarContratosComponent } from "./cadastrar-contratos/cadastrar-contratos.component";
import { ListarContratosComponent } from "./listar-contratos/listar-contratos.component";


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CadastrarContratosComponent },
        { path: 'meus-contratos', component: ListarContratosComponent },

    ])],
    exports: [RouterModule]
})
export class ContratosRoutingModule { }
