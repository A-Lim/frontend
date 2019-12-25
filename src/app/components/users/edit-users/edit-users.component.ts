import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Observable } from 'rxjs';
import { User } from 'models/user.model';
import { App } from 'config';
import { UserService } from 'services/user.service';
import { BaseFormComponent } from 'app/components/shared/baseform.component';
import { AuthService } from 'services/auth.service';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss']
})
export class EditUsersComponent extends BaseFormComponent implements OnInit {
  public user: User;
  public userId: string;

  constructor(private titleService: Title, private formBuilder: FormBuilder,
              private userService: UserService, private authService: AuthService,
              private route: ActivatedRoute, private router: Router) {
    super();
    this.titleService.setTitle(`${App.NAME} | Edit Users`);
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.startLoading();

    // get id from route
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      // retrieve user details
      // will request data from server again whenever
      // there is a change in the id
      this.userService.getUser(this.userId)
        .subscribe(user => {
          this.user = user;
          this.populateForm();
          this.endLoading();
        });
    });
  }

  onSubmit() {
    super.onSubmit();
    if (!this.form.valid) {
      return;
    }

    const data = this.form.value;
    const authUser = this.authService.getUserData();

    this.startLoading();
    let observable: Observable<{ message: string, user: User }> = null;
    // if authenticate user is current user
    // call update profile
    if (authUser.id === this.user.id) {
      observable = this.authService.updateProfile(data);
    } else {
      observable = this.userService.updateUser(this.user.id, data);
    }

    observable.subscribe(_ => {
      this.endLoading();
      this.router.navigate(['admin/users']);
    }, _ => {
      this.endLoading();
    });
  }

  populateForm() {
    this.form.setValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email
    });
  }
}
