import {OpaqueToken, Injectable, Inject} from "angular2/core";
import {Response, Http} from "angular2/http";
import {Observable} from "rxjs/Observable";

/**
 * This token will serve as a string dependency with a name. If it would be a primitive string then
 * we couldn't differentiate 2 string dependencies.
 * provide(String, { useValue: '' }) <- Which string for what dependency??
 * provide(PATH, { useValue: '' }) <- An OpaqueToken dependency of RestService that gets a string assigned.
 * @type {OpaqueToken}
 */
export const REST_URL: OpaqueToken = new OpaqueToken('rest url');
/**
 * Rest service that contains CRUD functionality.
 * Expects Json from the backend.
 */
@Injectable()
export class RestService {
    public path:string;

    /**
     * Constructor.
     * @param http The available rest service.
     * @param pathToken Token that contains the base url for requests (string has to be provided somewhere).
     */
    constructor(private http: Http, @Inject(REST_URL) pathToken: OpaqueToken) {
        this.path = pathToken.toString();
    }

    /**
     * Standard get request.
     * @returns {Observable<Array<any>>} Returns an observable that returns an array of objects received from the server.
     */
    get():Observable<Array<any>>{
        return this.http.get(this.path)
            .map(res => res.json());
    }
    create(params: any):Observable<any> {
        return new Observable(observer => {
            this.http.post(this.path, JSON.stringify(params))
                .subscribe(
                    res => {
                        let location = res.headers.get('location');
                        this.http.get(location)
                            .map(res => res.json())
                            .subscribe(
                                person => observer.next(person),
                                error => observer.error(error)
                            )
                    },
                    error => observer.error(error)
                );
        });
    }
    update(params: {id:number}):Observable<Response> {
        return this.http.put(`${this.path}/${params.id}`, JSON.stringify(params));
    }
    delete (params: {id:number}):Observable<Response> {
        return this.http.delete(`${this.path}/${params.id}`);
    }
}