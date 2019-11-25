import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { AuthService } from 'services/auth.service';
import { App } from 'config';
import ValidationUtil from 'helpers/validation.util.js';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private authStatusSubscription: Subscription;
  public registerForm: FormGroup;
  public submitted = false;
  public errors: string[];
  public isLoading = false;

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  constructor(private renderer: Renderer2, private titleService: Title, private meta: Meta,
              private formBuilder: FormBuilder, public authService: AuthService) {

    this.renderer.removeClass(document.body, 'skin-purple');
    this.renderer.removeClass(document.body, 'sidebar-mini');
    this.renderer.addClass(document.body, 'login-page');

    // initialize form with validations
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', []]
    }, {
      validator: ValidationUtil.matchValue('password', 'confirmPassword')
    });
  }

  ngOnInit() {
    this.titleService.setTitle(`${App.NAME} | Register`);
    this.authStatusSubscription = this.authService.getAuthStatusListener()
      .subscribe(_ => {
        this.isLoading = false;
        this.registerForm.enable();
      });
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    const cpassword = this.registerForm.value.confirmPassword;

    this.isLoading = true;
    this.registerForm.disable();
    this.authService.register(email, password, cpassword);
  }

  ngOnDestroy() {
    this.renderer.addClass(document.body, 'skin-purple');
    this.renderer.addClass(document.body, 'sidebar-mini');
    this.authStatusSubscription.unsubscribe();
  }
}
