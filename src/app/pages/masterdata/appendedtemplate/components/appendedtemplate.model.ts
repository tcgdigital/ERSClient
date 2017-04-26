import { NgModule } from '@angular/core';
import { BaseModel } from '../../../../shared';
import { EmergencySituationModel } from '../../emergency.situation';
import { TemplateModel } from '../../template';
export class AppendedTemplateModel extends BaseModel {
    public AppendedTemplateId: number;
    public TemplateId: number;
    public EmergencySituationId: number;
    public TemplateMediaId: number;
    public Description: string;
    public Subject: string;
    public Active: boolean;

    public Template: TemplateModel;
    public EmergencySituation: EmergencySituationModel;

    constructor() {
        super();
        this.AppendedTemplateId = 0;
        this.TemplateId = 0;
        this.EmergencySituationId = 0;
        this.TemplateMediaId = 0;
        this.Description = '';
        this.Subject = '';
        this.Active = true;

    }
}