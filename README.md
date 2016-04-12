# Angular2Workshop
###Quintor
#####Rachèl Heimbach
This workshop introduces its participants to components, dependency injection and data-binding.
A great source to help out with the Angular syntax is this [cheat sheet](https://angular.io/cheatsheet).

If you would like to play with the ES6 features during this workshop, take a look at [ES6 feature list](http://es6-features.org/#Constants).

##Install
Clone repo and execute the following command:
- 'npm install'

##Run
The following command is given by the Angular getting started guide:
- 'gulp serve' or 'npm start'

## Content
### index.html
Index already contains some libraries that are needed for Angular 2.
![Screenshot index.html libs](http://puu.sh/ofL3G/079d2ed81c.png)

Here's a brief summary of what those libraries do.

#### Shims and polyfills
_"Provides compatibility shims so that legacy JavaScript engines behave as closely as possible to ECMAScript 6 (Harmony)."  - [ES6-shim](https://github.com/paulmillr/es6-shim)_

_Polyfills are meant to provide "future API functionality" to browsers that don't support certain features yet._
#### Rx.Js
_"...is a set of libraries to compose asynchronous and event-based programs using observable collections and Array#extras style composition in JavaScript"_

[ReactiveX Observable](http://reactivex.io/documentation/observable.html)
#### Angular 2
Core library.

[API](https://angular.io/docs/ts/latest/api/)  +  [Cheatsheet](https://angular.io/cheatsheet) <- Open both!!
#### Http
Angular's http API.

[HTTP API](https://angular.io/docs/ts/latest/api/#!?apiFilter=http)
#### testing
Angular's testing API (only used for the Http override)

### Backend
These classes act like a backend server. In main.ts Angular's Http gets overridden by a custom implementation that calls this backend instead of actual servers.
Because of this override the following requests are available for this workshop:
```
Request                     Response  
Method    Url               status    body              headers
GET       /people           200       Array<Person>
GET       /people/:id       200       Person
POST      /people           201                         location:string (location url of new person)
PUT       /people/:id       204
DELETE    /people/:id       204
```

## Assignments
### Assignment 1 Component
```javascript
@Component({
    ...
})
export class ExampleComponent {

}
```
![Webstorm component creation](https://blog.jetbrains.com/webstorm/files/2016/04/auto-import-ts.gif)
Currently main.ts is trying to construct the root of the component tree by bootstrapping a component.
```
Create a new file called 'app.component.ts' inside /app/. 
Create a component named AppComponent and export its class.
When inside of the Component decorator, hit ctrl+space for a look at
what properties are available. 
Give the AppComponent a selector 'myApp' which will be linked to the
<my-app>Loading...</my-app> tag inside index.html.
```

### Assignment 2 Configure Component
![Webstorm import autocompletion](https://blog.jetbrains.com/webstorm/files/2016/04/completion-for-imports.png)
```
Inside the app.component.ts file there's an import to the Angular 2 core.
Browse the Angular core by hitting ctrl+space as seen in the image above.

Set the template of AppComponent to some random text (template is available
inside the Component decorator).
```

## Assignment 3 PeopleService
#### Creating a service
The root of the component tree is setup. Now we're going to implement the first branch about people.
Inside the /app/people directory is a common folder that will be filled with shared classes among people.

```
Create a people.service.ts in the /app/people/common folder.
Let people.service.ts export a class called PeopleService (services are not
decorated like components are).
```

#### Injecting a plain service

```javascript
bootstrap(AppComponent, [dep1, dep2]);
```

To expose this service to the injector, we have to _provide_ it (later more on _provide_).

The Angular 1 approach would be to provide this service in the bootstrap 
function, this way it becomes available for the whole application.

In Angular 2 we can also choose to let only certain parts have access to certain dependencies.

```
For now, add PeopleService as a dependency inside the bootstrap function.
```

#### Adding a dependency to a service
```
class ExampleService {
    constructor(private ExampleDep: ExampleDep) {}//ExampleDep gets injected
}
```

Our people service doesn't do much at this point. We want to let it retrieve the people through Http requests.

```javascript
Inject Http into the PeopleService (Error occurs it's fine).
```

Now we run into a problem:
EXCEPTION: Cannot resolve all parameters for 'PeopleService'(?).
Make sure that all the parameters are decorated with Inject or have 
valid type annotations and that 'PeopleService' is decorated with 
Injectable.

Just now we were fine when PeopleService didn't have any dependencies. 
Now that we added one the injector is going to complain about the fact that it doesn't know how to resolve the dependencies.
We have to annotate our PeopleService so the injector knows that it has to inject dependencies based on types.

```
Annotate PeopleService with @Injectable().
Exceptions should be gone now.
```

#### Printing a service.
The PeopleService is currently bootstrapped (injected at the root) so we can use it inside our AppComponent.

```
Inject the PeopleService into the constructor of AppComponent and log the service.
In the console should be a PeopleService object that has Http as a property.
```

#### Adding methods to PeopleService
This PeopleService will contain CRUD functionality for People.

In Angular 2 Http requests return Observables (Rx.js) instead of Promises.
```
Create a get() method in the PeopleService. We know that the server 
will return an array of Person so let the return type of get() be an
Array of Person wrapped in an Observable:
Observable<Array<Person>>

Inside the method: 
return this.Http.get('people');
```
_Observable.subscribe() takes the same parameters as Promise.then(). Some of the differences between Observables and Promises are:
- Observables are lazy loaded (not activated until subscribed)
- Observables are cancelable (unsubscribe)_

#### Testing PeopleService
```javascript
service.get().subscribe(
    res => console.log('Response: ' + res),
    err => cosole.log(('Error: ' + err)
);
```

```
In AppComponent's constructor, subscribe to PeopleService's get method.
```

The body of the response contains an array of people but is still a JSON string.
This is a problem because we defined that PeopleServic's get() method will return 
an Observable<Array<Person>> and not an Observable<string>. To get plain JS instead of JSON
the Angular Response type has a json() method that returns JS.
```
res.json()
```

To prevent the need of calling this json method every time we have to apply an operation on the Observable.
The Rx.js library provides multiple operators for observables (kinda like streams). For this workshop only
map will be used.

```
//Unlock the 'map' operator for Observables by pasting this import in main.ts
import "rxjs/add/operator/map";

In PeopleService, call .map on the http get request.
return http.get().map(res => res.json())

```
Now AppComponent receives an array of people as promised.

## Assignment 4 PeopleListComponent
#### Creating PeopleListComponent
Now that the PeopleService is able to retrieve some people, a new component is needed.
```
Create a new folder called 'people-list' inside /people and fill it with:
people-list.html + people-list.ts

Create a component called PeopleListComponent and export it.
Configure the component so it is linked to its template and has a 
selector of 'people-list'.
```

#### Routing to PeopleListComponent
This people functionality should be separated from the rest of the application.
Before we can use routing we have to import its providers.
```
Import ROUTER_PROVIDERS and add it as an dependency to the bootstrap function.

The AppComponent will be the main route config.
Decorate the AppComponent with a RouteConfig.
path: '/people',
name: 'PeopleList',
component: PeopleListComponent

Just like in Angular 1 we need to define a viewport.
In Angular 2 it's called router-outlet and is a component itself.
Give the directives array of AppComponent (decorator) with so called
ROUTER_DIRECTIVES. Now we can use router-outlet.

Set the template of AppComponent to '<router-outlet></router-outlet>'.
```

If everything is setup correctly, we should be able to use the /people route.
Currently we're using the html5 mode routing. Imagine we want to use the Angular 1
hashtag routing style.

To override Angular or custom dependencies you'll have to implement the 
provide function.

```javascript
//Example service
export class Example {
    constructor(MyDep: MyDep) { 
        MyDep.doSomething();
    }
}
//Example override in bootstrap (main.ts) or providers (any component decorator).
@Component({
    /...
    providers: [Example, provide(MyDep, {
       useClass: OtherDep //<- OtherDep should have a doSomething method for this to work 
    })];
})
class Cmp {
    constructor(MyDep: MyDep) {
        MyDep; // <- actually OtherDep
    }
}
```

Now we are going to provide a HashLocationStrategy to our bootstrap.
This tells Angular to override the default routing behaviour.

```javascript
[..., ROUTER_PROVIDERS, provide(LocationStrategy, {
    useClass: HashLocationStrategy
})]
```

```
Configure Angular's router to use # for routing instead of html5.
Check if it works by going to /#/people (add some html to PeopleListComponent
if you haven't already.
```

#### Prioritising dependencies
A few assignments ago we've injected the PeopleService as a dependency to
the bootstrap function (available for the whole application). Now it seems
that we split functionality up by introducing the first people related
component.
```
Remove the PeopleService from the bootstrap function and inject it to the
providers array of the PeopleListComponent decorator (previous assignment
example).
```

#### Defining properties
The PeopleListComponents should have the following properties:
```
name            type                Visibility
people          Array<Person>       public 
PeopleService   PeopleService       private
```
Tip: constructor(private PeopleService: PeopleService) {}

There are 2 possible locations for executing the Get request to retrieve people.
The constructor that gets executed when the component is created.
ngOnInit that gets executed after the component is done initializing.

Since we are using TypeScript we have access to the (optional) feature
of implementing an interface. This forces our component to implement certain
methods and tells the developer what events are implemented.
```
Let PeopleListComponent implement OnInit.
Just like importing, alt+enter should help you our defining unimplemented
methods.

Retrieve the people through the PeopleService and set the people property
of PeopleListComponent. (don't use functions, use arrow functions!!)
```

Now we see safe types in action. Remember how the PeopleService get method
returns an array of Person wrapped in a observable? Inside PeopleListComponent
we subscribe to that observable and set it's response (which is Array<Person>)
to its people property (also Array<Person>).

Before setting PeopleListComponent's people property, auto completion 
already works on the value passed through by the observable. TypeScript
is aware of the observables value.

#### Data-binding
Now we've set our first real property of a component, let's use it inside
our template.

```
Implement Angular 2's equivalant to ng-repeat called *ngFor.
Render the names of the people.
```

We want to be able to add someone to this list. Instead of the usual
2-way bind (ng-model) we're going to create a local template variable (like #person in *ngFor).

```
Create an input field for firstName and give it the following attribute:
#firstName
Do the same for lastName.

```
Now we have 2 input fields that have a local template variable (meaning
the component can't access it). To pass it through the component we'll
need some sort of event.

```
Create an addPerson method that expects a firstName and lastName
(both parameters have the following type: HTMLInputElement).
Make this method log its parameters.

Create a button that fires a (click) that calls addPerson with
a firstName and lastName
```
As you may notice somehow we pass an actual HTML element to our component.
The #property doesn't read the value of the html tag, but represents the 
tag itself. This way you can use HTML elements without polluting your 
viewmodel ($scope in Angular 1 terms).

```
Let addPerson log the value of each parameter.
```

We've now implemented our first data bind, event handler and local variable.
These implementations work internally for the component. We haven't touched
its public API yet (inputs and outputs).

#### Creating a new Person
```
Add a create(person:Person) (post) method to the PeopleService. 
Let the PeopleListComponent call the create method with a first and last
name.

On success the server will respond with a location header that holds the
url of the newly created Person.

Implement a getById(id:number) (in PeopleService) which calls /people/:id
and make sure that the create method returns the new person.
```

Answer to POST assignment. Read through the method so you understand what's going on.
We create our own observable that will succeed after 2 calls.
```javascript
create(person:Person): Observable<Person> {
    return new Observable(observer => {
        this.Http.post('people', JSON.stringify(params)).subscribe(
            res => {
                let location = res.headers.get('location');
                this.Http.get(location).map(res => res.json()).subscribe(
                    person => observer.next(person),
                    err => observer.error(err)
                )
            },
            err => observer.error(err)
        )
    });
}
```

## Assignment PersonComponent
#### Creating PersonComponent
We're going to create a Person component that contains a Person.
This component can update the values of the person.

```
Create a new folder called person (in /people).
Fill it with a person.component.ts and html (with some text).

Inject the PersonComponent into the PeopleListComponent (inside the directives array).
Now the person selector is available in the PeopleListComponent template.

Render a person in the PeopleListComponent to see if it works.
```
#### Input
```javascript
class Example {
    @Input() varIn: Type;
}
```
The PersonComponent expects a person of type Person to be given by the parent.
```
Configure the PersonComponent so it expects a person of type Person.

Implement OnInit and log the person property inside ngOnInit() {}
```

Now we're going to test the Input() property by passing a value to the person attribute.

```
Inside the PeopleListComponent's template, pass the first person retrieved from the 'backend'.
<person person="person[0]"></person>

The PersonComponent should now print: 'person[0]'.
```

This bind didn't work as expected. We expected to be a person and not a literal string.
We have to tell Angular what type of binding is used by using different syntax in html.

```
Replace <person person="person[0]"></person>
with    <person [person]="person[0]"></person>

Check your log. It should now print the actual JS object.
```

#### Output
```javascript
class Example {
    @Output() myEvent:EventEmitter = new EventEmitter();
    
    someFn():void {
        let exampleParam = {test:'value'};
        this.myEvent.emit(exampleParam);
    }
}
```
We don't want our PersonComponent to update the person on the backend,
we just want to emit an event with the new values.
```
Let PersonComponent Output() an update event.

Go to the PeopleListComponent and create an updatePerson method that prints 
1 parameter called person. Add this method to the update event of PersonComponent.
<person [person]="person[0]" (update)="updatePerson($event)"></person>
```

$event stands for the parameter we choose to emit inside PersonComponent.
In a bit we're going to implement the actual update.
```
Create a button inside the PersonComponent template that calls a confirmUpdate
method on click. Emit the update event in the PersonComponent confirmUpdate
with its person as a parameter.
```
When clicking the button, PeopleListComponent's updatePerson function
should print a person.

Now we have a PersonComponent with a public api:
In (properties): person of type Person.
Out (events): update event that emits a person.

#### Updating a person in PersonComponent
Here follow some assignments that require previously explained techniques.
```
Implement the update (PUT) method of PeopleService.
PUT only returns a status. So if there are no errors everything 
worked out.
```

## Bonus
```
Implement a button in PeopleListComponent that deletes a person from the 
server.
```

```
Implement some more directives of the Angular 2 core.
CHEATSHEET
```
