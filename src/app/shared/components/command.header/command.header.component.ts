import { Component, ViewEncapsulation, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KeyValue } from '../../models/base.model';

@Component({
    selector: '[command-header]',
    templateUrl: './command.header.view.html',
    styleUrls: ['./command.header.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CommandHeaderComponent implements OnInit {

    @Input() departments: KeyValue[];
    @Input() incidents: KeyValue[];
    @Output() departmentChange: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();
    @Output() incidentChange: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();

    incidentPlaceholder: string='Incident';
    departmentPlaceholder: string= 'Department';
    
    constructor() { }

    ngOnInit() { }

// onChangeIncident(value){
//       this.globalState.NotifyDataChanged('incidentChange', value);
//     }

//     onChangeDepartment(value){
//       this.globalState.NotifyDataChanged('departmentChange', value);
//     }
    public onDepartmentChange(selectedDepartment: KeyValue): void {
        this.departmentChange.emit(selectedDepartment);
    }

    public onIncidentChange(selectedIncident: KeyValue): void {
        this.incidentChange.emit(selectedIncident);
    }
}