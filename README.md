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
At some point in this workshop Http gets implemented. In stead of using the Http from the Angular API, a customized Http class
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

### Assignment 2 RestService
###### Why this assignment?
Currently there's a PeopleService that contains rest functionality. The url /people is what makes
this Service very specific and not reusable. We're going to fix this by making a generic RestService that
can be configured through dependency injection (provide).

#### Copying functionality
We're going to let the PeopleService like it is.
```
Copy the methods of PeopleService into RestService.
```

#### Dependencies
###### String
Before we can implement the RestService correctly, we have to setup its
dependencies. The ideal situation would be a RestService that depends on
the Http service and an Url.
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

The injector complains because it has no string to pass to the url dependency of RestService.
The url string has to be provided.

```javscript
//providing a String dependency
provide(String, {useValue: ''})
```

```
Provide a String '/people' in PeopleListComponent's providers array.
```
Now the injector passes the '/people' string into the RestService, meaning that we've set a
property in a Service by using dependency injection.

You might have noticed that this solution is terrible. Now the injector
will provide '/people' for every string dependency provided in PeopleListComponent or its children.

###### OpaqueToken
_Creates a token that can be used in a DI Provider._

Instead of injecting a primitive string (which the injector would use for all string dependencies) 
an OpaqueToken is injected. This way the dependency is represented by a variable that can be
given a string value.

```javascript
export const REST_URL: OpaqueToken = new OpaqueToken('rest url');
//RestService
constructor(private http: Http, @Inject(REST_URL) urlToken: OpaqueToken) {}
```

The @Inject() decorator tells the injector which OpaqueToken (REST_URL) should be injected into this service.

Usually @Injectable() will suffice, but not in this case. @Injectable() resolves dependencies based on type and url's type is 
OpaqueToken. We want to reference the unique custom OpaqueToken -> REST_URL.

```
In PeopleListComponent, provide REST_URL instead of the String.
```

The rest service dependencies are set.

#### Implement
```
Change the dependency of PeopleListComponent from PeopleService to RestService (just the type).
```
```javascript
constructor(private peopleService: RestService)
```

The application still works because of the old implementation of the methods.

```
Create a private string called url. In the contructor initialize the url
with the Injected REST_URL.
```

```javascript
this.url = urlToken.toString();
```

```
Replace all hardecoded '/people' string with the url property.
```

The RestService dynamically retrieves Person from any given url. The RestService should also dynamically implement 
return types and parameter types.

#### Implementing dynamic types
###### Switching typing sides
```javascript
get():Observable<Array<Person>>{
    return this.http.get('/people')
        .map(res => res.json());
}
```
get() is returning an Observable with a person Array. The RestService could return 
any type of object depending on the provided url.
```
Change Array<Person> to Array<any>
```
This fixes the issue of return types for RestService but now we lost the strong types on the other side (source that calls RestService).
To fix this you have to type it on the other side.
```
In PeopleListComponent, add a type to the person that gets passed by the
success handler of the get observable.
```

```javascript
people => {}
//to
(people:Array<Person>) => {}
```

PeopleListComponent provides RestService an url so it also knows which
types it can expect from the server.

```
Rename the person parameter of create to 'params'.
Set the appropriate types.
```

update and delete have a thing in common, they only use the id property of an object.
```
Rename person -> params. Type = {id: numnber}
```
The type of params accepts only objects that have an id.

### Component lifecycle.
#### ViewChildren
PeopleListComponent renders some PersonComponents in its view making them its ViewChildren.
These ViewChildren can be retrieved in the PeopleListComponent class.

```
Add the following property to PeopleListComponent:
@ViewChildren(PersonComponent) personComponents: QueryList<PersonComponent>;
```

###### AfterViewInit:
The PeopleListComponent can access its ViewChildren after the view is initialized.
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

From now on every time the personComponents length changes, every PersonComponent will be logged.

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

### Component ng-content
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

### Directives
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
    host: { 'eventName' : 'fnName()'}
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

