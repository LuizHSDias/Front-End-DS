import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})

export class MenuComponent {
  nivel = 'NIVEL0';

  menu = [
    { descricao: 'Categorias', rota: '/tipos', niveis: ['NIVEL1','NIVEL2','NIVEL3']},
    { descricao: 'Despesas', rota: '/despesas', niveis: ['NIVEL1', 'NIVEL2']},
    { descricao: 'Receitas', rota: '/receitas', niveis: ['NIVEL1', 'NIVEL2', 'NIVEL3']},
    { descricao: 'Usuarios', rota: '/usuarios', niveis: ['NIVEL1', 'NIVEL2', 'NIVEL3']}
  ]

  constructor(private loginService: LoginService){}

  /*
  ngOnInit(): void {
    const dadosToken = this.loginService.extrairDadosToken();
    console.log(dadosToken)
    if (dadosToken && dadosToken.roles){
      // remove "ROLE_" com a empressão regular /^ROLE_/
      this.nivel = dadosToken.roles.replace(/^ROLE_/, '');
    } else {
      console.warn('Não foi possível determinar o nível do usuário a partir do token.');
    } 
  } */ 
}