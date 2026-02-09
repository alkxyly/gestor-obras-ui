import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ListarUsuarioComponent } from "./listar-usuario/listar-usuario.component";
import { CadastrarUsuarioComponent } from "./cadastrar-usuario/cadastrar-usuario.component";


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CadastrarUsuarioComponent },
        { path: 'listar-usuarios', component: ListarUsuarioComponent },

    ])],
    exports: [RouterModule]
})
export class UsuariosRoutingModule { }
