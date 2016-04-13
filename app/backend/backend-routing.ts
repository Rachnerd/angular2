import {Backend} from "./backend";
import {Response} from "angular2/http";

export interface IRoute {
    url:string,
    name: string;
}
/**
 *  Class that simulates the backend routing.
 *  Succeeding routes will be passed through to the Backend Class.
 */
export class BackendRouting {
    /**
     *  Available routes, url that is called and name of the database (tabel).
     */
    static routes: [IRoute] = [
        {
            url: 'people',
            name: 'people'
        }
    ];

    /**
     * GET requests (including get by id).
     * @param url
     * @returns {Response}
     */
    static get(url:string):Response {
        for(let i = 0; i < this.routes.length; i++) {
            var mainEndRegExp = `^/?${this.routes[i].url}/?$`,
                byIdRegExp    = `^/?${this.routes[i].url}/([0-9]+)$`;
            if(new RegExp(mainEndRegExp).test(url)) {
                //GET
                return Backend.createResponse(url, Backend.get(this.routes[i]));
            }else
            if(new RegExp(byIdRegExp).test(url)) {
                var id = parseInt(url.match(new RegExp(byIdRegExp))[1]);
                //GET by id
                return Backend.createResponse(url, Backend.get(this.routes[i], id));
            }

        }
        return Backend.createResponse(url, { error: `GET Route ${url} doesn't exist`, status: 404, statusText: 'Not found'});
    }
    /**
     * POST requests.
     * @param url
     * @returns {Response}
     */
    static post(url:string, body:string):Response {
        for(let i = 0; i < this.routes.length; i++) {
            var mainUrlRegExp = `^/?${this.routes[i].url}/?$`;
            if(new RegExp(mainUrlRegExp).test(url)) {
                var data = JSON.parse(body);
                return Backend.createResponse(url, Backend.post(this.routes[i], data));
            }
        }
        return Backend.createResponse(url, { error: `POST Route ${url} doesn't exist`, status: 404, statusText: 'Not found'});
    }
    /**
     * PUT requests.
     * @param url
     * @returns {Response}
     */
    static put(url:string, body:string):Response {
        for(let i = 0; i < this.routes.length; i++) {
            var byIdRegExp    = `^/?${this.routes[i].url}/([0-9]+)$`;
            if(new RegExp(byIdRegExp).test(url)) {
                var id = parseInt(url.match(new RegExp(byIdRegExp))[1]),
                    data = JSON.parse(body);
                return Backend.createResponse(url, Backend.put(this.routes[i], id, data));
            }
        }
        return Backend.createResponse(url, { error: `PUT Route ${url} doesn't exist`, status: 404, statusText: 'Not found'});
    }
    /**
     * DELETE requests.
     * @param url
     * @returns {Response}
     */
    static delete(url:string):Response {
        for(let i = 0; i < this.routes.length; i++) {
            var byIdRegExp = `^/?${this.routes[i].url}/([0-9]+)$`;
            if(new RegExp(byIdRegExp).test(url)) {
                var id = parseInt(url.match(new RegExp(byIdRegExp))[1]);
                return Backend.createResponse(url, Backend.delete(this.routes[i], id));
            }
        }
        return Backend.createResponse(url, { error: `DELETE Route ${url} doesn't exist`, status: 404, statusText: 'Not found'});
    }
}