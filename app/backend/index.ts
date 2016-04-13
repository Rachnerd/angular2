import {MockBackend} from "angular2/src/http/backends/mock_backend";
import {BaseRequestOptions, Http} from "angular2/http";
import {MyHttp} from "./my-http";
import {provide} from "angular2/core";

export const CUSTOM_HTTP_PROVIDERS = [
    MockBackend,
    BaseRequestOptions,
    provide(Http, {
            useFactory: (backend, options) => {
                return new MyHttp(backend, options);
            },
            deps: [MockBackend, BaseRequestOptions]
        }
    )
];