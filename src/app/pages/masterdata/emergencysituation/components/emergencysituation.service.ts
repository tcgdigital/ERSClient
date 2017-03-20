import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { EmergencySituationModel } from './emergencysituation.model';
import {
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService
} from '../../../../shared';

@Injectable()
export class EmergencySituationService {
    private _dataService: DataService<EmergencySituationModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<EmergencySituationModel>('EmergencySituations', option);
    }

    GetAll(): Observable<ResponseModel<EmergencySituationModel>> {
        return this._dataService.Query()
            .Filter("ActiveFlag eq 'Active'")
            .OrderBy("CreatedOn desc")
            .Execute();
    }
    GetAllActiveEmergencySituations(): Observable<ResponseModel<EmergencySituationModel>> {
        return this._dataService.Query()
            .Select('EmergencySituationId', 'EmergencySituationName', 'ActiveFlag', 'CreatedBy', 'CreatedOn')
            .Filter("ActiveFlag eq 'Active'")
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    CreateEmergencySituation(emergencySituationModel: EmergencySituationModel): Observable<EmergencySituationModel> {
        let emergencySituation: EmergencySituationModel;
        return this._dataService.Post(emergencySituationModel)
            .Execute()
            .map((data: EmergencySituationModel) => {
                emergencySituation = data;
                if (emergencySituation.ActiveFlag == 'Active') {
                    emergencySituation.Active = true;
                }
                else {
                    emergencySituation.Active = false;
                }
                return data;
            });
    }

    EditEmergencySituation(emergencySituationModel: EmergencySituationModel): Observable<EmergencySituationModel> {
        let key: string = emergencySituationModel.EmergencySituationId.toString()
        return this._dataService.Patch(emergencySituationModel, key)
            .Execute();

    }

    GetEmergencySituationById(id: number): Observable<EmergencySituationModel> {
        return this._dataService.Get(id.toString())
            .Execute();
    }
}