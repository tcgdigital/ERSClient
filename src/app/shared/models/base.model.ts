
export abstract class BaseModel {
    public ActiveFlag: string;
    public CreatedBy: number;
    public CreatedOn: Date;
    public UpdatedBy?: number;
    public UpdatedOn?: Date;

    constructor() {
        this.ActiveFlag = 'Active';
        this.CreatedBy = 1;
        this.CreatedOn = new Date();
    }
}

export enum WEB_METHOD {
    GET = <any>'GET',
    POST = <any>'POST',
    SIMPLEPOST = <any>'SIMPLEPOST',
    PUT = <any>'PUT',
    PATCH = <any>'PATCH',
    DELETE = <any>'DELETE',
    BATCHPOST = <any>'BATCHPOST'
}

export class KeyValue {
    constructor(public Key: string, public Value: number) { }
}

export class NameValue<T>{
    constructor(public Name: string, public Value: T) { }
}

export class IncidentStatus {
    static Open: number = 1;
    static Close: number = 0;
}

export class Severity {
    static High: number = 1;
    static Medium: number = 2;
    static Low: number = 3;
}

export class InvolvedPartyType {
    static Flight: number = 1;
    static NonFlight: number = 2
}

export class FileData {
    file: File;
    field: string;
}