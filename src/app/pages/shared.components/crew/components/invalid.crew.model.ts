import { BaseModel } from '../../../../shared';
import { FlightModel } from '../../flights';

export class InvalidCrewModel extends BaseModel{
    public InvalidCrewId : number;
    public FlightId? : number;
    public EmployeeNumber : string;
    public CrewName : string;
    public AsgCat : string;
    public DeadheadCrew : string;
    public BaseLocation : string;
    public Email : string;
    public DepartureStationCode : string;
    public ArrivalStationCode : string;
    public FlightNo : string;
    public WorkPosition : string;
    public CrewDob? : Date;
    public CrewAddress : string;
    public CrewGender : string;
    public NextStationCode : string;
    public CrewNationality : string;
    public ContactNumber : string;
    public AlternateContactNumber : string;
    public ErrorReason : string;

    public Flight : FlightModel;   
}