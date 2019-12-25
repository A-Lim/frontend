import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { App } from 'config';
import { AuthService } from 'services/auth.service';
import { BaseFormComponent } from 'app/components/shared/baseform.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseFormComponent implements OnInit, OnDestroy {

  constructor(private renderer: Renderer2, private titleService: Title,
              private formBuilder: FormBuilder, public authService: AuthService) {
    super();
    this.renderer.removeClass(document.body, 'skin-purple');
    this.renderer.removeClass(document.body, 'sidebar-mini');
    this.renderer.addClass(document.body, 'login-page');

    // initialize form with validations
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.titleService.setTitle(`${App.NAME} | Login`);
  }

  onSubmit() {
    super.onSubmit();
    if (!this.form.valid) {
      return;
    }

    this.startLoading();
    this.authService.login(this.form.value.email, this.form.value.password)
      .subscribe(_ => {
        this.endLoading();
      }, _ => {
        this.endLoading();
      });
  }

  ngOnDestroy() {
    this.renderer.addClass(document.body, 'skin-purple');
    this.renderer.addClass(document.body, 'sidebar-mini');
  }
}
