import {
    Component, ViewEncapsulation, OnInit, AfterViewChecked,
    ElementRef, AfterContentInit, ViewChild, AfterViewInit
} from '@angular/core';
import {
    MemberEngagementTrackModel, MemberCurrentEngagementModel,
    MemberCurrentEngagementModelToView
} from './components/member.track.model';
import { MemberTrackService } from './components/member.track.service';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

import {
    ResponseModel,
    DataExchangeService,
    Severity,
    KeyValue,
    IncidentStatus,
    GlobalStateService,
    UtilityService, AuthModel
} from '../../shared';

import { UserProfileService, UserProfileModel } from '../masterdata/userprofile/components';
import { UserPermissionService, UserPermissionModel } from '../masterdata/userpermission/components';
import { ModalDirective } from 'ngx-bootstrap/modal';


@Component({
    selector: 'member-track-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/member.track.views.html',
    styleUrls: ['./styles/member.track.styles.scss']
})

export class MemberTrackComponent implements OnInit, AfterViewChecked {
    @ViewChild('childModalHistory') public childModalHistory: ModalDirective;
    currentUserId: number;
    currentIncidentId: number;
    currentDepartmentId: number;
    public memberTracks: MemberCurrentEngagementModel[] = [];
    memberEngagementsToView: MemberCurrentEngagementModelToView[] = [];
    userpermissions: UserPermissionModel[] = [];
    public isSubmited: boolean;
    isRemarksSubmitted: boolean = false;
    isChecked: boolean = false;
    memberHistory: MemberEngagementTrackModel[] = [];
    createdBy: number;
    credential: AuthModel;
    availblecount: number;
    freecount: number;
    private $toggle: JQuery;

    constructor(private globalState: GlobalStateService, private userProfileService: UserProfileService,
        private userpermissionService: UserPermissionService, private membertrackService: MemberTrackService,
        private elementRef: ElementRef, private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) {
    }

    ngOnInit() {
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
        this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.getMembarCurrentEngagementList(this.currentDepartmentId, this.currentIncidentId);
        this.credential = UtilityService.getCredentialDetails();
        this.createdBy = +this.credential.UserId;
    }

    ngAfterViewChecked() {
        if (!this.isChecked && this.memberEngagementsToView.length > 0) {
            this.isChecked = true;
            this.GenerateToggle();
        }
    }

    public GenerateToggle(): void {
        const self = this;
        const $selfElement = jQuery(this.elementRef.nativeElement);
        const $inputs = $selfElement.find('input[data-userid]');

        $.each($inputs, (index, element) => {
            $(element).bootstrapToggle({
                on: 'Busy',
                off: 'Available'
            }, 'disable');
            $(element).change(($event) => {
                self.datachanged($event);
            });
        });
    }

    public datachanged($event: Event): void {
        const $element: JQuery = jQuery($event.currentTarget);
        const userId = $element.data('userid');
        const obj: MemberCurrentEngagementModelToView = this.memberEngagementsToView
            .find((x) => x.UserId.toString() === userId);
        if ($element.prop('checked')) {

            obj.isRemarksSubmitted = true;
            if (obj && obj.Remarks.length > 0) {
                const memberTrackModel: MemberEngagementTrackModel = new MemberEngagementTrackModel();
                memberTrackModel.DepartmentId = this.currentDepartmentId;
                memberTrackModel.IncidentId = this.currentIncidentId;
                memberTrackModel.UserId = userId;
                memberTrackModel.DeployedOn = new Date();
                memberTrackModel.Deploy = true;
                memberTrackModel.Remarks = obj.Remarks;
                memberTrackModel.UnDeploy = false;
                memberTrackModel.CreatedBy = this.createdBy;
                if (obj.MemberEngagementTrackId == null || obj.MemberEngagementTrackId === 0 || obj.MemberEngagementTrackId === undefined) {
                    const memberCurrentEngagementToSave: MemberCurrentEngagementModel = new MemberCurrentEngagementModel();
                    memberCurrentEngagementToSave.DepartmentId = this.currentDepartmentId;
                    memberCurrentEngagementToSave.IncidentId = this.currentIncidentId;
                    memberCurrentEngagementToSave.IsBusy = true;
                    memberCurrentEngagementToSave.UserId = userId;
                    memberCurrentEngagementToSave.MemberEngagementTrack = memberTrackModel;
                    this.membertrackService.Create(memberCurrentEngagementToSave)
                        .subscribe((response: MemberCurrentEngagementModel) => {
                            // this.toastrService.success('Member is engaged now.');
                            alert('Member is engaged now.');

                            this.getMembarCurrentEngagementList(this.currentDepartmentId, this.currentIncidentId);
                        });
                }
                else {
                    this.membertrackService.CreateMemberTrack(memberTrackModel)
                        .subscribe((response: MemberEngagementTrackModel) => {
                            const memberCurrentEngagementToedit: MemberCurrentEngagementModel = new MemberCurrentEngagementModel();
                            memberCurrentEngagementToedit.IsBusy = true;
                            memberCurrentEngagementToedit.MemberEngagementTrackId = response.MemberEngagementTrackId;
                            memberCurrentEngagementToedit.deleteAttributes();
                            this.membertrackService.Update(memberCurrentEngagementToedit, obj.MemberCurrentEngagementId)
                                .subscribe((response1: MemberCurrentEngagementModel) => {
                                    // this.toastrService.success('Member is engaged now.');
                                    alert('Member is engaged now.');
                                    this.getMembarCurrentEngagementList(this.currentDepartmentId, this.currentIncidentId)

                                });
                        });
                }
            }
            this.getMembarCurrentEngagementList(this.currentDepartmentId, this.currentIncidentId);
        }
        else {
            const memberTrackModel: MemberEngagementTrackModel = new MemberEngagementTrackModel();
            memberTrackModel.deleteAttributes();
            memberTrackModel.MemberEngagementTrackId = obj.MemberEngagementTrackId;
            memberTrackModel.UnDeploy = true;
            memberTrackModel.UnDeployedOn = new Date();
            const memberCurrentEngagementToEdit: MemberCurrentEngagementModel = new MemberCurrentEngagementModel();
            memberCurrentEngagementToEdit.deleteAttributes();
            memberCurrentEngagementToEdit.MemberCurrentEngagementId = obj.MemberCurrentEngagementId;
            memberCurrentEngagementToEdit.IsBusy = false;
            this.membertrackService.Update(memberCurrentEngagementToEdit, memberCurrentEngagementToEdit.MemberCurrentEngagementId)
                .flatMap(() => this.membertrackService.UpdateMemberTrack(memberTrackModel, memberTrackModel.MemberEngagementTrackId))
                .subscribe(() => {
                    // this.toastrService.success('Member is free now.');
                    alert('Member is available now.');
                    this.getMembarCurrentEngagementList(this.currentDepartmentId, this.currentIncidentId)
                    // obj.isRemarksSubmitted=false;
                });
        }
    }


    departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        // this.isChecked = false;
        this.getMembarCurrentEngagementList(this.currentDepartmentId, this.currentIncidentId);
    }

    incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        //  this.isChecked = false;
        this.getMembarCurrentEngagementList(this.currentDepartmentId, this.currentIncidentId);
    }

    getMembarCurrentEngagementList(departmentId, incidentId): void {
        this.userpermissionService.GetAllDepartmentUsersWithUsers(departmentId)
            .map((response: ResponseModel<UserPermissionModel>) => {
                this.userpermissions = response.Records;
            })
            .flatMap((_) => this.membertrackService.GetAllByIncidentDepartment(departmentId, incidentId))
            .map((response1: ResponseModel<MemberCurrentEngagementModel>) => { this.memberTracks = response1.Records; })
            .subscribe(() => {
                this.isChecked = false;
                this.memberEngagementsToView = this.userpermissions.map((x) => {
                    const member: MemberCurrentEngagementModelToView = new MemberCurrentEngagementModelToView();
                    member.UserId = x.UserId;
                    member.MemberName = x.User.Name;
                    member.MemberContactNumber = x.User.MainContact;
                    member.IsNotyfied = (x.User.Notifications.length > 0) ? true : false;
                    member.IsAcknowledged = (x.User.Notifications.length > 0) ? (x.User.Notifications.some((x) => x.AckStatus === 'Accepted')) : false;
                    member.IsBusy = false;
                    member.isVolunteered = x.User.isVolunteered;
                    member.Remarks = '';
                    if (this.memberTracks.length > 0 && this.memberTracks.find((y) => y.UserId === x.UserId) != null) {
                        let obj: MemberCurrentEngagementModel = new MemberCurrentEngagementModel();
                        obj = this.memberTracks.find((y) => y.UserId === x.UserId);

                        member.IsBusy = obj.MemberEngagementTrack.Deploy && !obj.MemberEngagementTrack.UnDeploy;
                        member.Remarks = member.IsBusy ? obj.MemberEngagementTrack.Remarks : '';
                        member.MemberCurrentEngagementId = obj.MemberCurrentEngagementId;
                        member.MemberEngagementTrackId = obj.MemberEngagementTrackId;
                    }

                    return member;
                });
                this.availblecount = this.memberEngagementsToView.filter((x) => x.IsBusy === false).length;
                this.freecount = this.memberEngagementsToView.filter((x) => x.IsBusy === true).length;
                this.GenerateToggle();
            });


    }

    open(id) {
        this.membertrackService.GetAllHistory(id, this.currentDepartmentId, this.currentIncidentId)
            .subscribe((response: ResponseModel<MemberEngagementTrackModel>) => {
                this.memberHistory = response.Records;
                //  this.memberHistory["createdby"]=
                this.memberHistory.forEach((x) => {
                    this.userProfileService.Get(x.CreatedBy)
                        .subscribe((response1: UserProfileModel) => {
                            x['createdby'] = response1.Name;
                        });
                });

                this.childModalHistory.show();
            });
    }

    cancelHistory() {
        this.childModalHistory.hide();
    }
}