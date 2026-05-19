import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ContratoRelatorioComponent } from "./contrato-relatorio/contrato-relatorio.component";




@NgModule({
    imports: [RouterModule.forChild([
        { path: 'contrato-relatorio', component: ContratoRelatorioComponent },
    ])],
    exports: [RouterModule]
})
export class RelatoriosoRoutingModule { }
