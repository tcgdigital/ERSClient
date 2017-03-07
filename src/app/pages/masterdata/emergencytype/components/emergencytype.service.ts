import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { EmergencyTypeModel } from './emergencytype.model';
import { ResponseModel } from '../../../../shared/models';
import {
    DataService,
    DataServiceFactory,
    DataProcessingService,
    IServiceInretface
} from '../../../../shared/services';

@Injectable()
export class EmergencyTypeService implements IServiceInretface<EmergencyTypeModel> {
    private _dataService: DataService<EmergencyTypeModel>;
    private _emergencyTypes: ResponseModel<EmergencyTypeModel>;
    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<EmergencyTypeModel>('EmergencyTypes', option);
    }

    GetAll(): Observable<ResponseModel<EmergencyTypeModel>> {
        return this._dataService.Query()
            .Execute()
            .map((emergencyTypes: ResponseModel<EmergencyTypeModel>) => {
                this._emergencyTypes = emergencyTypes;
                
                this._emergencyTypes.Records.forEach(element => {
                    if (element.ActiveFlag == 'Active') {
                        element.Active = true;
                    }
                    else {
                        element.Active = false;
                    }
                });
                return emergencyTypes;
            });
    }

    Get(id: string | number): Observable<EmergencyTypeModel> {
        return this._dataService.Get(id.toString()).Execute();
    }

    Create(entity: EmergencyTypeModel): Observable<EmergencyTypeModel> {
        return this._dataService.Post(entity).Execute();
    }

    CreateBulk(entities: EmergencyTypeModel[]): Observable<EmergencyTypeModel[]> {
        return Observable.of(entities);
    }

    Update(entity: EmergencyTypeModel): Observable<EmergencyTypeModel> {
        let key: string = entity.EmergencyTypeId.toString();
        return this._dataService.Patch(entity, key).Execute();
    }

    Delete(entity: EmergencyTypeModel): void {
    }
}