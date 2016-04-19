import {Directive, ElementRef, Input, EventEmitter, Output} from "angular2/core";
import {RestService} from "../common/rest/rest.service";
@Directive({
    selector: '[hooverColor]',
    host: {
        '(mouseenter)' : 'onMouseEnter()',
        '(mouseout)' : 'onMouseOut()',
    }
})
export class HooverColorDirective {
    @Input() color:string;
    @Output() test: EventEmitter<string> = new EventEmitter();
    private _el:HTMLElement;
    constructor(el: ElementRef, restService: RestService) {
        this._el = el.nativeElement;
        console.log(restService);
    }
    onMouseEnter() {
        this._el.style.backgroundColor = this.color || 'black';
        this.test.emit('Yoo');
    }
    onMouseOut() {
        this._el.style.backgroundColor = '';
    }
}