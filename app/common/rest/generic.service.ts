import {Http, Response} from "angular2/http";
import {Inject} from "angular2/core";
import {Observable} from "rxjs/Observable";
export class GenericService<T> {

    constructor(@Inject(Http) private http: Http, private url:string) {}


    /**
     * Standard get request.
     * @returns {Observable<Array<any>>} Returns an observable that returns an array of objects received from the server.
     */
    get():Observable<Array<T>>{
        return this.http.get(this.url)
            .map(res => res.json());
    }
    create(params: {}):Observable<T> {
        return new Observable(observer => {
            this.http.post(this.url, JSON.stringify(params))
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
        return this.http.put(`${this.url}/${params.id}`, JSON.stringify(params));
    }
    delete (params: {id:number}):Observable<Response> {
        return this.http.delete(`${this.url}/${params.id}`);
    }
}