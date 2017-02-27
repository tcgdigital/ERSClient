import { NgModule } from '@angular/core';
import { BaseModel } from '../../../../shared';
import { InvolvedPartyModel } from '../../involvedParty/components/involvedParty.model';

export class FlightModel extends BaseModel {
    
public FlightId: number;
    public InvolvedPartyId: number;
    public FlightNo: string;
    public FlightTaleNumber: string;
    public OriginCode: string;
    public DestinationCode: string;
    public DepartureDate: Date;
    public ArrivalDate?: Date;
    public LoadAndTrimInfo?: string;


    public Active: boolean;

    public InvolvedParty: InvolvedPartyModel;
}