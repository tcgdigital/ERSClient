import { NgModule } from '@angular/core';

import { IncidentModel } from '../../../incident';
import { AffectedModel } from '../../affected';
import { FlightModel } from '../../../shared.components';
import { BaseModel, InvolvedPartyType, GlobalConstants } from '../../../../shared';

export class InvolvePartyModel extends BaseModel {
    public InvolvedPartyId: number;
    public IncidentId: number;
    public InvolvedPartyType: InvolvedPartyType;
    public InvolvedPartyDesc: string;

    public Incident: IncidentModel;

    public Affecteds ? : AffectedModel[] ;
    public Flights ? : FlightModel[];

    constructor() {
        super();
        this.InvolvedPartyId = 0;
        this.IncidentId = 0;
        this.InvolvedPartyType = GlobalConstants.EmergencyCategories
        this.InvolvedPartyDesc = '';
    }
}