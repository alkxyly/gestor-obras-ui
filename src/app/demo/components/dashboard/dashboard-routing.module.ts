import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../auth/auth.guard';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_CONSULTAR_DASHBOARD'] } },

    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
