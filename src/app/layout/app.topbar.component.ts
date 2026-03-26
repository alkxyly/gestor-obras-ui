import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { LogoutService } from '../demo/components/auth/logout.service';
import { Router } from '@angular/router';
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

  members = [
    { name: 'Amy Elsner', image: 'amyelsner.png', email: 'amy@email.com', role: 'Owner' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png', email: 'bernardo@email.com', role: 'Editor' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png', email: 'ioni@email.com', role: 'Viewer' }
  ];



  constructor(
    public layoutService: LayoutService,
    private logoutService: LogoutService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.email = this.authService.getUserEmail();
    this.nome = this.authService.getUserNome();
  }

  logout() {
    this.logoutService.logout()
      .then(() => {
        this.router.navigate(['/auth/login']);
      })
      .catch(erro => { });
  }
}
