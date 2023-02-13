import { Directive, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[ngInit]',
})
export class NgInitDirective {

  @Input() exist!: boolean;

  @Output('ngInit') initEvent: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    if (this.exist) {
      setTimeout(() => this.initEvent.emit(), 10);
    }
  }
}
