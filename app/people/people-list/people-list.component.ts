import {
    Component, ViewChildren, QueryList, AfterViewInit, Query, ElementRef, provide, Directive,
    Pipe, PipeTransform
} from "angular2/core";
import {PeopleService} from "../common/people.service";
import {Person} from "../common/person.model";
import {PersonComponent} from "../person/person.component";
import {PEOPLE_CONFIG} from "../common/config";
import {RestService, REST_URL} from "../../common/rest/rest.service";
import {HeaderComponent} from "../../common/header/header.component";
import {HooverColorDirective} from "../../directives/hoover.directive";

@Pipe({name: 'exponentialStrength'})
export class ExponentialStrengthPipe implements PipeTransform {
    transform(value:number, [exponent]) : number {
        var exp = parseFloat(exponent);
        return Math.pow(value, isNaN(exp) ? 1 : exp);
    }
}
//
// @Directive({
//     selector: '[test]',
//     host: {
//         '(mouseenter)' : 'onMouseEnter()',
//         '(mouseleave)' : 'onMouseLeave()'
//     }
// })
// class TestDir {
//     private _el:HTMLElement;
//     constructor(el: ElementRef, private restService: RestService) {
//         this._el = el.nativeElement;
//         console.log(restService.path);
//     }
//     onMouseEnter() {
//         this._el.style.backgroundColor = 'black';
//     }
//     onMouseLeave() {
//         this._el.style.backgroundColor = '';
//     }
// }

@Component({
    selector: 'people-list',
    templateUrl: `${PEOPLE_CONFIG.FOLDER}/people-list/people-list.component.html`,
    styleUrls: [`${PEOPLE_CONFIG.FOLDER}/people-list/people-list.component.css`],
    directives: [PersonComponent, HeaderComponent, HooverColorDirective],
    providers: [PeopleService, RestService, provide(REST_URL, { useValue: '/people'})],
    pipes:[ExponentialStrengthPipe]
})
export class PeopleListComponent implements AfterViewInit{

    public people:Array<Person> = [];//Initialize Person array.
    public errorMessage:string;
    @ViewChildren(PersonComponent) personComponents: QueryList<PersonComponent>;

    constructor(private restService: RestService) {
        // peopleService.get()
        //     .subscribe(
        //         people => {
        //             this.people = people;
        //         },
        //         error => console.log(error)
        //     );
        this.restService.get()
            .subscribe(
                (people:Array<Person>) => this.people = people,
                error => console.log(error)
            );
    }
    addPerson(firstNameInput :HTMLInputElement, lastNameInput:HTMLInputElement):void {
        let firstName = firstNameInput.value;
        let lastName = lastNameInput.value;

        // this.peopleService.create({firstName, lastName}).subscribe(
        //     person => {
        //         this.people.push(person);
        //         firstNameInput.value = '';
        //         lastNameInput.value = '';
        //         this.errorMessage = '';
        //     },
        //     error => this.errorMessage = `${error.status} ${error.statusText}`
        // )
        this.restService.create({firstName, lastName})
            .subscribe(
                (person:Person) => {
                    this.people.push(person);
                    firstNameInput.value = '';
                    lastNameInput.value = '';
                    this.errorMessage = '';
                },
                error => this.errorMessage = `${error.status} ${error.statusText}`
            );
    }

    /**
     * Assignment
     */
    ngAfterViewInit():void {
        console.log(this.personComponents);
        this.personComponents.changes
            .subscribe((personCmps:QueryList<PersonComponent>) => {
                personCmps.forEach((cmp: PersonComponent) => {
                    console.log(cmp.person);
                })
            })
    }
    onDelete(person: Person, index: number) : void {
        console.log('PeopleListComponent: ', person.firstName, 'has been deleted!');
        this.people.splice(index, 1);
    }
    onUpdate(person: Person, index: number) : void {
        console.log('PeopleListComponent: ', person.firstName, 'has been updated!');
    }
}

