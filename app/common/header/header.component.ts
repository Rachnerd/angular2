import {Component, Input} from "angular2/core";
@Component({
    selector: 'my-header',
    templateUrl: './app/common/header/header.component.html',
    styleUrls: ['./app/common/header/header.component.css']
})
export class HeaderComponent {
    @Input() title:string;
    constructor() {

    }
}
