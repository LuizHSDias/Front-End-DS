import { Component } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'] 
})
export class MenuComponent {

  menu = [
    { descricao: 'Categorias', rota: '/tipos', niveis: ['NIVEL1','NIVEL2','NIVEL3']},
    { descricao: 'Despesas', rota: '/despesas', niveis: ['NIVEL1', 'NIVEL2']},
    { descricao: 'Receitas', rota: '/receitas', niveis: ['NIVEL1', 'NIVEL2', 'NIVEL3']},
    { descricao: 'Usuarios', rota: '/usuarios', niveis: ['NIVEL1', 'NIVEL2', 'NIVEL3']},
    { descricao: 'Extrato', rota: '/extrato', niveis: ['NIVEL1', 'NIVEL2', 'NIVEL3']}
  ];

  private subscription!: Subscription;
  menuUsuario: { descricao: string, rota: string, niveis: string[] }[] = [];
  nivelUsuario!: string;
  nomeUsuario!: string;

  constructor(private loginService: LoginService, private router: Router) { 
      this.nivelUsuario = '';
      this.nomeUsuario = '';
      this.menuUsuario = [];
  }

  ngOnInit(): void {    
    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.atualizarMenu();
      }
    });

    this.atualizarMenu(); 
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); 
  }

  private atualizarMenu(): void {
    const dadosToken = this.loginService.extrairDadosToken();

    if (dadosToken && dadosToken.roles) {
      this.nivelUsuario = dadosToken.roles.replace(/^ROLE_/, '');
      this.nomeUsuario = dadosToken.sub;
      this.menuUsuario = this.menu.filter(item => item.niveis.includes(this.nivelUsuario));
    } else {
      this.nivelUsuario = '';
      this.nomeUsuario = '';
      this.menuUsuario = [];
    }
  }

  sair(): void {
    this.loginService.limparToken();
    this.atualizarMenu();    
  }
}

