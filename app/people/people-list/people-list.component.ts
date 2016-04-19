import {Component} from "angular2/core";
import {PeopleService} from "../common/people.service";
import {Person} from "../common/person.model";
import {PersonComponent} from "../person/person.component";
import {PEOPLE_CONFIG} from "../common/config";
import {HeaderComponent} from "../../common/header/header.component";

@Component({
    selector: 'people-list',
    templateUrl: `${PEOPLE_CONFIG.FOLDER}/people-list/people-list.component.html`,
    styleUrls: [`${PEOPLE_CONFIG.FOLDER}/people-list/people-list.component.css`],
    directives: [PersonComponent, HeaderComponent],
    providers: [PeopleService]
})
export class PeopleListComponent {

    public people:Array<Person> = [];//Initialize Person array.
    public errorMessage:string;

    constructor(private peopleService: PeopleService) {
        peopleService.get()
            .subscribe(
                people => {
                    this.people = people;
                },
                error => console.log(error)
            );
    }
    addPerson(firstNameInput :HTMLInputElement, lastNameInput:HTMLInputElement):void {
        let firstName = firstNameInput.value;
        let lastName = lastNameInput.value;

        this.peopleService.create({firstName, lastName}).subscribe(
            person => {
                this.people.push(person);
                firstNameInput.value = '';
                lastNameInput.value = '';
                this.errorMessage = '';
            },
            error => this.errorMessage = `${error.status} ${error.statusText}`
        )
    }
    onDelete(person: Person, index: number) : void {
        console.log('PeopleListComponent: ', person.firstName, 'has been deleted!');
        this.people.splice(index, 1);
    }
    onUpdate(person: Person, index: number) : void {
        console.log('PeopleListComponent: ', person.firstName, 'has been updated!');
    }
}

