import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ListarRelatorioDiarioComponent } from "./listar-relatorio-diario/listar-relatorio-diario.component";



@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ListarRelatorioDiarioComponent }

    ])],
    exports: [RouterModule]
})
export class RelatorioDiarioRoutingModule { }
