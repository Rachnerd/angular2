# Angular2Workshop
###Quintor
#####Rachèl Heimbach
This workshop introduces its participants to components, dependency injection and data-binding.

A great source to help out with the Angular syntax is this [cheat sheet](https://angular.io/cheatsheet).

Here you can find one of the first Angular 2 style guides (draft) [style guide](https://github.com/johnpapa/angular-styleguide/blob/master/a2/README.md)

##Install
Clone repo and execute the following command:
- 'npm install'

##Run
The following command is given by the Angular getting started guide:
- 'gulp serve' or 'npm start'

## Dependencies
![Screenshot index.html libs](http://puu.sh/ofL3G/079d2ed81c.png)

#### Shims and polyfills
_"Provides compatibility shims so that legacy JavaScript engines behave as closely as possible to ECMAScript 6 (Harmony)."  - [ES6-shim](https://github.com/paulmillr/es6-shim)_

_Polyfills are meant to provide "future API functionality" to browsers that don't support certain features yet._
#### Rx.Js
_"...is a set of libraries to compose asynchronous and event-based programs using observable collections and Array#extras style composition in JavaScript"_

[ReactiveX Observable](http://reactivex.io/documentation/observable.html)
## Angular 2
Core library.

[API](https://angular.io/docs/ts/latest/api/)  +  [Cheatsheet](https://angular.io/cheatsheet) <- Open both!!

## Backend
In stead of using the Http from the Angular API, a customized Http class
is used that is configured to call a static (fake) backend. The following requests will be available in this workshop:
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
### Assignment 1 Base code.
###### PeopleService
During the previous workshop a PeopleService was created.
```
Take a look at the PeopleService of this branch and read the documentation so
you'll understand exactly what is happening.
```

###### PeopleListComponent
```
Take a look at the PeopleListComponent and read the comments.
```

###### PersonComponent
```
Take a look at the PersonComponent and read the comments.
```

### Assignment 2 Configurable services
###### Introduction
Currently there's a PeopleService that contains rest functionality. The hardcoded url '/people' together with the types of the methods
make this service not reusable. In this assignment we're going to explore 2 ways of making a reusable Rest service:

- RestService: Configurable with provide().
- GenericRestService: Class that uses generics to dynamically return types.

#### RestService
The RestService assignment focuses on Angular's injector. You will have 
to provide dependencies to make the RestService work.

##### Preparing RestService
```
Copy the methods of PeopleService into /common/rest/rest.service.ts.

Create a property in RestService called url of type string. Replace all
hardcoded '/people' strings with this property.

Replace all Person return types with any types.

The update and delete parameters types should be {id: number}.
```

We now have a service that doesn't have an url yet. 

##### Dependency injection
To set the url of the RestService we are going to provide a string to
the injector, but first we have to create the url dependency for RestService.
```
Inject besides Http a string called url.
```

```javascript
constructor(private http:Http, private url:string)
```

```
Add RestService to the providers: [] of PeopleListComponent and look at
the red errors of death in the console.
```
Just like any other dependency so far, the url string dependency has to be provided
somewhere to the injector.

```javscript
//providing a String dependency
provide(String, {useValue: ''})
```

```
Provide a String '/people' in PeopleListComponent's providers array.

Inject it into PeopleListComponent and call get.
```

Now the injector passes the '/people' string into the RestService, meaning that we've set a
property in a Service by using dependency injection.

You might have noticed that this solution is terrible. The injector
will provide '/people' for every string dependency provided in PeopleListComponent or its children.

###### OpaqueToken
_Creates a token that can be used in a DI Provider._

To prevent providing a normal type like string, an OpaqueToken can be provided instead.
OpaqueTokens are unique which means that dependencies of type OpaqueToken can still
be distinguished by the injector, unlike strings.

```
Create an exported const names REST_URL like the example below.
```

```javascript
export const REST_URL: OpaqueToken = new OpaqueToken('rest url');
```

```
Add an urlToken dependency of type OpaqueToken to the RestService.
Tell the injector that it has to be the REST_URL by using Inject().
```

```
//RestService
constructor(private http: Http, @Inject(REST_URL) urlToken: OpaqueToken) {
    this.url = urlToken.toString();
}
```

The @Inject(REST_URL) decorator tells the injector which OpaqueToken needs to be injected into this service.

Usually @Injectable() will suffice, but not in this case. @Injectable() resolves dependencies based on type and url's type is 
OpaqueToken. We want to reference the unique custom OpaqueToken -> REST_URL so we use Inject to specify.

```
In PeopleListComponent, provide REST_URL instead of the String.
Everything should be working.
```

This RestService can be provided in multiple parts of the application with different rest urls.

#### Generics
_Thanks to Wouter Oet_

Instead of injecting strings, we're going to create a better solution using generic types.

```
Copy RestService's content to the GenericRestService (don't copy the OpaqueToken).
```
Unlike RestService, the GenericService does not have to be used in the code directly.
We can create different services that extend this GenericService, but first we
have to make GenericRestService ready for proper inheritance.

```
Add the generic type T to the GenericRestService class.
```

```javascript
class Service<T> {}
```

This T is important because it will serve as all method types later on.

```
Refactor all Person return types to T.
```

We've specified that GenericService returns objects from the server of type T.
Type T will be determined by the service that will inherit the GenericRestService.

###### Inheritance

GenericRestService will serve like a superclass so we are never going to use it by itself.
This means that the string can be provided the normal way (without injection).

```
Use the Inject() decorator to inject Http into the service.
Add an url string parameter to the constructor.
```

```
constructor(@Inject(Dep) private dep : Dep, foo:string) {}
```

Now the GenericRestService is ready to be extended.

```
Empty PeopleService (except for its constructor) and let it extend 
GenericService with type Person.
```

```javascript
class Child extends Parent<Type> {}
```

When extending a parent with constructor parameters, it is necessary to
call super with those parameters.

```
Let PeopleService call super with http and '/people'.
```

```javascript
class Parent {
    constructor(dep: Dep, foo: number) {}
}
class Child extends Parent {
    constructor(dep: Dep) {
        super(dep, 1);
    }
}
```

Now PeopleService inherits the Rest functionality of the GenericService
with correct return types.

```
Log PeopleService and check the console.
```
###### Provide useFactory.
It is still possible to use GenericRestService in the injector by using useFactory.

```
Provide GenericRestService and implements useFactory.
Take a look in backend/index at how Http gets provided using useFactory.
The only dependency it has to pass on is Http, the url can be filled in 
hardcoded. Don't forget to assign type Person to the new service.
```

```javascript
provide(Service, {
    useFactory: (dep) => {
        return new Service<Type>(dep, 'some value');
    }, deps: [Http]
});
```

When injecting this provided service into a class, you have to specify the Type 
in the constructor parameter declaration as well.

### Assignment 3 Component lifecycle.
#### ViewChildren
PeopleListComponent renders some PersonComponents in its view making them its ViewChildren.
These ViewChildren can be retrieved in the PeopleListComponent class.

```
Add the following property to PeopleListComponent:
@ViewChildren(PersonComponent) personComponents: QueryList<PersonComponent>;
```

This tells the PeopleListComponent to keep track of its children of type PersonComponent.

###### AfterViewInit:
The PeopleListComponent can access the QUeryList after the view initialized.
```javascript
export class PeopleListComponent implements AfterViewInit{ 
    //...
    ngAfterViewInit():void {
        //Here
    }
}
```

When accessed in ngAfterViewInit, the content of the QueryList will be empty.
PeopleListComponent asynchronously calls the server which returns the list of people.
This means that when the ngAfterViewInit gets called, the server response isn't in yet.

```
Implement AfterViewInit to access the personComps property and log it.
```

In the console should appear a QueryList with 0 _results.
If you open the details of the object it magically contains results because it got filled after the server response arrived.
To act upon this change of results QueryLists have a changes observable.

```
Subscribe to this.personComponents.changes with success parameter: (personCmps:QueryList<PersonComponent>) =>
Call forEach on personCmps and console log each one of them.
```

From now on, every time the personComponents length changes every available PersonComponent will be logged.

#### Accessing a parent
Imagine PersonComponent somehow has to directly access PeopleListComponent, which is not a good idea.

To realize this a forward reference is needed.
_forwardRef: Allows to refer to references which are not yet defined._
```javascript
constructor(@Inject(forwardRef(() => Dep)) private dep: Dep)
```

```
In PersonComponent inject PeopleListComponent by using a forward referenced inject.
Print PeopleListComponent's people.
```

#### Component ng-content
The behaviour of ng-content is similar to transclusion in Angular 1.
```
In common/header/header.component.html place <ng-content></ng-content> in the first block.
Go to PeopleListComponent's template and place some text inside the <my-header> tag.
Refresh the page.
```

The content of <my-header> gets copied inside the template of the header.
This way we're able to mix templates.

```
Replace the content of <my-header> with a button saying 'left'.
```

This button is rendered by the header component but accessible by header's parent, PeopleListComponent.

```
Create a method called onLeftClick() inside PeopleListComponent and assign
it to the button. Let it log something on click.
```

The right corner of the header also contains a suitable block for another button.
Since ng-content renders all given html, we need to configure it.

```
In the header template add another <ng-content></ng-content> to the last block.
Add the select attribuut to both ng-contents and assign them '.left' and '.right'.
```

```javascript
<ng-content select=".className"></ng-content>
```
_The select attribute is a css selector, so it goes way beyond class names._

Now all content disappeared because we only handle elements with class names 'left' and 'right'.

```
Wrap the button in PersonListComponent template in a div with class name 'left'.
Do the same for a new button called right.
```

Now you should have a header with 2 buttons that are placed there by the PeopleListComponent (parent).
Behaviour is added to the Header without the Header itself being aware of it (so no need to pass anything).

#### Directives
For this assignment a basic Html altering directive will be created.

```
Create a new folder called directives and create a hoover-color.directive.ts
Export a class called HooverColorDirective and decorate it with @Directive.
Set the selector of the @Directive to '[hooverColor]'.
```
Now we've created an Angular 2 directive. To use this directive it has to be imported and provided in the directives array of a component.
Then this directive gets called as soon as hooverColor is added to a Html tag. 

Now the directives doesn't do anything. The HooverColor directive should change the color of its element when hoovered over.

```javascript
@Directive({
    //...
    host: { '(eventName)' : 'fnName()'}
})
class Example {
    fnName() {
        //do something
    }
}
```
```
Add the host attribute to the Directive's config and implement mouseenter 
and mouseout (log something).
```
Two events are handled but the directive doesn't have access to the actual element yet.
To retrieve the element it is attached to, it has to be injected.
```javascript
private _el:HTMLElement;
constructor(el: ElementRef) {
    this._el = el.nativeElement;
}
```

```
Configure the directive so it changes the color of the HTMLElement
by setting its style.backgroundColor on mouseenter and resets it on mouseout.
```

Just like components, directives have in and outputs. This means that besides
Html manipulation and native event handling, directives can also receive input
and output custom events. (all defined in the parent HTMLElement of the directive).

```
Create an Input string that can determine the color.
Test it out by setting the attribute in html
```

```javascript
this._el.style.backgroundColor = this.color || 'black';
```

### Dependency injection example scenario
This assignment is purely to illustrate how nested components deal with
dependency injection, it has no practical use.

```
Create a TestService and give it a dependency of type string.
```

This works because we've provided the RestService in the PeopleListComponent
which is the owner of the template HeaderComponent is in.

```
Provide RestService in HeaderComponent and provide a different url ('/foo').
```

Now we have 2 instances of RestService.
PeopleListComponent -> '/people'
HeaderComponent -> '/foo'

In this case PeopleListComponent is the top level injector and HeaderComponent
is the first child injector. Since HeaderComponent is inside of PeopleListComponent's
view, it is a direct child and not a indirect child. Let's see how an implementation
of an indirect child looks like.

```
Add the hooverColor attribute to the left button inside the header 
(in PeopleListComponent).
```

The hooverColor directive currently is the direct child of the PeopleListComponent
(because it exists inside that template) but and indirect child of HeaderComponent
(because it gets nested inside the HeaderComponent HTMLElement and put in ng-content).

```
Inject the RestService into the hooverColor directive and log it (make sure 
the only hooverColor directive is declared inside the Header HTMLElement)
Don't provide the service inside the HooverColorDirective!
```

You should see a RestService in the console with url: '/foo'. HooverColorDirective
injects RestService so it will search its parents for a provided RestService.
HeaderComponent is the nearest parent for HooverColorComponent.

The relations between the components and directive are as follows:

PeopleListComponent children (direct):
- HeaderComponent
- HooverColorDirective

HeaderComponent child (indirect):
- HooverColorDirective

Imagine that we want HeaderComponent to have a different implementation of
RestService without overriding PeopleListComponent's RestService. This is possible
by providing the RestService in the viewProviders of HeaderComponent.

```
Change the providers array of HeaderComponent to viewProviders and
check the log for the output of HooverColorDirective.
```

You should now see a RestService that contains a '/people' url.

PeopleListComponent ('/people') -> HeaderComponent ('/foo') -> HooverColorDirective ('/people').

HooverColorDirective injects a RestService. It's not provided so it'll check its parent HeaderComponent.
HeaderComponent only provides the RestService to its own view. HooverColorDirective now has to
check the next parent which is PeopleListComponent. PeopleListComponent provides the RestService the
normal way so HooverColorDirective can use that dependency.

!!Mind that this works the same with nested components, this example happens to use a directive.
