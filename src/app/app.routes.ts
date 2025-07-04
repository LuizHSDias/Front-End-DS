import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { CadastrarDespesaComponent } from './pages/cadastrar-despesa/cadastrar-despesa.component';
import { ConsultarDespesasComponent } from './pages/consultar-despesas/consultar-despesas.component';

export const routes: Routes = [
    { path: '', component: HomeComponent} ,
    { path: 'cadastrar', component: CadastrarDespesaComponent },
    { path: 'cadastrar/:id', component: CadastrarDespesaComponent },
    { path: 'consultar', component: ConsultarDespesasComponent }
];
