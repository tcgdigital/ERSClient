import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { IAffectedObjectsService } from './IAffectedObjectsService';
import { InvolvePartyModel, AffectedModel } from '../../../shared.components';
import { AffectedObjectModel, AffectedObjectsToView } from './affected.objects.model';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService,
    ServiceBase, UtilityService
} from '../../../../shared';

@Injectable()
export class AffectedObjectsService extends ServiceBase<InvolvePartyModel> implements IAffectedObjectsService {
    // private _dataService: DataService<InvolvePartyModel>;
    private _bulkDataService: DataService<AffectedObjectModel>;
    private _dataServiceForCargo : DataService<AffectedObjectModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'InvolvedParties');

        let option: DataProcessingService = new DataProcessingService();
        this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptions<AffectedObjectModel>('AffectedObjectBatch', option);
       this._dataServiceForCargo = this.dataServiceFactory.CreateServiceWithOptions<AffectedObjectModel>('AffectedObjects',option);
        
    }

    GetAll(): Observable<ResponseModel<InvolvePartyModel>> {
        return this._dataService.Query()
            .Expand('Affecteds($expand=AffectedObjects($expand=Cargo))').Execute();
    }

    GetFilterByIncidentId(incidentId): Observable<ResponseModel<InvolvePartyModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq ${incidentId}`)
            .Expand('Affecteds($expand=AffectedObjects($expand=Cargo))')
            .Execute();
    }

    FlattenAffactedObjects(involvedParty: InvolvePartyModel): AffectedObjectsToView[] {
        let affectedObjectsToView: AffectedObjectsToView[] = [];
        let affectedObjects: AffectedObjectModel[];
        let affected: AffectedModel;
        if (involvedParty != null) {
            affected = UtilityService.pluck(involvedParty, ['Affecteds'])[0][0];
            if (affected != null) {
                affectedObjects = UtilityService.pluck(affected, ['AffectedObjects'])[0];
                affectedObjectsToView = affectedObjects.map(function (data) {
                    let item = new AffectedObjectsToView();
                    item.AffectedId = data.AffectedId;
                    item.AffectedObjectId = data.AffectedObjectId;
                    item.TicketNumber = data.TicketNumber;
                    item.CargoId = data.Cargo.CargoId;
                    item.AWB = data.AWB;
                    item.POL = data.Cargo.POL;
                    item.POU = data.Cargo.POU;
                    item.mftpcs = data.Cargo.mftpcs;
                    item.mftwgt = data.Cargo.mftwgt;
                    item.IsVerified = data.IsVerified;
                    item.Details = data.Cargo.Details;
                    // item.CommunicationLogs: data.CommunicationLogs
                    return item;
                });

            }
        }
        return affectedObjectsToView;
    }

    CreateBulkObjects(entities: AffectedObjectModel[]): Observable<AffectedObjectModel[]> {
        return this._bulkDataService.BulkPost(entities).Execute();
    }

    MapAffectedPeopleToSave(affectedObjectsForVerification): AffectedObjectModel[] {
        let verifiedAffectedObjects: AffectedObjectModel[] =[];
        verifiedAffectedObjects = affectedObjectsForVerification.map(function (affected) {
            let item = new AffectedObjectModel;
            item.AffectedObjectId = affected.AffectedObjectId;
            item.IsVerified = affected.IsVerified;
            item.UpdatedBy = 1;
            item.UpdatedOn = new Date();
            item.ActiveFlag = 'Active';
            item.CreatedBy = 1;
            item.CreatedOn = new Date();
            return item;
        });
        return verifiedAffectedObjects;
    }

     public GetCommunicationByAWB(id: number): Observable<ResponseModel<AffectedObjectModel>> {
        return this._dataServiceForCargo.Query()
            .Filter(`AffectedObjectId eq ${id}`)
            .Expand('Cargo,CommunicationLogs')
            .Execute();
    }
}
