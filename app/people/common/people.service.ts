import {Injectable} from "angular2/core";
import {Http, Response} from "angular2/http";
import {Observable} from "rxjs/Observable";
import {Person, LocalPerson} from "./person.model";

/**
 *  PeopleService
 *  @Injectable() tells the Angular Injector that dependencies have to provided based on type.
 *  The type of its only dependency is Http, which is provided in CUSTOM_HTTP_PROVIDERS (main.ts)
 */
@Injectable()
export class PeopleService {
    /**
     * Constructor of PeopleService. Injection takes place here.
     * (private rest: Http) {} is syntax sugar for:
     *
     * private rest;
     * constructor(rest: Http) {
     *     this.rest = rest;
     * }
     *
     * @param http  Http service.
     */
    constructor(private http: Http) {}

    /**
     * Get request that maps the response from json to js.
     * @returns {Observable<Person>} Observable that returns a Person to its subscribe success handler.
     */
    get():Observable<Array<Person>>{
        return this.http.get('/people')
            .map(res => res.json());
    }
    /**
     * Custom Observable that calls its subscribers after either 1 or 2 Http requests (depending on the location header in the response).
     * @returns {Observable<Person>} Observable that returns a Response or Person to its subscribe success handler.
     */
    create(person: LocalPerson):Observable<Person> {
        return new Observable(observer => {//Custom observable
            this.http.post('/people', JSON.stringify(person))//Post new person to server.
                .subscribe(//subscribe to this post.
                    res => {//if this post succeeds.
                        let location = res.headers.get('location');//Retrieve new location (sent by backend)
                        this.http.get(location)//Get new person from its location
                            .map(res => res.json())//Map the person from Json to JavaScript.
                            .subscribe(//Subscribe to this get request
                                person => observer.next(person),//if this get succeeds, call all subscribers (of Custom observable).
                                error => observer.error(error)//if this get fails, call all subscribers's error handler.
                            )
                    },
                    error => observer.error(error)//if this post fails, call all subscribers's error handler.
                );
        });
    }

    /**
     * Put request that updates a Person.
     * @param person Updated Person
     * @returns {Observable<Response>} Expected Response status 204 'No content'.
     */
    update(person:Person):Observable<Response> {
        return this.http.put(`/people/${person.id}`, JSON.stringify(person));
    }
    /**
     * Delete request that deletes a Person.
     * @param person Person to be deleted.
     * @returns {Observable<Response>} Expected Response status 204 'No content'.
     */
    delete (person:Person):Observable<Response> {
        return this.http.delete(`/people/${person.id}`);
    }
}