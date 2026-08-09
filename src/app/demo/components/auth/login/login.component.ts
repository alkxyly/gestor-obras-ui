import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Role } from '../../core/model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .p-input-icon-left > i:first-child {
            left: 1rem !important;
            z-index: 2 !important;
            margin-top: -0.5rem !important;
            top: 50% !important;
        }
        :host ::ng-deep .p-input-icon-left > .p-inputtext,
        :host ::ng-deep .p-input-icon-left > p-password > .p-inputtext {
            padding-left: 2.75rem !important;
        }
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform: scale(1.3);
            margin-right: 0.75rem;
            color: var(--text-color-secondary) !important;
        }

        @keyframes floatBadge1 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes floatBadge2 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(8px) rotate(-1deg); }
        }
        @keyframes pulseSignal {
            0% { box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4); }
            70% { box-shadow: 0 0 0 12px rgba(33, 150, 243, 0); }
            100% { box-shadow: 0 0 0 0 rgba(33, 150, 243, 0); }
        }
        @keyframes shine {
            0% { left: -100%; }
            100% { left: 200%; }
        }

        @keyframes cardFloatMotion {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
        }

        .animated-float-1 {
            animation: floatBadge1 4s ease-in-out infinite;
        }
        .animated-float-2 {
            animation: floatBadge2 4.5s ease-in-out infinite 0.5s;
        }
        .pulse-beacon {
            animation: pulseSignal 2s infinite;
        }

        .card-motion-1 {
            animation: cardFloatMotion 4.8s ease-in-out infinite;
        }
        .card-motion-2 {
            animation: cardFloatMotion 5.2s ease-in-out infinite 0.5s;
        }
        .card-motion-3 {
            animation: cardFloatMotion 5.6s ease-in-out infinite 1.0s;
        }
        .card-motion-4 {
            animation: cardFloatMotion 6.0s ease-in-out infinite 1.5s;
        }

        .hover-lift-card {
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
        }
        .hover-lift-card:hover {
            animation-play-state: paused;
            transform: translateY(-8px) scale(1.02) !important;
            box-shadow: 0 18px 30px -8px rgba(33, 150, 243, 0.25) !important;
        }
        .shine-effect {
            position: relative;
            overflow: hidden;
        }
        .shine-effect::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
            transform: skewX(-20deg);
            animation: shine 6s infinite;
        }
    `]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];
    rememberMe: boolean = false;

    email!: string;
    senha!: string;
    carregando: boolean = false;
    currentYear: number = new Date().getFullYear();

    constructor(public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router
    ) { }

    login() {
        if (!this.email || !this.senha || this.carregando) {
            return;
        }

        this.carregando = true;
        this.authService.login(this.email, this.senha)
            .subscribe({
                next: () => {
                    this.carregando = false;
                    if (this.authService.temPermissao(Role.CONSULTAR_DASHBOARD)) {
                        this.router.navigate(['/']);
                    } else {
                        this.router.navigate(['/relatorio-diario']);
                    }
                },
                error: (erro) => {
                    this.carregando = false;
                    alert("Usuário ou Senha inválido(s)!");
                }
            });
    }
}
