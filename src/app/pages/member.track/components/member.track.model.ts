import { NgModule } from '@angular/core';
import { BaseModel } from '../../../shared';

import { IncidentModel } from '../../incident';
import { DepartmentModel } from '../../masterdata/department';
import { UserProfileModel } from '../../masterdata/userprofile';

export class MemberEngagementTrackModel extends BaseModel {
    public MemberEngagementTrackId: number;
    public UserId: number;
    public IncidentId: number;
    public DepartmentId: number;
    public Remarks: string;
    public Deploy: boolean;
    public UnDeploy: boolean;
    public DeployedOn?: Date;
    public UnDeployedOn?: Date;

    public UserProfile?: UserProfileModel;
    public Incident?: IncidentModel;
    public Department?: DepartmentModel;
    public MemberCurrentEngagements?: MemberCurrentEngagementModel[];

    constructor() {
        super();
    }
}

export class MemberCurrentEngagementModel extends BaseModel {
    public MemberCurrentEngagementId: number;
    public UserId: number;
    public IncidentId: number;
    public DepartmentId: number;
    public MemberEngagementTrackId: number;
    public IsBusy: boolean;

    public UserProfile?: UserProfileModel;
    public Incident?: IncidentModel;
    public Department?: DepartmentModel;
    public MemberEngagementTrack?: MemberEngagementTrackModel;

    constructor() {
        super();
    }
}


export class MemberCurrentEngagementModelToView {
    public MemberCurrentEngagementId: number;
    public UserId: number;
    public IncidentId: number;
    public DepartmentId: number;
    public MemberEngagementTrackId: number;
    public IsBusy: boolean;
    public MemberName: string;
    public MemberContactNumber: string;
    public Remarks: string;
    public IsNotyfied: boolean;
    public IsAcknowledged: boolean;
    public isRemarksSubmitted: boolean;
    public isVolunteered: boolean;


}