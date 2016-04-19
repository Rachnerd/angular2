import {Component, Input, provide} from "angular2/core";
import {REST_URL, RestService} from "../rest/rest.service";
@Component({
    selector: 'my-header',
    templateUrl: './app/common/header/header.component.html',
    styleUrls: ['./app/common/header/header.component.css'],
    providers: [RestService] //provide(REST_URL, {useValue: '/foo'})
})
export class HeaderComponent {
    @Input() title:string;
    constructor(restService: RestService) {
        console.log(restService);
    }
}
