import {Component, EventEmitter, Directive,} from 'angular2/core';


class Greeter {
    greet(name:string) {
        return 'Hello ' + name + '!';
    }
}

@Directive({
    selector: 'needs-greeter'
})
class NeedsGreeter {
    greeter:Greeter;
    constructor(greeter:Greeter) {
        this.greeter = greeter;
    }
}
@Component({
    selector: 'greet',
    viewProviders: [
        Greeter
    ],
    template: `<needs-greeter></needs-greeter>`,
    directives: [NeedsGreeter]
})
class HelloWorld {
}

@Component({
    selector: 'my-app',
    templateUrl: './app/app.component.html',
    directives: []
})
export class AppComponent {
    constructor() {
    }
}