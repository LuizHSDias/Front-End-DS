import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { DespesaComponent } from './pages/despesa/despesa.component';
import { AddDespesaComponent } from './pages/add-despesa/add-despesa.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { AddUsuarioComponent } from './pages/add-usuario/add-usuario.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent } ,
    { path: 'categorias', component: CategoriaComponent },
    { path: 'despesas', component: DespesaComponent, },
    { path: 'add-despesa', component: AddDespesaComponent },
    { path: 'add-despesa/:id', component: AddDespesaComponent },
    { path: 'usuarios', component: UsuarioComponent, },
    { path: 'add-usuario', component: AddUsuarioComponent },
    { path: 'add-usuario/:id', component: AddUsuarioComponent },
    { path: '', component: LoginComponent}
];