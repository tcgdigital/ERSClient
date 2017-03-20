import { NgModule } from '@angular/core';
import { BaseModel, KeyValue } from '../../../shared';
import { EmergencyTypeModel } from '../../masterdata/emergencytype';
import { DepartmentModel } from '../../masterdata/department';

export class IncidentModel extends BaseModel {
    public IncidentId: number;
    public IsDrill: boolean;
    public EmergencyTypeId: number;
    public IncidentStatus: string;
    public EmergencyName: string;
    public AlertMessage: string;
    public Description: string;
    public ClosureNote: string;
    public EmergencyDate: Date;
    public Severity: string;
    public EmergencyLocation: string;
    public IsSubmitted: boolean;
    public IsSaved: boolean;
    public Remarks: string;
    public ClosedBy?: number;
    public ClosedOn?: Date;
    public ReOpenBy?: number;
    public ReOpenOn?: Date;
    public ReClosedBy?: number;
    public ReClosedOn?: Date;
    public SubmittedBy?: number;
    public SubmittedOn?: Date;
    public SavedBy?: number;
    public SavedOn?: Date;
    public DepartmentId: number;


    public Active: boolean;

    public EmergencyType: EmergencyTypeModel;
    public Department: DepartmentModel;


    constructor() {
        super();
        this.IncidentId = 0;
        this.IsDrill = false;
        this.EmergencyTypeId = 0;
        this.IncidentStatus = '';
        this.EmergencyName = '';
        this.AlertMessage = '';
        this.Description = '';
        this.ClosureNote = '';
        this.EmergencyDate = new Date();
        this.Severity = '';
        this.EmergencyLocation = '';
        this.IsSubmitted = false;
        this.IsSaved = false;
        this.Remarks = '';
        this.ClosedBy = null;
        this.ClosedOn = null;
        this.ReOpenBy = null;
        this.ReOpenOn = null;
        this.ReClosedBy = null;
        this.ReClosedOn = null;
        this.SubmittedBy = null;
        this.SubmittedOn = null;
        this.SavedBy = null;
        this.SavedOn = null;
        this.DepartmentId = 0;
    }
}

