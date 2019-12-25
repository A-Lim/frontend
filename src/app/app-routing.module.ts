import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'helpers/auth.guard';
import { GuestGuard } from 'helpers/guest.guard';
import { LoginComponent } from 'app/components/auth/login/login.component';
import { RegisterComponent } from 'app/components/auth/register/register.component';
import { PasswordResetComponent } from 'app/components/auth/password-reset/password-reset.component';
import { DashboardComponent } from 'app/components/dashboard/dashboard.component';
import { ProfileComponent } from 'app/components/auth/profile/profile.component';
import { ListUsersComponent } from 'app/components/users/list-users/list-users.component';
import { EditUsersComponent } from 'app/components/users/edit-users/edit-users.component';
import { ListUsergroupsComponent } from './components/usergroups/list-usergroups/list-usergroups.component';
import { CreateUsergroupsComponent } from './components/usergroups/create-usergroups/create-usergroups.component';
import { EditUsergroupsComponent } from './components/usergroups/edit-usergroups/edit-usergroups.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },
  { path: 'password/reset', component: PasswordResetComponent, canActivate: [GuestGuard] },
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'admin/users', component: ListUsersComponent, canActivate: [AuthGuard] },
  { path: 'admin/users/:id', component: EditUsersComponent, canActivate: [AuthGuard] },
  { path: 'admin/usergroups', component: ListUsergroupsComponent, canActivate: [AuthGuard] },
  { path: 'admin/usergroups/create', component: CreateUsergroupsComponent, canActivate: [AuthGuard] },
  { path: 'admin/usergroups/:id', component: EditUsergroupsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, GuestGuard]
})
export class AppRoutingModule { }
