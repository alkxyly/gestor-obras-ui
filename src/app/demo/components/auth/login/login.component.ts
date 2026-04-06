import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Role } from '../../core/model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];

    email!: string;
    senha!: string;
    currentYear: number = new Date().getFullYear();

    constructor(public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router
    ) { }

    login() {
        this.authService.login(this.email, this.senha)
            .subscribe({
                next: () => {
                    if (this.authService.temPermissao(Role.CONSULTAR_DASHBOARD)) {
                        this.router.navigate(['/']);
                    } else {
                        this.router.navigate(['/relatorio-diario']);
                    }
                },
                error: (erro) => { alert("Usuário ou Senha inválido(s)!"); }
            });
    }
}
