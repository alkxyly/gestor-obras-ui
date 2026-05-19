import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ListarRelatorioDiarioComponent } from "./listar-relatorio-diario/listar-relatorio-diario.component";
import { MeusRelatoriosComponent } from "./meus-relatorios/meus-relatorios.component";



@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ListarRelatorioDiarioComponent },
        { path: 'meus-relatorios', component: MeusRelatoriosComponent },
        { path: ':id', component: ListarRelatorioDiarioComponent }
    ])],
    exports: [RouterModule]
})
export class RelatorioDiarioRoutingModule { }
