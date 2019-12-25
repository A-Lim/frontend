import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
// import { Subscription } from 'rxjs';

import { AuthService } from 'services/auth.service';
import { App } from 'config';
import ValidationUtil from 'helpers/validation.util.js';
import { BaseFormComponent } from 'app/components/shared/baseform.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseFormComponent implements OnInit, OnDestroy {

  constructor(private renderer: Renderer2, private titleService: Title, private meta: Meta,
              private formBuilder: FormBuilder, public authService: AuthService) {
    super();
    this.renderer.removeClass(document.body, 'skin-purple');
    this.renderer.removeClass(document.body, 'sidebar-mini');
    this.renderer.addClass(document.body, 'login-page');

    // initialize form with validations
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', []]
    }, {
      validator: ValidationUtil.matchValue('password', 'confirmPassword')
    });
  }

  ngOnInit() {
    this.titleService.setTitle(`${App.NAME} | Register`);
  }

  onSubmit() {
    super.onSubmit();

    const email = this.form.value.email;
    const password = this.form.value.password;
    const cpassword = this.form.value.confirmPassword;

    this.startLoading();
    this.authService.register(email, password, cpassword)
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
