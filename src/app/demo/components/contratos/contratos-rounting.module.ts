import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CadastrarContratosComponent } from "./cadastrar-contratos/cadastrar-contratos.component";
import { ListarContratosComponent } from "./listar-contratos/listar-contratos.component";
import { AuthGuard } from "../auth/auth.guard";


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CadastrarContratosComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_EDITAR_CONTRATO'] } },
        { path: 'meus-contratos', component: ListarContratosComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_CONSULTAR_CONTRATO'] } },

    ])],
    exports: [RouterModule]
})
export class ContratosRoutingModule { }
