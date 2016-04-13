import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import {Inject} from "angular2/core";
import {Observable} from "rxjs/Observable";
import {BackendRouting} from "./backend-routing";

/**
 * Custom Http class that extends Angular's Http so it can be used as if it's the original one.
 * This class sends all requests to the fake backend, backend_routing.
 * The handling of requests is almost identical as in the original Http.
 */
export class MyHttp extends Http{
    /**
     * Ignore the MockBackend. Its implementation doesn't fit the goal of this service and is only here for the sake of
     * getting it to work.
     * @param backend
     * @param options
     */
    constructor(@Inject('MockBackend') backend, @Inject('BaseRequestOptions') options) {
        super(backend, options);
    }
    get(url:string) {
        return this.respondASync(BackendRouting.get(url));
    }
    post(url:string, body:string) {
        return this.respondASync(BackendRouting.post(url, body));
    }
    put(url:string, body:string) {
        return this.respondASync(BackendRouting.put(url, body));
    }
    delete(url:string) {
        return this.respondASync(BackendRouting.delete(url));
    }
    private respondASync(response) {
        return  new Observable(observer => {
            var random = Math.random() * 100;
            setTimeout(() => {
                if(response.status === 200 || response.status === 201 || response.status === 204) {
                    observer.next(response);
                    observer.complete();
                }else {
                    observer.error(response);
                }
            }, random);
        });
    }
}