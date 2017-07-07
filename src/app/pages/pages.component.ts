import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

import {
    SideMenuService, KeyValue,
    ResponseModel, GlobalStateService
} from '../shared';
import { DepartmentService, DepartmentModel } from './masterdata';
import { IncidentService, IncidentModel } from './incident';
import { PAGES_MENU } from './pages.menu';
import { UtilityService } from '../shared/services';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthenticationService } from './login/components/authentication.service';
import { UserPermissionService } from './masterdata/userpermission/components';
import { UserPermissionModel } from './masterdata/userpermission/components';
import * as _ from 'underscore';

@Component({
    selector: 'pages',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './pages.view.html',
    providers: []
})
export class PagesComponent implements OnInit {
    @ViewChild('changePasswordModel') public changePasswordModel: ModalDirective;
    @ViewChild('quickLinkModel') public quickLinkModel: ModalDirective;

    sideMenuState: boolean = false;
    departments: KeyValue[] = [];
    incidents: KeyValue[] = [];
    incidentOrganizations: KeyValue[] = [];
    currentDepartmentId: number = 0;
    currentIncidentId: number = 0;
    userName: string;
    lastLogin: Date;
    userId: number;
    isLanding: boolean = false;
    showQuicklink: boolean = false;
    private sub: any;

    /**
     * Creates an instance of PagesComponent.
     * @param {SideMenuService} sideMenuService
     * @param {IncidentService} incidentService
     * @param {DepartmentService} departmentService
     * @param {GlobalStateService} globalState
     * @param {ToastrService} toastrService
     * @param {ToastrConfig} toastrConfig
     *
     * @memberOf PagesComponent
     */
    constructor(private router: Router,
        private sideMenuService: SideMenuService,
        private incidentService: IncidentService,
        private departmentService: DepartmentService,
        private userPermissionService: UserPermissionService,
        private authenticationService: AuthenticationService,
        private globalState: GlobalStateService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) {
        toastrConfig.closeButton = true;
        toastrConfig.progressBar = true;
        toastrConfig.enableHtml = true;
    }

    ngOnInit(): void {
        this.sideMenuService.updateMenuByRoutes(PAGES_MENU as Routes);

        this.getIncidents();
        this.userName = localStorage.getItem('CurrentLoggedInUserName');
        this.userId = +UtilityService.GetFromSession('CurrentUserId');
        this.getDepartments();
        this.lastLogin = new Date(localStorage.getItem('LastLoginTime'));
        this.globalState.Subscribe('incidentCreate', (model: number) => this.incidentCreateHandler(model));

    }

    ngOnDestroy(): void {
        //  this.globalState.Unsubscribe('incidentCreate');
    }

    public toggleSideMenu($event): void {
        this.sideMenuState = !this.sideMenuState;
    }

    public onContactClicked($event): void {
        this.globalState.NotifyDataChanged('contactClicked', '');
    }

    public onHelpClicked($event): void {
        this.toastrService.info('Help command has been clicked', 'Help', this.toastrConfig);
        console.log('Help Clicked');
    }

    public onLogoutClicked($event): void {
        this.authenticationService.Logout();
        this.router.navigate(['login']);
    }

    public onChangePasswordClicked($event): void {
        this.changePasswordModel.show();
    }

    public closeChangePasswordModal(): void {
        this.changePasswordModel.hide();
    }

    public onCancelChangePasswordClick($event): void {
        this.changePasswordModel.hide();
    }

    public onChangePasswordSuccess($event): void {
        this.toastrService.success($event, 'Password Changed', this.toastrConfig);
        this.authenticationService.Logout();
        this.router.navigate(['login']);
    }

    public closeQuickLinkModel(): void {
        this.quickLinkModel.hide();
        this.showQuicklink = false;
    }

    public onDepartmentChange(selectedDepartment: KeyValue): void {
        UtilityService.SetToSession({ CurrentDepartmentId: selectedDepartment.Value });
        this.globalState.NotifyDataChanged('departmentChange', selectedDepartment);
    }

    public onIncidentChange(selectedIncident: KeyValue): void {
        UtilityService.SetToSession({ CurrentIncidentId: selectedIncident.Value });
        UtilityService.SetToSession({
            CurrentOrganizationId: this.incidentOrganizations
                .find((z) => z.Key === selectedIncident.Value.toString()).Value
        });
        this.globalState.NotifyDataChanged('incidentChange', selectedIncident);
    }

    public onMenuClick($event): void {
        this.showQuicklink = true;
        if ($event === 'quicklink') {
            this.quickLinkModel.show();
        }
    }

    private getDepartments(): void {
        this.userPermissionService.GetAllDepartmentsAssignedToUser(this.userId)
            .map((x: ResponseModel<UserPermissionModel>) => x.Records.sort((a, b) => {
                if (a.Department.DepartmentName < b.Department.DepartmentName) return -1;
                if (a.Department.DepartmentName > b.Department.DepartmentName) return 1;
                return 0;
            })
            ).subscribe((x: UserPermissionModel[]) => {
                this.departments = x.map((y: UserPermissionModel) =>
                    new KeyValue(y.Department.DepartmentName, y.Department.DepartmentId));
                if (this.departments.length > 0) {
                    const departmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
                    if (departmentId > 0) {
                        this.currentDepartmentId = departmentId;
                    }
                    else {
                        this.currentDepartmentId = this.departments[0].Value;
                        UtilityService.SetToSession({ CurrentDepartmentId: this.currentDepartmentId });
                    }
                    console.log(this.currentDepartmentId);
                }
                else {
                    // this.isLanding = true;
                }
            });
    }

    private getIncidents(): void {
        this.incidentService.GetAllActiveIncidents()
            .map((x: ResponseModel<IncidentModel>) => x.Records.sort((a, b) => {
                const dateA = new Date(a.CreatedOn).getTime();
                const dateB = new Date(b.CreatedOn).getTime();
                return dateA > dateB ? -1 : 1;
            })).subscribe((x: IncidentModel[]) => {
                this.incidents = x.map((y: IncidentModel) => new KeyValue(y.EmergencyName, y.IncidentId));
                this.incidentOrganizations = x.map((y: IncidentModel) => new KeyValue(y.IncidentId.toString(), y.OrganizationId));
                if (this.incidents.length > 0) {
                    const incidentId = +UtilityService.GetFromSession('CurrentIncidentId');

                    if (incidentId > 0) {
                        this.currentIncidentId = incidentId;
                    }
                    else {
                        this.currentIncidentId = this.incidents[0].Value;
                        UtilityService.SetToSession({ CurrentIncidentId: this.currentIncidentId });
                    }
                    UtilityService.SetToSession({
                        CurrentOrganizationId: this.incidentOrganizations
                            .find((z) => z.Key === this.currentIncidentId.toString()).Value
                    });
                    console.log(this.currentIncidentId);

                    this.isLanding = false;
                }
                else {
                    this.isLanding = true;
                }
            });
    }

    private incidentCreateHandler(incident: number) {
        this.getIncidents();
    }
}