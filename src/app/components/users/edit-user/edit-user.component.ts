import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { User } from 'src/models/user.model';
import { App } from 'src/config';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  // private authStatusSubscription: Subscription;

  public userForm: FormGroup;
  public submitted = false;
  public isLoading = false;
  public user: User;
  public userId: string;

  constructor(private titleService: Title, private formBuilder: FormBuilder,
              private userService: UserService, private route: ActivatedRoute) {
    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.titleService.setTitle(`${App.NAME} | User`);
    // disable form fields until data is loaded
    this.disableFormControls();

    // get id from route
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      // retrieve user details
      // will request data from server again whenever
      // there is a change in the id
      this.userService.getUser(this.userId)
        .subscribe(user => {
          this.user = user;
          this.enableFormControls();
          this.populateForm();
        },
        error => {
          // display error
          console.log(error);
        });
    });
  }

  get f() { return this.userForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }

    const data = this.userForm.value;
    // set userId
    data.userId = this.user.id;

    // this.isLoading = true;
    // this.disableFormControls();
    // this.authService.updateProfile(data);
  }

  populateForm() {
    this.userForm.setValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email
    });
  }

  disableFormControls() {
    this.f.firstName.disable();
    this.f.lastName.disable();
    this.f.email.disable();
  }

  enableFormControls() {
    this.f.firstName.enable();
    this.f.lastName.enable();
    this.f.email.enable();
  }
}
