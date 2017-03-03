import { BaseModel, WEB_METHOD } from './base.model';
// import { WEBREQUEST } from '../constants';

export class RequestModel<T extends BaseModel | any>{
    // Url: string;
    // Method: WEB_METHOD;
    // Entity?: T;

    constructor(public Url: string,
        public Method: WEB_METHOD,
        public Entity?: T) { }
}