import {
    Component, ViewEncapsulation,
    OnInit, SimpleChange, OnDestroy
} from '@angular/core';
import { TAB_LINKS } from './dashboard.tablink';
import { IncidentService } from '../incident';
import { DepartmentService } from '../masterdata/department'
import { ITabLinkInterface, GlobalStateService, UtilityService, KeyValue } from '../../shared';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.view.html',
    styleUrls: ['./dashboard.style.scss'],
    encapsulation: ViewEncapsulation.None,

})
export class DashboardComponent implements OnInit, OnDestroy {
    public incidentDate: Date;
    public tablinks: ITabLinkInterface[];

    currentIncidentId: number;
    currentDepartmentId: number;
    currentIncident: KeyValue;
    currentDepartment: KeyValue;

    currentUserId: number;
    private sub: any;
    userId: number;

    constructor(private globalState: GlobalStateService,
        private departmentService: DepartmentService,
        private incidentService: IncidentService) {
        this.incidentDate = new Date();
    }

    public ngOnInit(): void {
        this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.getIncident(this.currentIncidentId);
        this.getDepartment(this.currentDepartmentId);

        this.tablinks = TAB_LINKS;
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    public onViewIncidentClick($event): void {

    }

    public ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }

    private getIncident(incidentId: number): void {
        this.incidentService.Get(incidentId)
            .subscribe((data) => {
                this.currentIncident = new KeyValue(data.Description, data.IncidentId);
                  this.incidentDate = new Date(data.EmergencyDate);
            });
    }

    private getDepartment(departmentId: number): void {
        this.departmentService.Get(departmentId)
            .subscribe((data) => {
                this.currentDepartment = new KeyValue(data.Description, data.DepartmentId);
              
            });
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncident = incident;
        this.currentIncidentId = incident.Value;
        this.getIncident(incident.Value);
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartment = department;
        this.currentDepartmentId = department.Value;
    }
}