import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CadastrarContratosComponent } from "./cadastrar-contratos/cadastrar-contratos.component";
import { ListarContratosComponent } from "./listar-contratos/listar-contratos.component";
import { AuthGuard } from "../auth/auth.guard";
import { Role } from "../core/model";


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CadastrarContratosComponent, canActivate: [AuthGuard], data: { roles: [Role.EDITAR_CONTRATO] } },
        { path: 'editar/:id', component: CadastrarContratosComponent, canActivate: [AuthGuard], data: { roles: [Role.EDITAR_CONTRATO] } },
        { path: 'meus-contratos', component: ListarContratosComponent, canActivate: [AuthGuard], data: { roles: [Role.CONSULTAR_CONTRATO] } },

    ])],
    exports: [RouterModule]
})
export class ContratosRoutingModule { }
