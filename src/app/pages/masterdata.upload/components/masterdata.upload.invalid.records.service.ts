import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {
    ResponseModel, DataService, DataServiceFactory,
    DataProcessingService
} from '../../../shared';

import { IncidentModel } from '../../incident'
import { InvalidCrewModel, InvalidCargoModel, InvalidPassengerModel } from '../../shared.components';

/**
 * Service Classfor fetching invalid uploaded records
 * @export
 * @class MasterDataUploadForInvalidService
 */
@Injectable()
export class MasterDataUploadForInvalidService {
   
    private _dataServiceInvalidPassenger: DataService<IncidentModel>;
    private _dataServiceInvalidCargo: DataService<IncidentModel>;
    private _dataServiceInvalidCrew: DataService<IncidentModel>;

    /**
     * Creates an instance of MasterDataUploadForInvalidService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf MasterDataUploadForInvalidService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();   

        this._dataServiceInvalidPassenger = this.dataServiceFactory
            .CreateServiceWithOptions<IncidentModel>('Incidents', option);

        this._dataServiceInvalidCargo = this.dataServiceFactory
            .CreateServiceWithOptions<IncidentModel>('Incidents', option);

        this._dataServiceInvalidCrew = this.dataServiceFactory
            .CreateServiceWithOptions<IncidentModel>('Incidents', option);
    }

    /**
     * Get All Invalid Passengers By Incident
     * 
     * @param {number} incidentId 
     * @returns {Observable<ResponseModel<IncidentModel>>} 
     * 
     * @memberOf MasterDataUploadForInvalidService
     */
    GetAllInvalidPassengersByIncident(incidentId: number): Observable<InvalidPassengerModel[]>{
        return this._dataServiceInvalidPassenger.Query()
        .Expand(`InvolvedParties($expand=Flights($expand=InvalidPassengerRecords))`)
        .Filter(`IncidentId eq ${incidentId}`)
        .Execute()
        .map(a=>a.Records.map(b=>b.InvolvedParties).reduce((a,b)=>a.concat(b)))
        .map(a=>a.map(b=>b.Flights).reduce((a,b)=>a.concat(b)))
        .map(a=>a.map(b=>b.InvalidPassengerRecords).reduce((a,b)=>a.concat(b)));
    }

    /**
     * Get All Invalid Cargos By Incident
     * 
     * @param {number} incidentId 
     * @returns {Observable<InvalidCargoModel[]>} 
     * 
     * @memberOf MasterDataUploadForInvalidService
     */
    GetAllInvalidCargosByIncident(incidentId: number): Observable<InvalidCargoModel[]>{
        return this._dataServiceInvalidCargo.Query()
        .Expand(`InvolvedParties($expand=Flights($expand=InvalidCargoes))`)
        .Filter(`IncidentId eq ${incidentId}`)
        .Execute()
        .map(a=>a.Records.map(b=>b.InvolvedParties).reduce((a,b)=>a.concat(b)))
        .map(a=>a.map(b=>b.Flights).reduce((a,b)=>a.concat(b)))
        .map(a=>a.map(b=>b.InvalidCargoes).reduce((a,b)=>a.concat(b)));
    }

    /**
     * Get All Invalid Crews By Incident
     * 
     * @param {number} incidentId 
     * @returns {Observable<InvalidCrewModel[]>} 
     * 
     * @memberOf MasterDataUploadForInvalidService
     */
    GetAllInvalidCrewsByIncident(incidentId: number): Observable<InvalidCrewModel[]>{
        return this._dataServiceInvalidCrew.Query()
        .Expand(`InvolvedParties($expand=Flights($expand=InvalidCrewRecords))`)
        .Filter(`IncidentId eq ${incidentId}`)
        .Execute()
        .map(a=>a.Records.map(b=>b.InvolvedParties).reduce((a,b)=>a.concat(b)))
        .map(a=>a.map(b=>b.Flights).reduce((a,b)=>a.concat(b)))
        .map(a=>a.map(b=>b.InvalidCrewRecords).reduce((a,b)=>a.concat(b)));
    }

}
