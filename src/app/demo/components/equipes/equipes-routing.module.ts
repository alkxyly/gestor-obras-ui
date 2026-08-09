import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CadastrarEquipeComponent } from './cadastrar-equipe/cadastrar-equipe.component';
import { ListarEquipesComponent } from './listar-equipes/listar-equipes.component';
import { AuthGuard } from '../auth/auth.guard';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: CadastrarEquipeComponent, canActivate: [AuthGuard] },
    { path: 'minhas-equipes', component: ListarEquipesComponent, canActivate: [AuthGuard] }
  ])],
  exports: [RouterModule]
})
export class EquipesRoutingModule { }
