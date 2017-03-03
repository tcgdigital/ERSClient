import { BaseModel } from './base.model';

export class Response<T extends any>{
    public Records: any[];
    public Count: number;
}

export class ResponseModel<T extends BaseModel>{
    public Records: T[];
    public StatusCodes: string[];
    public Count: number;
}