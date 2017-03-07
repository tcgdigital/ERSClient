import { NgModule } from '@angular/core';
import { BaseModel } from '../../../../shared';
import { ChecklistModel } from '../../../masterdata/checklist';
import { IncidentModel } from '../../../incident';

export class ActionableModel extends BaseModel {
    public ActionId: number;
    public ChklistId: number;
    public IncidentId?: number;
    public Description: string;
    public AssignedBy: number;
    public AssignedDt?: Date;
    public CompletionStatus: string;
    public ParentCheckListId?: number;
    public AssignToDepartment: number;
    public EndTime?: Date;
    public RaisedBy?: number;
    public ScheduleClose?: Date;
    public CheckListCode: string;
    public CheckListDetails: string;
    public Duration: number;
    public DepartmentId: number;
    public URL: string;
    public EmergencyTypeId: number;
    public Sequence: string;
    public UploadLinks: string;
    public FileName: string;
    public ActualClose?: Date;
    public IsClosed: boolean;
    public ClosedBy?: number;
    public ClosedOn?: Date;
    public ReopenedBy?: number;
    public ReopenedOn?: Date;
    public Done: boolean;
    public Reopen: boolean;
    public IsDisabled: boolean;
    public Active: boolean;
    public RagColor: string;
    public Comments: string;
    public show: boolean;
    
    public Incident: IncidentModel;
    public CheckList: ChecklistModel;
}

