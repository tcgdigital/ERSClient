import { NgModule } from '@angular/core';
import { BaseModel } from '../../../shared';

import { IncidentModel } from '../../incident';
import { DepartmentModel } from '../../masterdata/department';

export class DepartmentClosureModel extends BaseModel {
    public DepartmentClosureId: number;
    public IncidentId: number;
    public DepartmentId: number;
    public EmergencyName:string;
    public EmergencyNote:string;
    public ClosureReport: string;
    public ClosureRemark: string;
    public IsSubmitted: boolean;
    public SubmittedBy?: number;
    public SubmittedOn?: Date;
    public IsSaved: boolean;
    public SavedBy?: number;
    public SavedOn?: Date;
    public Checklistnumber?: number;
    public ChecklistClosednumber?: number;
    public demandnumber?: number;
    public demandClosednumber?: number;
    public InitialNotify?: boolean;
    public SeperateNotify?: boolean;

    public Incident?: IncidentModel;
    public Department?: DepartmentModel;

    constructor() {
        super();
        this.DepartmentClosureId = 0;
        this.DepartmentId = 0;
        this.IncidentId = 0;
        this.ClosureRemark = "";
        this.ClosureReport = "";
        this.Department = null;
        this.IsSaved = false;
        this.IsSubmitted = false;
        this.SavedBy = null;
        this.SavedOn = null;
        this.SubmittedBy = 0;
        this.SubmittedOn = new Date();
    }
}