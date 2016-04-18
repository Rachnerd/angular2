export interface LocalPerson {
    firstName:string;
    lastName:string;
}

export interface Person extends LocalPerson{
    id: number;
    points:number;
}
