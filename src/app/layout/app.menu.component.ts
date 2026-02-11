import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../demo/components/auth/auth.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService, private authService: AuthService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Inicio',
                visible: this.authService.temPermissao('ROLE_CONSULTAR_DASHBOARD'),
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-chart-line', routerLink: ['/'] }
                ]
            },

            {
                label: 'Relatório Diário',
                items: [
                    { label: 'Cadastrar Relatório Diário', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/relatorio-diario'] },
                    { label: 'Relatórios Enviados', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/relatorio-diario/meus-relatorios'] },
                ]
            },

            {
                label: 'Contratos',
                visible: this.authService.temPermissao('ROLE_EDITAR_CONTRATO') || this.authService.temPermissao('ROLE_CONSULTAR_CONTRATO'),
                items: [
                    {
                        label: 'Cadastrar Contratos', icon: 'pi pi-fw pi-file-o',
                        routerLink: ['/contratos'],
                        visible: this.authService.temPermissao('ROLE_EDITAR_CONTRATO')
                    },
                    {
                        label: 'Meus Contratos',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/contratos/meus-contratos'],
                        visible: this.authService.temPermissao('ROLE_CONSULTAR_CONTRATO')
                    },

                ]
            },
            {
                label: 'Ocorrências',
                visible: this.authService.temPermissao('ROLE_EDITAR_OCORRENCIA'),
                items: [
                    { label: 'Cadastrar Ocorrência', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/ocorrencias'] },
                    { label: 'Minhas Ocorrências', icon: 'pi pi-fw pi-list', routerLink: ['/ocorrencias/minhas-ocorrencias'] }
                ]
            },
            {
                label: 'Usuários',
                visible: this.authService.temPermissao('ROLE_EDITAR_USUARIO'),
                items: [
                    { label: 'Cadastrar Usuário', icon: 'pi pi-fw pi-user-plus', routerLink: ['/usuarios'] },
                    { label: 'Meus Usuários', icon: 'pi pi-fw pi-users', routerLink: ['/usuarios/listar-usuarios'] },
                ]
            }
        ];
    }
}
