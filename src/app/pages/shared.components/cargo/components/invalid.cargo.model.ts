import { BaseModel } from '../../../../shared';
import { FlightModel } from '../../flights';

export class InvalidCargoModel extends BaseModel{
    public InvalidCargoId : number;
    public FlightId : number;
    public Details : string;
    public FlightDetails : string;
    public POL : string;
    public POU : string;
    public AWB : string;
    public mftpcs : string;
    public mftwgt : string;
    public ErrorReason : string;

    public Flight : FlightModel;
}