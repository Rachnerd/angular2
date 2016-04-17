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
    /**
     *  The PeopleService is not available anymore because it gets provided
     *  in PeopleListComponent, which is a child of AppComponent.
     *  This is why the content of the constructor is removed (in comments).
     */
    constructor() {//peopleService: PeopleService
        // peopleService.get().subscribe(
        //     people => console.log(people),
        //     error => console.log(error)
        // );
        // peopleService.create({firstName: 'Hello', lastName: 'World'}).subscribe(
        //     person => {
        //         person.firstName = '123';
        //
        //     },
        //     error => console.log(error)
        // );
        // peopleService.delete({id: 1, firstName: '123', lastName: '321'}).subscribe(
        //     () => {
        //         console.log('Updated');
        //         peopleService.get().subscribe(
        //             people => console.log(people),
        //             error => console.log(error)
        //         );
        //     },
        //     error => console.log(error)
        // )
        //
    }
}