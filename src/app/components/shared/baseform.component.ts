import { FormGroup } from '@angular/forms';
import { IBaseFormInterface } from 'app/components/shared/ibaseform.interface';
import { BaseComponent } from './base.component';

export abstract class BaseFormComponent implements IBaseFormInterface {
  public form: FormGroup;
  public submitted = false;
  public isLoading = false;
  private fieldsState = [];

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
  }

  startLoading() {
    this.isLoading = true;
    this.saveState();
    this.form.disable();
  }

  endLoading() {
    this.isLoading = false;
    // restore fields back to original state
    // temporary workaround cause form.enable() will reset all field state and set it to enable
    this.fieldsState.forEach(field => {
      if (!field.disabled) {
        this.form.get(field.key).enable();
      }
    });
  }

  // save current state of fields in form
  private saveState() {
    this.fieldsState = [];
    Object.keys(this.form.controls).forEach(key => {
      this.fieldsState.push({ key, disabled: this.form.get(key).disabled });
    });
  }
}
