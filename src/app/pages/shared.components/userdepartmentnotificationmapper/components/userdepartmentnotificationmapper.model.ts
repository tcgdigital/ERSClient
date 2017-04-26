import { NgModule } from '@angular/core';
import { BaseModel } from '../../../../shared';
import { UserProfileModel } from "../../../masterdata/userprofile";
import { DepartmentModel } from "../../../masterdata/department";
import { IncidentModel } from "../../../incident/components/incident.model";
import { NotificationModel } from "../../../shared.components/notification/components/notification.model";
export class UserdepartmentNotificationMapperModel extends BaseModel {
    public UserDepartmentNotificationMapperId: number;
    public UserId: number;
    public DepartmentId: number;
    public NotificationId: number;
    public IncidentId: number;
    public SendOn: Date;

    public UserProfile: UserProfileModel;
    public Department: DepartmentModel;
    public Notification: NotificationModel;
    public Incident: IncidentModel;


    constructor() {
        super();
        this.UserDepartmentNotificationMapperId = 0;
        this.UserId = 0;
        this.DepartmentId = 0;
        this.NotificationId = 0;
        this.IncidentId = 0;
        this.SendOn = new Date();
    }
}