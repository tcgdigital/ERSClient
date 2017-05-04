import {
    Component, ViewEncapsulation,
    OnInit, SimpleChange, OnDestroy
} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TAB_LINKS } from './archive.dashboard.tablinks';
import { ITabLinkInterface, GlobalStateService, UtilityService, KeyValue } from '../../shared';
import { IncidentService, IncidentModel } from '../incident';
import { DepartmentService, DepartmentModel } from '../masterdata/department';

@Component({
    selector: 'archive-dashboard',
    templateUrl: './archive.dashboard.view.html',
    styleUrls: ['./archive.dashboard.style.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class ArchiveDashboardComponent implements OnInit {
    public tablinks: ITabLinkInterface[];
    archievedIncidentId: number;
    currentDepartmentId: number;
    currentIncident: KeyValue;
    currentDepartment: KeyValue;
    private sub: any;

    /**
     * Creates an instance of ArchiveDashboardComponent.
     * @param {ActivatedRoute} router
     * @param {IncidentService} incidentService
     * @param {DepartmentService} departmentService
     *
     * @memberof ArchiveDashboardComponent
     */
    constructor(private router: ActivatedRoute, private incidentService: IncidentService,
        private departmentService: DepartmentService) { }

    /**
     * ngOnInit
     *
     *
     * @memberof ArchiveDashboardComponent
     */
    public ngOnInit(): void {
        this.archievedIncidentId = +UtilityService.GetFromSession('ArchieveIncidentId');
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.tablinks = TAB_LINKS;
        this.GetIncidentAndDepartment();
    }

    /**
     * GetIncidentAndDepartment
     *
     * @private
     *
     * @memberof ArchiveDashboardComponent
     */
    private GetIncidentAndDepartment(): void {
        this.incidentService.Get(this.archievedIncidentId)
            .map((record: IncidentModel) => {
                this.currentIncident = new KeyValue(record.Description, record.IncidentId);
            })
            .flatMap((_) => this.departmentService.Get(this.currentDepartmentId))
            .subscribe((data: DepartmentModel) => {
                this.currentDepartment = new KeyValue(data.Description, data.DepartmentId);
            });
    }
}