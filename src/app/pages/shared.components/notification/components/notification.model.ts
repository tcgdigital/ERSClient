import { NgModule } from '@angular/core';
import { BaseModel } from '../../../../shared';
import { IncidentModel } from "../../../incident/components/incident.model";
import { UserProfileModel } from "../../../masterdata/userprofile/components/userprofile.model";
import { UserdepartmentNotificationMapperModel } from "../../userdepartmentnotificationmapper/components/userdepartmentnotificationmapper.model";
import {
    InvolvePartyModel,
    CrewModel,
    PassengerModel,
    CargoModel,
    InvalidPassengerModel,
    InvalidCargoModel,
    InvalidCrewModel
} from '../../../shared.components';

export class NotificationModel extends BaseModel {
    public SequenceId: number;
    public IncidentId: number;
    public SituationId: number;
    public NotifyTo: number;
    public NotifyThru: string;
    public NotificationMessage: string;
    public NotifyDt?: Date;
    public AckStatus: string;
    public AckThru: string;
    public AckDt?: Date;
    public UpdatedBy?: number;
    public UpdatedDt?: Date;

    public Incident: IncidentModel;
    public UserProfile: UserProfileModel;

    public UserdepartmentNotificationMapper?: UserdepartmentNotificationMapperModel[];
    
    
    constructor() {
        super();
        this.SequenceId = 0;
        this.IncidentId = 0;
        this.SituationId = 0;
        this.NotifyTo = 0;
        this.NotifyThru = '';
        this.NotificationMessage = '';
        this.NotifyDt = null;
        this.AckStatus = '';
        this.AckThru = '';
        this.AckDt = null;
        this.UpdatedBy = null;
        this.UpdatedDt = null;
    }
}