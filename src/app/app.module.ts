// angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// components - shared
import { SideMenuComponent } from './components/shared/side-menu/side-menu.component';
import { NavComponent } from './components/shared/nav/nav.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { ModalComponent } from './components/shared/modal/modal.component';
import { ErrorComponent } from './components/error/error.component';
// components - pages
import { LoginComponent } from './components/auth/login/login.component';
import { PasswordResetComponent } from './components/auth/password-reset/password-reset.component';
import { ProfileComponent } from './components/auth/profile/profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { EditUserComponent } from './components/users/edit-user/edit-user.component';
import { ListUserComponent } from './components/users/list-user/list-user.component';
// interceptor
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { ErrorInterceptor } from '../interceptors/error.interceptor';
import { AlertComponent } from './components/shared/alert/alert.component';
// third-party
import { AgGridModule } from 'ag-grid-angular';
// helper
import { TemplateRendererComponent } from '../helpers/template-renderer.component';
// templates


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PasswordResetComponent,
    DashboardComponent,
    SideMenuComponent,
    NavComponent,
    FooterComponent,
    ErrorComponent,
    ModalComponent,
    AlertComponent,
    RegisterComponent,
    ProfileComponent,
    EditUserComponent,
    ListUserComponent,
    // helper
    TemplateRendererComponent,
    // templates
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgGridModule.withComponents([
      TemplateRendererComponent
    ])
  ],
  // multi: true - Dont override existing headers
  providers: [
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent, ModalComponent]
})
export class AppModule { }
