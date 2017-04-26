import { Injectable, Inject } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { NotificationModel } from './notification.model';
import {
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService
} from '../../../../shared';


@Injectable()
export class NotificationService {
    private _dataService: DataService<NotificationModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<NotificationModel>('Notifications', option);
    }

   
}