import { FormGroup, Validators } from '@angular/forms';

export default class ValidationUtil {
  // check if first field matches the second field
  static matchValue(firstControlName: string, secondControlName: string): any {
    return (formGroup: FormGroup) => {
      const firstControl = formGroup.controls[firstControlName];
      const secondControl = formGroup.controls[secondControlName];

      // return null if controls haven't initialised yet
      if (!firstControl || !secondControl || !firstControl.value) {
        return null;
      }

      if (secondControl.errors && !secondControl.errors.matchValue) {
        return null;
      }

      if (firstControl.value !== secondControl.value) {
        secondControl.setErrors({ matchValue: true });
      } else {
        secondControl.setErrors(null);
      }
    };
  }

  // validate second field as required if firstfield is not null
  static requiredIf(firstControlName: string, secondControlName: string): any {
    return (formGroup: FormGroup) => {
      const firstControl = formGroup.controls[firstControlName];
      const secondControl = formGroup.controls[secondControlName];

      if (secondControl.errors && !secondControl.errors.requiredIf) {
        return null;
      }

      if (firstControl.value && !secondControl.value) {
        secondControl.setErrors({ requiredIf: true });
      } else {
        secondControl.setErrors(null);
      }
    };
  }
}
