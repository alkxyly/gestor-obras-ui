import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { LogoutService } from '../demo/components/auth/logout.service';
import { Router } from '@angular/router';
import { Role } from '../demo/components/core/model';
import { AuthService } from '../demo/components/auth/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  styleUrls: ['./app.topbar.component.scss']
})
export class AppTopBarComponent implements OnInit {

  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  email: string = '';
  nome: string = 'Usuário';

  constructor(
    public layoutService: LayoutService,
    private logoutService: LogoutService,
    private router: Router,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.email = this.authService.getUserEmail() || '';
    this.nome = this.authService.getUserNome() || 'Usuário';
  }

  get userInitials(): string {
    if (!this.nome || this.nome === 'Usuário') return 'U';
    const parts = this.nome.trim().split(' ').filter(p => p.length > 0);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  get userRoleLabel(): string {
    if (this.authService.temPermissao(Role.EDITAR_USUARIO)) {
      return 'Administrador';
    } else if (this.authService.temPermissao(Role.EDITAR_CONTRATO)) {
      return 'Engenheiro / Gestor';
    } else if (this.authService.temPermissao(Role.CONSULTAR_CONTRATO)) {
      return 'Fiscal de Obra';
    }
    return 'Usuário do Sistema';
  }

  logout() {
    this.logoutService.logout()
      .then(() => {
        this.router.navigate(['/auth/login']);
      })
      .catch(erro => { });
  }
}
