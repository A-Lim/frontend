import { Component, OnInit, OnDestroy, Renderer2  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../../services/auth.service';
import { App } from '../../../../config'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private authStatusSubscription: Subscription;
  public loginForm:FormGroup;
  public submitted = false;
  public errors:string[];

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  constructor(private renderer: Renderer2, private titleService: Title, private meta: Meta,
    private formBuilder: FormBuilder, public authService: AuthService) {
      this.renderer.removeClass(document.body, 'skin-purple');
      this.renderer.removeClass(document.body, 'sidebar-mini');
      this.renderer.addClass(document.body, 'login-page');

      // initialize form with validations
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      })
    }

    ngOnInit() {
      this.titleService.setTitle(`${App.NAME} | Login`);
      this.authStatusSubscription = this.authService.getAuthStatusListener()
        .subscribe(isAuthenticated => {

        });
    }

    onSubmit() {
      this.submitted = true;
      if (this.loginForm.invalid)
        return;

      this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
    }

    ngOnDestroy() {
      this.renderer.addClass(document.body, 'skin-purple');
      this.renderer.addClass(document.body, 'sidebar-mini');
      this.authStatusSubscription.unsubscribe();
    }
  }
