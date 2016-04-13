/**
 * Interfaces that specifies the properties of a person.
 */
interface IPerson {
    firstName:string;
    lastName:string;
    id:number;
}
/**
 * Person class that implements IPerson.
 */
class Person implements IPerson{
    firstName:string;
    lastName:string;
    id:number;
    points:number;
    constructor(properties: IPerson) {
        this.firstName = properties.firstName;
        this.lastName = properties.lastName;
        this.id = properties.id;
        this.points = 0;
    }
}
/**
 *  Database class.
 */
export class Database {
    /**
     * The actual database containing tables. "All" contains the content. Each table can have a custom create and update
     * implementation.
     * @type {{people: {all: Person[], create: (function(IPerson): Person), update: (function(number, IPerson): *|null)}}}
     */
    private static database = {
        people: {
            all: [
                new Person({firstName: 'Jan', lastName: 'Berg', id: 1}),
                new Person({firstName: 'Karel', lastName: 'de Vries', id: 2})
            ],
            create: (data:IPerson) => {
                var firstName = data.firstName,
                    lastName = data.lastName,
                    people = Database.database.people.all;
                if(!!firstName && !!lastName) {
                    var id = (!!people[people.length - 1]) ? people[people.length - 1].id + 1 : 1,
                        person = new Person({firstName, lastName, id});
                    people.push(person);
                    return person;
                }
            },
            update: (id:number, data:IPerson) => {
                var firstName = data.firstName,
                    lastName = data.lastName,
                    person = Database.getById('people', id);
                if(!!person && (!!firstName || !!lastName)) {
                    person.firstName = firstName || person.firstName;
                    person.lastName = lastName || person.lastName;
                    return person;
                }
            }
        }
    };

    /**
     * Returns all based on the database name.
     * @param db Database name.
     * @returns {any|Array}
     */
    static getAll(db): any {
        return this.database[db].all || [];
    }
    /**
     * Returns a value based on the database name and the value's id.
     * @param db Database name.
     * @param id The id.
     * @returns {any|Array}
     */
    static getById(db, id) {
        for(let i = 0; i < this.database[db].all.length; i++) {
            if(this.database[db].all[i].id == id) {
                return this.database[db].all[i];
            }
        }
        return null;
    }

    /**
     * Create a new value in the database.
     * @param db Database name.
     * @param data  Data for creation.
     * @returns {any}
     */
    static create(db:string, data:any) {
        return this.database[db].create(data);
    }
    /**
     * Update an existing value in the database.
     * @param db Database name.
     * @param id The id of target value.
     * @param data Data for creation.
     * @returns {any}
     */
    static update(db:string, id:number, data:any) {
        return this.database[db].update(id, data);
    }
    /**
     * Delete an existing value in the database.
     * @param db Database name.
     * @param id The id of target value.
     * @returns {any}
     */
    static delete(db:string, id:number) {
        for(let i = 0; i < this.database[db].all.length;i ++) {
            if(this.database[db].all[i].id == id) {
                this.database[db].all.splice(i, 1);
                return `db: Deleted id ${id}`
            }
        }
    }
}
