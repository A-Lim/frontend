import { Component, Inject } from '@angular/core';
// declare var $: any;

@Component({
  templateUrl: './error.component.html'
})
export class ErrorComponent {
  public message = 'An unknown error occurred.';

  // constructor(@Inject() public data: any) {}
}
