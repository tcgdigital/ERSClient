import { NgModule } from '@angular/core';
import { BaseModel } from '../../../../shared';

export class EmergencySituationModel extends BaseModel {

    public EmergencySituationId: number;
    public EmergencySituationName: string;

    public Active: boolean;

    constructor() {
        super();
        this.EmergencySituationId = 0;
        this.EmergencySituationName = '';
        this.Active = false;
    }
}