import {
    Component, ViewEncapsulation, SimpleChange,
    Output, Input, EventEmitter, AfterContentInit, OnChanges
} from '@angular/core';
import { GlobalStateService } from '../../services';
import { KeyValue } from '../../models';

@Component({
    selector: '[page-header]',
    templateUrl: './page.header.view.html',
    encapsulation: ViewEncapsulation.None
})
export class PageHeaderComponent implements AfterContentInit {
    @Input() userName: string;
    @Input() lastLogin: Date;
    @Input() departments: KeyValue[];
    @Input() incidents: KeyValue[];
    @Input() currentDepartmentId: number = 0;
    @Input() currentIncidentId: number = 0;
    @Input() isLanding : boolean;

    @Output() toggleSideMenu: EventEmitter<any> = new EventEmitter<any>();
    @Output() contactClicked: EventEmitter<any> = new EventEmitter<any>();
    @Output() helpClicked: EventEmitter<any> = new EventEmitter<any>();
    @Output() logoutClicked: EventEmitter<any> = new EventEmitter<any>();
    @Output() changePasswordClicked: EventEmitter<any> = new EventEmitter<any>();

    @Output() departmentChange: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();
    @Output() incidentChange: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();

    public ngAfterContentInit(): void {
        // console.log(`page header currentDepartmentId: ${this.currentDepartmentId}`);
        // console.log(`page header currentIncidentId: ${this.currentIncidentId}`);
    }

    public onToggleSideMenu($event): void {
        this.toggleSideMenu.emit($event);
    }

    public onContactClicked($event): void {
        this.contactClicked.emit($event);
    }

    public onHelpClicked($event): void {
        this.helpClicked.emit($event);
    }

    public onLogoutClicked($event): void {
        this.logoutClicked.emit($event);
    }

    public onChangePasswordClicked($event): void {
        this.changePasswordClicked.emit($event);
    }

    public onDepartmentChange(selectedDepartment: KeyValue): void {
        this.departmentChange.emit(selectedDepartment);
    }

    public onIncidentChange(selectedIncident: KeyValue): void {
        this.incidentChange.emit(selectedIncident);
    }
}