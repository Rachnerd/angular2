import {Directive, ElementRef, Input} from "angular2/core";
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
    private _el:HTMLElement;
    constructor(el: ElementRef) {
        this._el = el.nativeElement;
    }
    onMouseEnter() {
        this._el.style.backgroundColor = this.color || 'black';
    }
    onMouseOut() {
        this._el.style.backgroundColor = '';
    }
}