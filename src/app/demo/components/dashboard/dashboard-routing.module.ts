import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from '../core/model';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: [Role.CONSULTAR_DASHBOARD], redirectOnFailure: '/relatorio-diario/meus-relatorios' } },

    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
