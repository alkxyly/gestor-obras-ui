import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CadastrarOcorrenciaComponent } from "./cadastrar-ocorrencia/cadastrar-ocorrencia.component";
import { ListarOcorrenciaComponent } from "./listar-ocorrencia/listar-ocorrencia.component";


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CadastrarOcorrenciaComponent },
        { path: 'minhas-ocorrencias', component: ListarOcorrenciaComponent },
        { path: 'editar/:id', component: CadastrarOcorrenciaComponent },
    ])],
    exports: [RouterModule]
})
export class OcorrenciasRoutingModule { }
