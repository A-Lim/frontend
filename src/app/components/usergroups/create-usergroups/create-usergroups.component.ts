import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationExtras } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { App } from 'config';
import { BaseFormComponent } from 'app/components/shared/baseform.component';
import { UserGroupService } from 'services/usergroup.service';
import { Alert, AlertType } from 'models/alert.model';

@Component({
  selector: 'app-create-usergroups',
  templateUrl: './create-usergroups.component.html',
  styleUrls: ['./create-usergroups.component.scss']
})
export class CreateUsergroupsComponent extends BaseFormComponent implements OnInit {

  constructor(private titleService: Title, private formBuilder: FormBuilder,
              private router: Router, private userGrouService: UserGroupService) {
    super();
    this.titleService.setTitle(`${App.NAME} | Create User Groups`);
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
    });
  }

  ngOnInit() {

  }

  onSubmit() {
    super.onSubmit();

    if (!this.form.valid) {
      return;
    }

    this.startLoading();
    this.userGrouService.createUserGroup(this.form.value)
      .subscribe(response => {
        const alert: Alert = { type: AlertType.success, message: response.message };
        const navigationExtras: NavigationExtras = { state: { data: alert } };
        this.endLoading();
        this.router.navigate(['admin/usergroups'], navigationExtras);
      }, _ => {
        this.endLoading();
      });
  }

}
