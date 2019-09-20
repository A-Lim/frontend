import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { User } from '../../../../models/user.model';
import { App } from '../../../../config';
import { AuthService } from '../../../../services/auth.service';
import ValidationUtil from '../../../../helpers/validation.util.js';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private authStatusSubscription: Subscription;
  public profileForm: FormGroup;
  public submitted = false;
  public isLoading = false;
  public user: User;

  constructor(private titleService: Title, private formBuilder: FormBuilder,
              public authService: AuthService) {
    this.profileForm = this.formBuilder.group({
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
  }

  ngOnInit() {
    this.titleService.setTitle(`${App.NAME} | Profile`);
    // this.user = this.authService.getUserData();
    // disable form fields until data is loaded
    this.disableFormControls();

    this.authService.getProfile();
    this.authStatusSubscription = this.authService.getAuthStatusListener()
      .subscribe(data => {
        this.user = data.user;
        this.isLoading = false;
        this.enableFormControls();
        this.populateForm();
      });
  }

  get f() { return this.profileForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;
    }

    const data = this.profileForm.value;
    if (data.oldPassword === '' || data.oldPassword === null) {
      delete data.oldPassword;
      delete data.newPassword;
      delete data.confirmPassword;
    }
    // set userId
    data.userId = this.user.id;

    this.isLoading = true;
    this.disableFormControls();
    this.authService.updateProfile(data);
  }

  populateForm() {
    this.profileForm.setValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }

  disableFormControls() {
    this.f.firstName.disable();
    this.f.lastName.disable();
    this.f.email.disable();
    this.f.oldPassword.disable();
    this.f.newPassword.disable();
    this.f.confirmPassword.disable();
  }

  enableFormControls() {
    this.f.firstName.enable();
    this.f.lastName.enable();
    this.f.email.enable();
    this.f.oldPassword.enable();
    this.f.newPassword.enable();
    this.f.confirmPassword.enable();
  }

  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }
}
