import {Component, Input, Output, OnInit, EventEmitter, Host, forwardRef, Inject} from "angular2/core";
import {Person, LocalPerson} from "../common/person.model";
import {PEOPLE_CONFIG} from "../common/config";
import {PeopleService} from "../common/people.service";
import {PeopleListComponent} from "../people-list/people-list.component";
import {RestService} from "../../common/rest/rest.service";


@Component({
    selector: 'person',
    templateUrl: `${PEOPLE_CONFIG.FOLDER}/person/person.component.html`,
    styleUrls: [`${PEOPLE_CONFIG.FOLDER}/person/person.component.css`],
    providers: [PeopleService]
})
export class PersonComponent implements OnInit{

    @Input() person: Person;
    @Output() update: EventEmitter<Person> = new EventEmitter();
    @Output() delete: EventEmitter<Person> = new EventEmitter();

    backup: LocalPerson = { firstName: '', lastName: '' };
    editMode:boolean = false;

    constructor(private peopleService: RestService, @Inject(forwardRef(() => PeopleListComponent)) private peopleListCmp: PeopleListComponent) {
        console.log(this.peopleListCmp.people);}

    cancel():void {
        (<any>Object).assign(this.person, this.backup);
        this.editMode = false;
    }

    deletePerson():void {
        this.peopleService.delete(this.person)
            .subscribe(
                res => this.delete.emit(this.person),
                err => console.log(err)
            )
    }

    edit():void {
        this.editMode = true;

    }
    hasChanged():boolean {
        return this.person.firstName != this.backup.firstName || this.person.lastName != this.backup.lastName;
    }
    /**
     * When the view is done initializing, the input properties are loaded.
     * Object.assign takes a target and a source and copies the properties.
     * this.backup = this.person would be referencing to the same object.
     */
    ngOnInit():void {
        (<any>Object).assign(this.backup, this.person);
        //console.log(this.backup == this.person);//-> false
    }

    save():void {
        if(this.hasChanged()) {
            this.peopleService.update(this.person)
                .subscribe(
                    res => {
                        (<any>Object).assign(this.backup, this.person);
                        this.editMode = false;
                        this.update.emit(this.person);
                    },
                    err => console.log(err)
                )
        }else {
            this.editMode = false;
        }
    }
}