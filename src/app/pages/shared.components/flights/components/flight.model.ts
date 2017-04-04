import { NgModule } from '@angular/core';
import { BaseModel } from '../../../../shared';
import {
    InvolvePartyModel,
    CrewModel,
    PassengerModel,
    CargoModel,
    InvalidPassengerModel,
    InvalidCargoModel,
    InvalidCrewModel
} from '../../../shared.components';

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

    public InvolvedParty: InvolvePartyModel;

    public Crewes?: CrewModel[];
    public Passengers?: PassengerModel[];
    public Cargoes?: CargoModel[];
    public InvalidPassengerRecords?: InvalidPassengerModel[];
    public InvalidCargoes?: InvalidCargoModel[];
    public InvalidCrewRecords?: InvalidCrewModel[];
    
    constructor() {
        super();
        this.FlightId = 0;
        this.InvolvedPartyId = 0;
        this.FlightNo = '';
        this.FlightTaleNumber = '';
        this.OriginCode = '';
        this.DestinationCode = '';
        this.DepartureDate = new Date();
        this.ArrivalDate = null;
        this.LoadAndTrimInfo = null;
    }
}