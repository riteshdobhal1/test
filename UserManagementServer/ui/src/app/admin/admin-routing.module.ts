import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { EndcustomerComponent } from './endcustomer/endcustomer.component';
import { ErrorComponent } from '../shared/error/error.component';
import { RedirectComponent } from '../shared/redirect/redirect.component';
const routes: Routes = [
  {
    path: 'users',
    component: UserComponent,
    data: { title: 'List of users' }
  }, 
  {
    path: 'roles',
    component: RoleComponent,
    data: { title: 'Role List' }
  },
  {
    path: 'endcustomers',
    component: EndcustomerComponent,
    data: { title: 'System Group List' }
  },
  { 
    path: 'apps',
    component: RedirectComponent    
  },
  {path: 'error/:code', component: ErrorComponent},
  {path: 'error', component: ErrorComponent},
  {path: '**', redirectTo: '/error'},
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
