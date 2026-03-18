import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ListarUsuarioComponent } from "./listar-usuario/listar-usuario.component";
import { CadastrarUsuarioComponent } from "./cadastrar-usuario/cadastrar-usuario.component";
import { AuthGuard } from "../auth/auth.guard";
import { Role } from "../core/model";


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CadastrarUsuarioComponent, canActivate: [AuthGuard], data: { roles: [Role.EDITAR_USUARIO] } },
        { path: 'listar-usuarios', component: ListarUsuarioComponent, canActivate: [AuthGuard], data: { roles: [Role.EDITAR_USUARIO] } },

    ])],
    exports: [RouterModule]
})
export class UsuariosRoutingModule { }
