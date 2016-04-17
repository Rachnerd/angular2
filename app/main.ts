/// <reference path="../node_modules/angular2/typings/browser.d.ts" />
import {bootstrap} from 'angular2/platform/browser';
import {AppComponent} from "./app.component";
import {CUSTOM_HTTP_PROVIDERS} from "./backend/index";
import "rxjs/add/operator/map";
import {ROUTER_PROVIDERS, HashLocationStrategy, LocationStrategy} from "angular2/router";
import {provide} from "angular2/core";

/**
 * HTML5 mode routes, like '/people', need server support (they should direct all routes to the frontend app).
 * Without this support, refreshing the page will return a 404 because it doesn't reach frontend app.
 *
 * We don't have a proper server so instead we fall back on Angular 1's hash routing, like '/#/people'.
 * This way we have a single page application.
 *
 * This override replaces the default LocationStrategy with Angular's HashLocationStrategy
 *
 * If you understand this syntax, open backend/index.ts and take a look at how the Http override is configured.
 */
const CUSTOM_ROUTER_PROVIDERS = [
    ROUTER_PROVIDERS,
    provide(LocationStrategy, { useClass: HashLocationStrategy })
];

bootstrap(AppComponent, [CUSTOM_HTTP_PROVIDERS, CUSTOM_ROUTER_PROVIDERS]);
