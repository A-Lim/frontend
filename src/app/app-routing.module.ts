import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../helpers/auth.guard';
import { GuestGuard } from '../helpers/guest.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { PasswordResetComponent } from './components/auth/password-reset/password-reset.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/auth/profile/profile.component';
import { ListUserComponent } from './components/users/list-user/list-user.component';
import { EditUserComponent } from './components/users/edit-user/edit-user.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },
  { path: 'password/reset', component: PasswordResetComponent, canActivate: [GuestGuard] },
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'admin/users', component: ListUserComponent, canActivate: [AuthGuard] },
  { path: 'admin/users/:id', component: EditUserComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, GuestGuard]
})
export class AppRoutingModule { }
