import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../demo/components/auth/auth.service';
import { Role } from '../demo/components/core/model';

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
                label: 'Início',
                visible: this.authService.temPermissao(Role.CONSULTAR_DASHBOARD),
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },

            {
                label: 'Relatório Diário',
                items: [
                    { label: 'Novo RDO', icon: 'pi pi-fw pi-file-edit', routerLink: ['/relatorio-diario'] },
                    { label: 'Relatórios Enviados', icon: 'pi pi-fw pi-folder-open', routerLink: ['/relatorio-diario/meus-relatorios'] },
                ]
            },

            {
                label: 'Contratos',
                visible: this.authService.temPermissao(Role.EDITAR_CONTRATO) || this.authService.temPermissao(Role.CONSULTAR_CONTRATO),
                items: [
                    {
                        label: 'Cadastrar Contrato', icon: 'pi pi-fw pi-briefcase',
                        routerLink: ['/contratos'],
                        visible: this.authService.temPermissao(Role.EDITAR_CONTRATO)
                    },
                    {
                        label: 'Meus Contratos',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/contratos/meus-contratos'],
                        visible: this.authService.temPermissao(Role.CONSULTAR_CONTRATO)
                    },

                ]
            },
            {
                label: 'Ocorrências',
                visible: this.authService.temPermissao(Role.EDITAR_OCORRENCIA),
                items: [
                    { label: 'Cadastrar Ocorrência', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/ocorrencias'] },
                    { label: 'Minhas Ocorrências', icon: 'pi pi-fw pi-table', routerLink: ['/ocorrencias/minhas-ocorrencias'] }
                ]
            },
            {
                label: 'Usuários',
                visible: this.authService.temPermissao(Role.EDITAR_USUARIO),
                items: [
                    { label: 'Cadastrar Usuário', icon: 'pi pi-fw pi-user-plus', routerLink: ['/usuarios'] },
                    { label: 'Meus Usuários', icon: 'pi pi-fw pi-users', routerLink: ['/usuarios/listar-usuarios'] },
                ]
            },
            {
                label: 'Equipes',
                visible: this.authService.temPermissao(Role.EDITAR_CONTRATO),
                items: [
                    { label: 'Cadastrar Equipe', icon: 'pi pi-fw pi-users', routerLink: ['/equipes'] },
                    { label: 'Minhas Equipes', icon: 'pi pi-fw pi-sitemap', routerLink: ['/equipes/minhas-equipes'] }
                ]
            },
            {
                label: 'Solicitação de Compra',
                visible: this.authService.temPermissao(Role.EDITAR_CONTRATO),
                items: [
                    { label: 'Cadastrar Solicitação', icon: 'pi pi-fw pi-cart-plus', routerLink: ['/solicitacao-compra/novo'] },
                    { label: 'Minhas Solicitações', icon: 'pi pi-fw pi-shopping-bag', routerLink: ['/solicitacao-compra'] },
                ]
            },
            {
                label: 'Relatórios Gerenciais',
                visible: this.authService.temPermissao(Role.CONSULTAR_DASHBOARD),
                items: [
                    { label: 'Relatório de Contratos', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/relatorios/contrato-relatorio'] },
                ]
            }

        ];
    }
}
