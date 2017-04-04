import { BaseModel } from '../../../../shared';
import { FlightModel } from '../../flights';

export class InvalidPassengerModel extends BaseModel{
    public InvalidPassengerId : number;
    public FlightId? : number;
    public FlightNumber : string;
    public PassengerName : string;
    public SpecialServiceRequestCode : string;
    public BaggageCount : string;
    public Destination : string;
    public Seatno : string;
    public Pnr : string;
    public ErrorReason : string;

    public Flight : FlightModel;
}