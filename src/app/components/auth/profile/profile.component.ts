import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { User, UserStatus } from 'models/user.model';
import { App } from 'config';
import { AuthService } from 'services/auth.service';
import ValidationUtil from 'helpers/validation.util.js';
import { BaseFormComponent } from 'app/components/shared/baseform.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseFormComponent implements OnInit, OnDestroy {
  private authStatusSubscription: Subscription;
  public user: User;
  // to allow usage of enum in html
  public UserStatus = UserStatus;

  constructor(private titleService: Title, private formBuilder: FormBuilder,
              public authService: AuthService) {
    super();
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      oldPassword: ['', [Validators.minLength(6)]],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['', []]
    }, {
      validator: [
        ValidationUtil.matchValue('newPassword', 'confirmPassword'),
        ValidationUtil.requiredIf('oldPassword', 'newPassword')
      ]
    });

    this.authStatusSubscription = this.authService.getAuthStatusListener()
      .subscribe(_ => { });
  }

  ngOnInit() {
    this.titleService.setTitle(`${App.NAME} | Profile`);
    this.startLoading();

    this.authService.getProfile()
      .subscribe(user => {
        this.user = user;
        this.populateForm();
        this.endLoading();
      }, _ => {
        this.endLoading();
      });
  }

  onSubmit() {
    super.onSubmit();
    if (!this.form.valid) {
      return;
    }

    const data = this.form.value;
    if (data.oldPassword === '' || data.oldPassword === null) {
      delete data.oldPassword;
      delete data.newPassword;
      delete data.confirmPassword;
    }
    // set userId
    data.userId = this.user.id;

    this.startLoading();
    this.authService.updateProfile(data)
      .subscribe(_ => {
        this.endLoading();
      }, _ => {
        this.endLoading();
      });
  }

  populateForm() {
    this.form.setValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }

  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }
}
