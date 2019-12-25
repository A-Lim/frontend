import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { App } from 'config';
import { UserGroup } from 'models/usergroup.model';
import { UserGroupService } from 'services/usergroup.service';
import { BaseFormComponent } from 'app/components/shared/baseform.component';

@Component({
  selector: 'app-edit-usergroups',
  templateUrl: './edit-usergroups.component.html',
  styleUrls: ['./edit-usergroups.component.scss']
})
export class EditUsergroupsComponent extends BaseFormComponent implements OnInit {
  public userGroup: UserGroup;
  public userGroupId: string;

  constructor(private titleService: Title, private formBuilder: FormBuilder,
              private route: ActivatedRoute, private userGroupService: UserGroupService) {
    super();
    this.titleService.setTitle(`${App.NAME} | Edit User Groups`);
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      code: [{ value: null, disabled: true }, []],
    });
  }

  ngOnInit() {
    this.startLoading();

    // get id from route
    this.route.paramMap.subscribe(params => {
      this.userGroupId = params.get('id');
      // retrieve user details
      // will request data from server again whenever
      // there is a change in the id
      this.userGroupService.getUserGroup(this.userGroupId)
        .subscribe(userGroup => {
          this.userGroup = userGroup;
          this.populateForm();
          this.endLoading();
        },
        _ => {
          this.endLoading();
        });
    });
  }

  populateForm() {
    this.form.setValue({
      name: this.userGroup.name,
      code: this.userGroup.code
    });
  }

}
