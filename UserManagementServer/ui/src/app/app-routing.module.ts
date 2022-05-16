import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent }  from './login/login.component';
import { UserComponent } from './admin/user/user.component';
import { environment } from '../environments/environment';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CreatePasswordComponent } from './create-password/create-password.component';
const routes: Routes = [
{path: 'users', component: UserComponent},
{path: 'login/:code', component: LoginComponent},
{path: 'login', component: LoginComponent},
{path: 'forgot-password', component: ForgotPasswordComponent},
{path: 'create-password', component: CreatePasswordComponent},
{path: '', pathMatch: 'full', redirectTo: environment.defaultRoute},
{path: 'null', pathMatch: 'full', redirectTo: environment.defaultRoute}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
