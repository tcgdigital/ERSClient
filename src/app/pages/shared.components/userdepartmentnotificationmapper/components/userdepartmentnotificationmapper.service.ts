import { Injectable, Inject } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { UserdepartmentNotificationMapperModel } from './userdepartmentnotificationmapper.model';
import {
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService
} from '../../../../shared';


@Injectable()
export class UserdepartmentNotificationMapperService {
    private _dataService: DataService<UserdepartmentNotificationMapperModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<UserdepartmentNotificationMapperModel>('NotifyDepartmentUsers', option);
    }

    public GetUserDepartmentNotificationMapperFromIncident(incidentId: number): Observable<ResponseModel<UserdepartmentNotificationMapperModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq ${incidentId}`)
            .Execute();
    }

}