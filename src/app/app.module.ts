// angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// components
import { AppRoutingModule } from 'app/app-routing.module';
import { AppComponent } from 'app/app.component';
// components - shared
import { SideMenuComponent } from 'app/components/shared/side-menu/side-menu.component';
import { NavComponent } from 'app/components/shared/nav/nav.component';
import { FooterComponent } from 'app/components/shared/footer/footer.component';
import { ModalComponent } from 'app/components/shared/modal/modal.component';
import { AlertComponent } from 'app/components/shared/alert/alert.component';
// components - pages
import { LoginComponent } from 'app/components/auth/login/login.component';
import { PasswordResetComponent } from 'app/components/auth/password-reset/password-reset.component';
import { ProfileComponent } from 'app/components/auth/profile/profile.component';
import { DashboardComponent } from 'app/components/dashboard/dashboard.component';
import { RegisterComponent } from 'app/components/auth/register/register.component';
import { EditUserComponent } from 'app/components/users/edit-user/edit-user.component';
import { ListUserComponent } from 'app/components/users/list-user/list-user.component';
// interceptor
import { AuthInterceptor } from 'interceptors/auth.interceptor';

// third-party
import { AgGridModule } from 'ag-grid-angular';
// helper
import { TemplateRendererComponent } from 'helpers/template-renderer.component';

// templates

// directives
import { ICheckDirective } from 'directives/iCheck.directive';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PasswordResetComponent,
    DashboardComponent,
    SideMenuComponent,
    NavComponent,
    FooterComponent,
    ModalComponent,
    AlertComponent,
    RegisterComponent,
    ProfileComponent,
    EditUserComponent,
    ListUserComponent,
    // helper
    TemplateRendererComponent,
    // templates

    // directives
    ICheckDirective,
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
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent]
})
export class AppModule { }
