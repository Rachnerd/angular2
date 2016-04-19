import {Component} from "angular2/core";
import {PeopleListComponent} from "./people/people-list/people-list.component";
import {RouteConfig, RouterOutlet} from "angular2/router";

@Component({
    selector: 'my-app',
    template: '<router-outlet></router-outlet>',
    //directives contain dependencies for the template (components, directives)
    directives: [RouterOutlet],
    //providers contain the dependencies for the code (services)
    providers: []
})
@RouteConfig([
    {
        path:'/people', component: PeopleListComponent, name: 'People', useAsDefault:true
    }
])
export class AppComponent {
    constructor() {}
}