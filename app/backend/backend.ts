import {Headers} from "angular2/http";
import {ResponseOptions} from "angular2/http";
import {ResponseType} from "angular2/http";
import {Response} from "angular2/http";
import {Database} from "./database";
import {IRoute} from "./backend-routing";

/**
 * Class that retrieves data from the database and executes other "queries".
 */
export class Backend {

    /**
     * Executes GET requests on the Database.
     * @param {IRoute} route containing an url and name.
     * @param {number} id Optional id to perform GET by id.
     * @returns {*|null} Data from database | Data containing error, status and statusText.
     */
    static get(route: IRoute, id?:number): any {
        var data = (!!id) ? Database.getById(route.name, id) : Database.getAll(route.name);
        if(!data) data = { error: `Db ${route.name}, ${(!!id) ? ' id ' + id : ''} not found`, status: 404, statusText: 'Not found'};
        return data;
    }
    /**
     * Executes POST requests on the Database.
     * @param {IRoute} route containing an url and name.
     * @param {*} data The data received from client.
     * @returns {*|null} Newly created data from database | Data containing error, status and statusText.
     */
    static post(route: IRoute, data:any): any {
        var newData = Database.create(route.name, data);
        if((!newData)) return { error: `Db ${route.name} wrong parameters`, status: 400, statusText: 'Bad Request'};
        return {status: 201, statusText: 'Created', headers: [{name: 'location', value: `${route.url}/${newData.id}`}]};
    }
    /**
     * Executes PUT requests on the Database.
     * @param {IRoute} route containing an url and name.
     * @param {number} id The id of the target to update.
     * @param {*} data The data received from client.
     * @returns {*|null} Data from database | Data containing error, status and statusText.
     */
    static put(route:IRoute, id:number, data:any): any {
        var newData = Database.update(route.name, id, data);
        if((!newData)) return { error: `Db ${route.name} non-existing id or wrong parameters`, status: 400, statusText: `Bad Request`};
        return {status: 204, statusText: 'No content'}
    }

    static delete(route:IRoute, id:number): any {
        var deletedData = Database.delete(route.name, id);
        if((!deletedData)) return { error: `Db ${route.name} non-existing id`, status: 400, statusText: `Bad Request`};
        return {status: 204, statusText: 'No content'};
    }

    /**
     * Creates a response out of the processed data.
     * @param {string} url The requested url.
     * @param {*} data The data that contains the response data or error data.
     * @returns {Response}
     */
    static createResponse(url:string, data:any): Response {
        let options = this.getBaseResponseOptions(url);
        let body = (!!data.error) ? JSON.stringify(data.error) : JSON.stringify(data);
        let response = new Response(options.merge({
            status: (!!data.status) ? data.status : 200,
            statusText: (!!data.statusText) ? data.statusText : 'Ok',
            body: (data.status == 201) ? '' : body
        }));
        if(!!data.headers) {
            for(var i = 0; i < data.headers.length; i++) {
                let header = data.headers[i];
                response.headers.set(header.name, header.value);
            }
        }
        return response;
    }

    /**
     * Create some response options containing a json header and url.
     * @param {string} url Request url.
     * @returns {ResponseOptions}
     */
    private static getBaseResponseOptions(url:string): ResponseOptions {
        var headers = new Headers;
        headers.append('Content-Type', 'application/json');
        return new ResponseOptions({
            url: url,
            headers: headers,
            type: ResponseType.Default
        });
    }

}