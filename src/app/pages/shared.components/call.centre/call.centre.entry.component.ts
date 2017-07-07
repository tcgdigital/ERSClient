import { Component, ViewEncapsulation, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, Observable } from 'rxjs/Rx';

import { DemandTrailModel } from '../demand/components/demand.trail.model';
import {
    ResponseModel, DataExchangeService,
    AutocompleteComponent, KeyValue,
    GlobalConstants, UtilityService, GlobalStateService, AuthModel
} from '../../../shared';
import { EnquiryModel, EnquiryService } from './components';
import { AffectedPeopleModel } from "../affected.people/components";
import { PassengerService, CoPassengerMappingModel, CoPassangerModelsGroupIdsModel } from "../passenger/components";

import {
    CommunicationLogModel, InvolvePartyModel,
    AffectedPeopleService, AffectedPeopleToView,
    AffectedObjectsService, AffectedObjectsToView, DemandModel
} from '../../shared.components';
import { DemandService } from '../demand';
import { CommunicationLogService } from '../communicationlogs';
import { CallerModel } from '../caller';
import { DepartmentService, DepartmentModel } from '../../masterdata/department';
import { InvolvePartyService } from '../involveparties';
//import { PassengerService } from '../passenger';
import {
    CallCenterOnlyPageService, ExternalInputModel,
    PDAEnquiryModel, CargoEnquiryModel, MediaAndOtherQueryModel
} from '../../callcenteronlypage/component';

import { IAutocompleteActions } from '../../../shared/components/autocomplete/IAutocompleteActions';
import { ModalDirective } from 'ng2-bootstrap/modal';
import * as _ from 'underscore';

@Component({
    selector: 'call-centre-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/call.centre.view.html',
    styleUrls: ['./styles/call.center.style.scss'],
    providers: [
        EnquiryService,
        AffectedPeopleService,
        AffectedObjectsService,
        DepartmentService,
        DemandService,
        InvolvePartyService,
        CommunicationLogService,
        PassengerService
    ]
})
export class EnquiryEntryComponent /*implements OnInit*/ {
    @Input('callid') callid: number;
    @Input('enquiryType') enquiryType: number;
    // @ViewChild('childModalForTrail') public childModalForTrail: ModalDirective;



    /**
     * Creates an instance of EnquiryEntryComponent.
     * @param {AffectedPeopleService} affectedPeopleService
     * @param {AffectedObjectsService} affectedObjectsService
     * @param {DepartmentService} departmentService
     * @param {EnquiryService} enquiryService
     * @param {InvolvePartyService} involvedPartyService
     * @param {DemandService} demandService
     * @param {DataExchangeService<string>} dataExchange
     * @param {GlobalStateService} globalState
     * 
     * @memberOf EnquiryEntryComponent
     */
    constructor(private affectedPeopleService: AffectedPeopleService,
        private affectedObjectsService: AffectedObjectsService,
        private departmentService: DepartmentService,
        private enquiryService: EnquiryService,
        private involvedPartyService: InvolvePartyService,
        private demandService: DemandService,
        private dataExchange: DataExchangeService<string>,
        private globalState: GlobalStateService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private callcenteronlypageservice: CallCenterOnlyPageService,
        private communicationlogservice: CommunicationLogService,
        private passangerService: PassengerService) { }


    public form: FormGroup;
    enquiryTypes: any[] = GlobalConstants.ExternalInputEnquiryType;
    pdaenquery: PDAEnquiryModel = new PDAEnquiryModel();
    cargoquery: CargoEnquiryModel = new CargoEnquiryModel();
    otherquery: MediaAndOtherQueryModel = new MediaAndOtherQueryModel();
    //enquiryType: number;
    enquiry: EnquiryModel = new EnquiryModel();
    //for passanger
    enquiriesToUpdate: EnquiryModel[] = [];
    //for other queries
    enquiryToUpdate: EnquiryModel = new EnquiryModel();
    caller: CallerModel = new CallerModel();
    passengers: KeyValue[] = [];
    awbs: KeyValue[] = [];
    crews: KeyValue[] = [];
    affectedPeople: AffectedPeopleToView[];
    communicationLogs: CommunicationLogModel[];
    communicationLog: CommunicationLogModel = new CommunicationLogModel();
    date: Date = new Date();
    demand: DemandModel;
    demands: DemandModel[] = new Array<DemandModel>();
    affectedObjects: AffectedObjectsToView[];
    currentDepartmentId: number;
    currentDepartmentName: string = '';
    currentIncident: number;
    departments: DepartmentModel[];
    selctedEnquiredPerson: AffectedPeopleToView;
    selctedEnquiredObject: AffectedObjectsToView;
    credential: AuthModel;
    isCallrecieved: boolean = false;
    initialvalue: KeyValue = new KeyValue('', 0);
    actionLinks: IAutocompleteActions[] = [{
        ActionName: 'Test1',
        ActionDescription: 'Test Icon 1',
        ActionIcon: 'fa fa-comments-o fa-lg'
    }];
    pdaNameForTrail: string = "";
    ticketNumber: string = "";
    communications: CommunicationLogModel[] = [];
    showCallcenterModal: boolean = false;
    hideModal: boolean = true;
    initialgroupId: number;

    protected _onRouteChange: Subscription;
    externalInput: ExternalInputModel = new ExternalInputModel();
    communicationlogstoupdateId: number[] = [];
    communicationlog: CommunicationLogModel = new CommunicationLogModel();
    public submitted: boolean = false;
    copassengerlistpnr: AffectedPeopleToView[] = [];
    copassengerlistPassenger: AffectedPeopleToView[] = [];
    copassengerlistPassengerForMappedPerson: AffectedPeopleToView[] = [];
    selectedcountpnr: number;
    selectedcountpassenger: number;
    list1Selected: boolean = false;
    list2Selected: boolean = false;
    totallistselected: boolean = false;
    totalcount: number;
    consolidatedCopassengers: AffectedPeopleToView[] = [];
    copassengersBygroup: CoPassengerMappingModel[] = [];
    showCoPassangerPannel: boolean = false;
    selectedCoPassangers: AffectedPeopleToView[] = [];
    initialgrouidlist: number[] = [];
    pdaenquiryid: number;
    affectedId: number;
    createdBy: number;
    createdByName : string;
    // grouidlistselected: number[] = [];


    //get data

    getPassengersCrews(currentIncident): void {
        this.involvedPartyService.GetFilterByIncidentId(currentIncident)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedPeople = this.affectedPeopleService.FlattenAffectedPeople(response.Records[0]);
                const passengerModels = this.affectedPeople.filter(x => x.IsCrew === false);
                const crewModels = this.affectedPeople.filter(x => x.IsCrew == true);
                for (const affectedPerson of passengerModels) {
                    this.passengers.push(new KeyValue((affectedPerson.PassengerName || affectedPerson.CrewName), affectedPerson.AffectedPersonId));
                    this.copassengerlistPassenger.push(Object.assign({}, affectedPerson));
                    //this.grouidlist.push(affectedPerson.GroupId);
                }
                this.copassengerlistPassenger.forEach(x => x.IsSelected = false);
                for (const affectedPerson of crewModels) {
                    this.crews.push(new KeyValue((affectedPerson.PassengerName || affectedPerson.CrewName), affectedPerson.AffectedPersonId));
                }
            }, (error: any) => {
                console.log(`Error: ${error}`);
            }, () => {
                this.getExternalInput(this.enquiryType);
            });
    }

    getCargo(currentIncident): void {
        this.affectedObjectsService.GetFilterByIncidentId(currentIncident)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedObjects = this.affectedObjectsService.FlattenAffactedObjects(response.Records[0]);
                for (const affectedObject of this.affectedObjects) {
                    this.awbs.push(new KeyValue(affectedObject.AWB, affectedObject.AffectedObjectId));
                }
            }, (error: any) => {
                console.log(`Error: ${error}`);
            }, () => {
                this.getExternalInput(this.enquiryType);
            });
    }

    getDepartments(): void {
        this.departmentService.GetAll()
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                this.departments = response.Records;
                 this.currentDepartmentName = this.departments.find(x=>x.DepartmentId==this.currentDepartmentId).DepartmentName;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    getExternalInput(enquirytype): void {
        let queryDetailService: Observable<ExternalInputModel[]>
        if (enquirytype == 1 || enquirytype == 3)
            queryDetailService = this.callcenteronlypageservice.GetPassengerQueryByIncident(this.currentIncident, this.callid).map(x => x.Records);
        else if (enquirytype == 2)
            queryDetailService = this.callcenteronlypageservice.GetCargoQueryByIncident(this.currentIncident, this.callid).map(x => x.Records);
        else if (enquirytype >= 4)
            queryDetailService = this.callcenteronlypageservice.GetMediaAndOtherQueryByIncident(this.currentIncident, this.callid).map(x => x.Records);

        queryDetailService.subscribe((response: ExternalInputModel[]) => {
            if (response[0].PDAEnquiry != null) {
                this.pdaenquery = response[0].PDAEnquiry;
                this.form.controls["Queries"].reset({ value: this.pdaenquery.Query, disabled: false });

            }
            if (response[0].CargoEnquiry != null) {
                this.cargoquery = response[0].CargoEnquiry;
                this.form.controls["Queries"].reset({ value: this.cargoquery.Query, disabled: false });
            }
            if (response[0].MediaAndOtherQuery != null) {
                this.otherquery = response[0].MediaAndOtherQuery;
                this.form.controls["Queries"].reset({ value: this.otherquery.Query, disabled: false });
            }
            this.enquiry.CallerId = response[0].Caller.CallerId;
            this.enquiry.ExternalInputId = this.callid;
            this.caller = response[0].Caller;
            this.isCallrecieved = response[0].IsCallRecieved;
            if (enquirytype == 1) {
                this.pdaenquiryid = this.pdaenquery.PDAEnquiryId;
            }
            if (this.isCallrecieved) {
                this.enquiryToUpdate = this.enquiryType != 1 ? response[0].Enquiries[0] :
                    response[0].Enquiries.find(x => x.AffectedPersonId == this.pdaenquery.AffectedPersonId);
                this.enquiry = this.enquiryToUpdate;
                this.form.controls["Queries"].reset({ value: this.enquiryToUpdate.Queries, disabled: false });
                if (this.enquiryType == 1 || this.enquiryType == 2 || this.enquiryType == 3) {
                    this.form.controls["IsCallBack"].reset({ value: this.enquiryToUpdate.IsCallBack, disabled: false });
                    this.form.controls["IsAdminRequest"].reset({ value: this.enquiryToUpdate.IsAdminRequest, disabled: false });
                    this.form.controls["IsTravelRequest"].reset({ value: this.enquiryToUpdate.IsTravelRequest, disabled: false });
                    this.initialvalue = (this.enquiryType == 1) ? this.passengers.find(x => x.Value == this.enquiryToUpdate.AffectedPersonId)
                        : (this.enquiryType == 3 ? this.crews.find(x => x.Value == this.enquiry.AffectedPersonId) :
                            (this.enquiryType == 2 ? this.awbs.find(x => x.Value == this.enquiry.AffectedObjectId) : new KeyValue("", 0)));
                }
                if (this.enquiryType == 1 && this.initialvalue.Value != 0) {
                    this.enquiriesToUpdate = response[0].Enquiries;
                    // this.enquiry = this.enquiryToUpdate ;
                    this.showCoPassangerPannel = true;
                    let obj = this.affectedPeople.find(x => x.AffectedPersonId == this.initialvalue.Value);
                    this.affectedId = obj.AffectedId;
                    this.copassangerlistpopulation(obj);
                    // this.affectedPeopleService.getGroupId(this.initialvalue.Value)
                    //   .subscribe((response1: ResponseModel<AffectedPeopleModel>) => {
                    if (obj.GroupId > 0) {
                        // let groupid = response1.Records[0].Passenger.CoPassengerMappings[0].GroupId;
                        this.selectpeoplewithsamegroupid(obj.GroupId, true, true);
                        this.initialgroupId = obj.GroupId;

                    }
                    this.populateconsolidatedcopassangers();
                    this.consolidatedCopassengers.map(x => this.initialgrouidlist.push(x.PassengerId))
                    //   });

                }
                if (this.enquiriesToUpdate.length > 0) {
                    this.communicationlogstoupdateId = _.pluck(_.flatten(_.pluck(this.enquiriesToUpdate, 'CommunicationLogs')), 'InteractionDetailsId');
                }
                else
                    this.communicationlogstoupdateId.push(this.enquiry.CommunicationLogs[0].InteractionDetailsId);

            }
        });

    }



    //co-passenger selection
    selectpeoplewithsamegroupid(groupid: number, isselected: boolean, ismappedersonchanged: boolean): void {
        this.copassengerlistpnr.forEach(x => {
            if (x.GroupId == groupid) {
                x.IsSelected = isselected || (x.IsSelected && ismappedersonchanged);
            }
        });

        this.copassengerlistPassengerForMappedPerson.forEach(x => {
            if (x.GroupId == groupid) {
                x.IsSelected = isselected || (x.IsSelected && ismappedersonchanged);
            }
        });
    }

    copassangerlistpopulation(obj): void {
        this.copassengerlistpnr = [];
        this.affectedPeople.filter(x => x.Pnr == obj.Pnr).map(y => this.copassengerlistpnr.push(Object.assign({}, y)));
        this.copassengerlistpnr = _.without(this.copassengerlistpnr, _.findWhere(this.copassengerlistpnr, { AffectedPersonId: obj.AffectedPersonId }));
        this.copassengerlistPassenger.map(x => this.copassengerlistPassengerForMappedPerson.push(Object.assign({}, x)));
        this.copassengerlistpnr.forEach(x => {
            x.IsSelected = false;
            this.copassengerlistPassengerForMappedPerson = _.without(this.copassengerlistPassengerForMappedPerson, _.findWhere(this.copassengerlistPassengerForMappedPerson, { AffectedPersonId: x.AffectedPersonId }));
        });
        this.copassengerlistPassengerForMappedPerson = _.without(this.copassengerlistPassengerForMappedPerson, _.findWhere(this.copassengerlistPassengerForMappedPerson, { AffectedPersonId: obj.AffectedPersonId }));

    }

    populateconsolidatedcopassangers(): void {
        this.copassengerlistpnr.filter(x => x.IsSelected == true).map(x => {
            let obj = Object.assign({}, x);
            obj.IsSelected = false;
            this.consolidatedCopassengers.push(obj);
        });
        this.copassengerlistPassengerForMappedPerson.filter(x => x.IsSelected == true).map(x => {
            let obj = Object.assign({}, x);
            obj.IsSelected = false;
            this.consolidatedCopassengers.push(obj);
        });
    }















    onNotifyPassenger(message: KeyValue): void {
        this.enquiry.AffectedPersonId = message.Value;
        this.enquiry.AffectedObjectId = 0;
        this.communicationLog.AffectedPersonId = message.Value;
        delete this.communicationLog.AffectedObjectId;
        delete this.enquiry.AffectedObjectId;
        let obj = this.affectedPeople.find(x => x.AffectedPersonId == message.Value);
        this.affectedId = obj.AffectedId;
        this.copassangerlistpopulation(obj);
        // this.copassengerlistPassenger = _.without(this.copassengerlistPassenger, _.findWhere(this.copassengerlistPassenger, { AffectedPersonId: message.Value }));
        this.showCoPassangerPannel = true;
        if (obj.GroupId > 0) {
            this.selectpeoplewithsamegroupid(obj.GroupId, true, true);
        }
        this.populateconsolidatedcopassangers();
        this.resetallcopassangers();
    }



    resetallcopassangers(): void {
        // this.copassengerlistPassenger.forEach(x => x.IsSelected = false);
        this.consolidatedCopassengers = [];
        this.selectedCoPassangers = [];
         this.demands=[];
        this.selectedcountpnr = 0;
        this.selectedcountpassenger = 0;
        this.totalcount = 0;
    }


    onNotifyCrew(message: KeyValue): void {
        this.enquiry.AffectedPersonId = message.Value;
        this.enquiry.AffectedObjectId = 0;
        this.affectedId = this.affectedPeople.find(x => x.AffectedPersonId == message.Value).AffectedId;
        this.communicationLog.AffectedPersonId = message.Value;
        delete this.communicationLog.AffectedObjectId;
    }

    onNotifyCargo(message: KeyValue): void {
        this.enquiry.AffectedObjectId = message.Value;
        this.enquiry.AffectedPersonId = 0;
        this.affectedId = this.affectedObjects.find(x => x.AffectedObjectId == message.Value).AffectedId;
        this.communicationLog.AffectedObjectId = message.Value;
        delete this.communicationLog.AffectedPersonId;
    }








    //set models to save or update
    SetCommunicationLog(requestertype, interactionType, affectedPersonId?: number): CommunicationLogModel[] {
        let communicationLogs = new Array<CommunicationLogModel>();
        let comm: CommunicationLogModel = new CommunicationLogModel();
        comm.InteractionDetailsId = 0;
        comm.InteractionDetailsType = interactionType;
        comm.Answers = this.form.controls['Queries'].value + ' Caller:'
            + this.caller.FirstName + "  " + this.caller.LastName + ' Contact Number:' + this.caller.ContactNumber;
        comm.RequesterName = this.credential.UserName;
        comm.RequesterDepartment = this.currentDepartmentName;
        comm.RequesterType = requestertype;
        comm.CreatedBy = +this.credential.UserId;
        comm.AffectedPersonId = (this.enquiryType == 1 || this.enquiryType == 3) ?
            this.enquiry.AffectedPersonId : null;
        if (affectedPersonId > 0) {
            comm.AffectedPersonId = affectedPersonId;
        }
        comm.AffectedObjectId = (this.enquiryType == 2) ?
            this.enquiry.AffectedObjectId : null;
        comm.Queries = this.enquiry.Queries;
        communicationLogs.push(comm);
        return communicationLogs;
    }

    createDemandTrail(demand: DemandModel): DemandTrailModel[] {
        let demandTrails: DemandTrailModel[] = [];
        let demandTrail: DemandTrailModel = new DemandTrailModel();
        let editedFields = '';
        let answer = '';

        demandTrail.Answers = "";
        demandTrail.IncidentId = demand.IncidentId;
        demandTrail.DemandTypeId = demand.DemandTypeId;
        demandTrail.DemandCode = demand.DemandCode;
        demandTrail.ScheduleTime = demand.ScheduleTime;
        demandTrail.ContactNumber = demand.ContactNumber;
        demandTrail.Priority = demand.Priority;
        demandTrail.RequiredLocation = demand.RequiredLocation;
        demandTrail.RequesterName = demand.RequestedBy;
        demandTrail.RequesterDepartmentName = this.departments.some(x => x.DepartmentId == demand.RequesterDepartmentId) ?
            this.departments.find(x => x.DepartmentId == demand.RequesterDepartmentId).DepartmentName : null;
        demandTrail.RequesterParentDepartmentName = this.departments.some(x => x.DepartmentId == demand.RequesterParentDepartmentId) ?
            this.departments.find(x => x.DepartmentId == demand.RequesterParentDepartmentId).DepartmentName : null;
        demandTrail.TargetDepartmentName = this.departments.find(x => x.DepartmentId == demand.TargetDepartmentId).DepartmentName;
        demandTrail.ApproverDepartmentName = this.departments.some(x => x.DepartmentId == demand.ApproverDepartmentId) ?
            this.departments.find(x => x.DepartmentId == demand.ApproverDepartmentId).DepartmentName : null;
        demandTrail.RequesterType = demand.RequesterType;
        demandTrail.DemandDesc = demand.DemandDesc;
        demandTrail.IsApproved = demand.IsApproved;
        demandTrail.ApprovedDt = demand.ApprovedDt;
        demandTrail.IsCompleted = false;
        demandTrail.ScheduledClose = null;
        demandTrail.IsClosed = false;
        demandTrail.ClosedOn = null;
        demandTrail.IsRejected = false;
        demandTrail.RejectedDate = null;
        demandTrail.DemandStatusDescription = demand.DemandStatusDescription;
        demandTrail.Remarks = demand.Remarks;
        demandTrail.ActiveFlag = "Active";
        demandTrail.CreatedBy = demand.CreatedBy ? demand.CreatedBy : this.createdBy;
        demandTrail.CreatedOn = demand.CreatedOn ? demand.CreatedOn : new Date();

         let date = new Date();
        answer = `<div><p> ${demand.DemandStatusDescription} <strong>Date :</strong>  ${date.toLocaleString()}  </p><div>`;
        answer = answer + '</p><div>';
        demandTrail.Answers = answer;
        demandTrails.push(demandTrail);
        return demandTrails;
    }

    SetDemands(isCallback, isTravelRequest, isAdmin, isCrew, affectedId, affectedPersonId?: number): void {
        if (isCallback || isCrew || isTravelRequest || isAdmin) {
            let demand: DemandModel = new DemandModel();
            const type = isCallback ? 'Call Back' : (isTravelRequest ? 'Travel' : (isAdmin ? 'Admin' : 'Crew'));
            const scheduleTime = isCallback ? GlobalConstants.ScheduleTimeForCallback : (isTravelRequest ? GlobalConstants.ScheduleTimeForTravel
                : (isAdmin ? GlobalConstants.ScheduleTimeForAdmin : GlobalConstants.ScheduleTimeForDemandForCrew));
            demand.AffectedPersonId = (this.enquiryType == 1 || this.enquiryType == 3) ?
                this.enquiry.AffectedPersonId : 0;
            demand.AffectedObjectId = (this.enquiryType == 2) ?
                this.enquiry.AffectedObjectId : 0;
            this.selctedEnquiredPerson = (demand.AffectedPersonId !== 0) ?
                this.affectedPeople.find((x) => x.AffectedPersonId === demand.AffectedPersonId) : null;
            this.selctedEnquiredObject = (demand.AffectedObjectId !== 0) ?
                this.affectedObjects.find((x) => x.AffectedObjectId === demand.AffectedObjectId) : null;
            const personName = (this.selctedEnquiredPerson !== null) ? (this.enquiryType == 1 ?
                this.selctedEnquiredPerson.PassengerName : this.selctedEnquiredPerson.CrewName) : '';
            demand = new DemandModel();
            if (affectedPersonId > 0) {
                demand.AffectedPersonId = affectedPersonId;
            }
            //demand.AffectedPersonId = (this.enquiryType == 1 || this.enquiryType == 3) ?
            //     this.enquiry.AffectedPersonId : null;
            demand.AffectedObjectId = (this.enquiryType == 2) ?
                this.enquiry.AffectedObjectId : null;
            demand.AffectedId = (this.enquiryType == 1 || this.enquiryType == 3) ?
                this.affectedPeople.find((x) => x.AffectedPersonId === demand.AffectedPersonId).AffectedId :
                ((this.enquiryType == 2) ? this.affectedObjects.find((x) => x.AffectedObjectId === demand.AffectedObjectId).AffectedId : 0);
            demand.AWB = (this.enquiryType == 2) ?
                this.affectedObjects.find((x) => x.AffectedObjectId === demand.AffectedObjectId).AWB : null;
            demand.ContactNumber = this.caller.ContactNumber;
            demand.TargetDepartmentId = isCallback ? this.currentDepartmentId : (isTravelRequest ? GlobalConstants.TargetDepartmentTravel
                : (isAdmin ? GlobalConstants.TargetDepartmentAdmin : GlobalConstants.TargetDepartmentCrew));
            demand.RequesterDepartmentId = this.currentDepartmentId;
            demand.RequesterParentDepartmentId = this.departments.find((x) => x.DepartmentId === this.currentDepartmentId).ParentDepartmentId;
            demand.DemandCode = 'DEM-' + UtilityService.UUID();
            demand.DemandDesc = (this.enquiryType == 1 || this.enquiryType == 3) ?
                (type + ' Requested for ' + personName + ' (' + this.selctedEnquiredPerson.TicketNumber + ')') : (type + ' Requested for ' + this.selctedEnquiredObject.AWB + ' (' + this.selctedEnquiredObject.TicketNumber + ')');
            demand.DemandStatusDescription = `New demand by ${this.createdByName} (${this.currentDepartmentName})` ;
            demand.DemandTypeId = GlobalConstants.DemandTypeId;
            demand.CallerId = this.caller.CallerId;
            demand.IncidentId = this.currentIncident;
            demand.IsApproved = true;
            demand.IsClosed = false;
            demand.IsCompleted = false;
            demand.IsRejected = false;
            demand.PDATicketNumber = (this.selctedEnquiredPerson !== null) ? this.selctedEnquiredPerson.TicketNumber
                : (this.selctedEnquiredObject != null ? this.selctedEnquiredObject.TicketNumber : null);
            demand.Priority = GlobalConstants.Priority.find((x) => x.value === '1').caption;
            demand.RequestedBy = this.credential.UserName;
            demand.CreatedBy = +this.credential.UserId;
            demand.RequiredLocation = GlobalConstants.RequiredLocation;
            demand.ScheduleTime = scheduleTime.toString();
            demand.RequesterType = "Others";
            demand.DemandTrails=this.createDemandTrail(demand);
            demand.CommunicationLogs = this.SetCommunicationLog("Demand", GlobalConstants.InteractionDetailsTypeDemand);
            demand.CommunicationLogs[0].Queries = demand.CommunicationLogs[0].Queries + ' Demand Code: ' + demand.DemandCode;
            this.demands.push(demand);
        }
    }

    setenquiryModelforCopassangers(enquiryModel: EnquiryModel): EnquiryModel[] {
        let enquirymodels: EnquiryModel[] = [];
        this.consolidatedCopassengers.map(x => {
            let enquiry: EnquiryModel = new EnquiryModel();
            enquiry.AffectedPersonId = x.AffectedPersonId;
            enquiry.IncidentId = this.currentIncident;
            enquiry.Remarks = '';
            enquiry.CallerId = enquiryModel.CallerId;
            enquiry.Queries = enquiryModel.Queries;
            enquiry.CreatedBy = +this.credential.UserId;
            enquiry.EnquiryType = this.enquiry.EnquiryType;
            enquiry.ExternalInputId = this.enquiry.ExternalInputId;
            enquiry.IsAdminRequest = this.enquiry.IsAdminRequest;
            enquiry.IsCallBack = this.enquiry.IsCallBack;
            enquiry.IsTravelRequest = this.enquiry.IsTravelRequest;
            if (x.IsSelected == true) {
                enquiry.IsAdminRequest = enquiryModel.IsAdminRequest;
                enquiry.IsCallBack = enquiryModel.IsCallBack;
                enquiry.IsTravelRequest = enquiryModel.IsTravelRequest;
            }
            enquiry.CommunicationLogs = this.SetCommunicationLog(GlobalConstants.RequesterTypeEnquiry, GlobalConstants.InteractionDetailsTypeEnquiry, x.AffectedPersonId);
            enquirymodels.push(enquiry);
        });
        return enquirymodels;
    }



    returncopassangerservice(affectedpersonId): Observable<CoPassengerMappingModel[]> {
        let copassangerModels: CoPassengerMappingModel[] = [];
        this.consolidatedCopassengers.map(x => {
            let copssanger: CoPassengerMappingModel = new CoPassengerMappingModel();
            copssanger.PassengerId = x.PassengerId;
            copssanger.GroupId = x.GroupId;
            copassangerModels.push(copssanger);
        });
        let copssanger: CoPassengerMappingModel = new CoPassengerMappingModel();
        let obj = this.affectedPeople.find(x => x.AffectedPersonId == affectedpersonId);
        copssanger.PassengerId = obj.PassengerId;
        copssanger.GroupId = obj.GroupId;
        copassangerModels.push(copssanger);
        let groupids: number[] = [];
        copassangerModels.map(x => groupids.push(x.GroupId));
        groupids = _.unique(groupids);
        if (copssanger.GroupId == 0 && groupids.length == 1) {
            return this.passangerService.setcopassangers(copassangerModels)
                .flatMap(_ => {
                    if (this.pdaenquery.AffectedPersonId != null && this.pdaenquery.AffectedPersonId != obj.AffectedPersonId) {
                        return this.passangerService.deleteoldgroups(this.initialgroupId);
                    }
                    else {
                        return Observable.of(new Array<CoPassengerMappingModel>());
                    }
                });
        }
        else if ((groupids.length == 2 && groupids.some(x => x == 0)) || (groupids.length == 1 && copssanger.GroupId != 0)) {
            let copassengerstoaddingroup: CoPassengerMappingModel[] = [];
            if (groupids.some(x => x == 0)) {
                copassengerstoaddingroup = copassangerModels.filter(x => x.GroupId == 0);
            }
            else {
                copassengerstoaddingroup = copassangerModels;
            }
            copassengerstoaddingroup.forEach(x => x.GroupId = copssanger.GroupId)
            return this.passangerService.updatecopassangerstogroup(copassengerstoaddingroup)
                .flatMap(_ => {
                    if (this.pdaenquery.AffectedPersonId != null && this.pdaenquery.AffectedPersonId != obj.AffectedPersonId) {
                        return this.passangerService.deleteoldgroups(this.initialgroupId);
                    }
                    else {
                        return Observable.of(new Array<CoPassengerMappingModel>());
                    }
                });
        }
        else if (groupids.length >= 2 && !groupids.some(x => x == 0)) {
            let copassangerstoupdate = copassangerModels.filter(x => x.GroupId != copssanger.GroupId);
            copassangerstoupdate.forEach(x => x.GroupId = copssanger.GroupId);
            let copassangergroup: CoPassangerModelsGroupIdsModel = new CoPassangerModelsGroupIdsModel();
            copassangergroup.copassangers = copassangerstoupdate;
            groupids = _.without(groupids, copssanger.GroupId);
            copassangergroup.groupIds = groupids;
            return this.passangerService.deleteoldgroupsandupdatecopassanger(copassangergroup)
                .flatMap(_ => {
                    if (this.pdaenquery.AffectedPersonId != null && (this.pdaenquery.AffectedPersonId != obj.AffectedPersonId) && !groupids.some(x => x == this.initialgroupId)) {
                        return this.passangerService.deleteoldgroups(this.initialgroupId);
                    }
                    else {
                        return Observable.of(new Array<CoPassengerMappingModel>());
                    }
                });
        }
        else {
            return Observable.of(new Array<CoPassengerMappingModel>());
        }
    }


    createDemands(affectedId: number, affectedPersonIds?: number[]): void {
        //   if (affectedPersonIds.length > 0)
        if (this.enquiry.IsCallBack) {
            this.callSetDemands(true, false, false, false, affectedId, affectedPersonIds);
        }
        if (this.enquiry.IsAdminRequest) {
            this.callSetDemands(false, false, true, false, affectedId, affectedPersonIds);
        }
        if (this.enquiry.IsTravelRequest) {
            this.callSetDemands(false, true, false, false, affectedId, affectedPersonIds);
        }
        // if (this.enquiryType === 3) {
        //     this.callSetDemands(false, false, false, true, affectedId, affectedPersonIds);
        // }
        if (this.demands.length !== 0)
            this.demandService.CreateBulk(this.demands)
                .subscribe(() => {
                    this.demands = [];
                    this.communicationLogs = [];
                    this.toastrService.success('Demands Saved successfully.', 'Success', this.toastrConfig);
                    let num = UtilityService.UUID();
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
    }

    callSetDemands(isCallback, isTravelRequest, isAdmin, isCrew, affectedId, affectedPersonIds?: number[]) {
        if (affectedPersonIds != undefined && affectedPersonIds.length > 0) {
            affectedPersonIds.map(x => this.SetDemands(isCallback, isTravelRequest, isAdmin, isCrew, x));
        }
        else {
            this.SetDemands(isCallback, isTravelRequest, isAdmin, isCrew, affectedId);
        }
    }





    ngOnInit(): any {
        this.form = this.formInitialization();

        this.currentIncident = +UtilityService.GetFromSession('CurrentIncidentId');
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
       
        this.credential = UtilityService.getCredentialDetails();
        if (this.enquiryType == 1 || this.enquiryType == 3) {
            this.getPassengersCrews(this.currentIncident);
        }
        else if (this.enquiryType == 2) {
            this.getCargo(this.currentIncident);
        }
        else {
            this.getExternalInput(this.enquiryType);
        }
        this.getDepartments();

        this.enquiry.EnquiryType = this.enquiryTypes.find((x) => x.value == this.enquiryType).caption;
        this.enquiry.ExternalInputId = this.callid;
        this.createdBy = +this.credential.UserId;
         this.createdByName = this.credential.UserName;
    }

    onActionClick(eventArgs: any) {
        console.log(eventArgs);
        let affectedPersonid = eventArgs.selectedItem.Value;
        this.affectedPeopleService.GetCommunicationByPDA(affectedPersonid)
            .subscribe((response: ResponseModel<AffectedPeopleModel>) => {
                let responseModel: AffectedPeopleModel = response.Records[0];
                this.pdaNameForTrail = responseModel.Passenger != null ? responseModel.Passenger.PassengerName.toUpperCase() : '';
                this.pdaNameForTrail = this.pdaNameForTrail ? this.pdaNameForTrail : responseModel.Crew != null ? responseModel.Crew.CrewName.toUpperCase() : '';
                this.ticketNumber = responseModel.TicketNumber;
                this.communications = responseModel.CommunicationLogs;
                this.showCallcenterModal = true;
                // this.childModalForTrail.show();
                this.hideModal = false;

            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }


    formInitialization(): any {
        return new FormGroup({
            EnquiryId: new FormControl(0),
            Queries: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            IsAdminRequest: new FormControl(false),
            IsCallBack: new FormControl(false),
            IsTravelRequest: new FormControl(false)
        });
    }

    cancelModal() {
        // this.childModalForTrail.hide();
        this.hideModal = true;
        this.showCallcenterModal = false;
    }

    nullorwhitecheck(id: number): boolean {
        if ((id == null) || (id == undefined) || (id == 0)) {
            return false
        }
        else {
            return true;
        }
    }

    saveEnquiryDemandCaller(): void {
        this.submitted = true;
        if (this.form.valid && (((this.enquiryType == 1 || this.enquiryType == 3) && this.nullorwhitecheck(this.enquiry.AffectedPersonId)) ||
            (this.enquiryType == 2 && this.nullorwhitecheck(this.enquiry.AffectedObjectId) || (this.enquiryType >=4)))) {
            UtilityService.setModelFromFormGroup<EnquiryModel>(this.enquiry, this.form,
                (x) => x.IsAdminRequest, (x) => x.IsCallBack, (x) => x.IsTravelRequest, (x) => x.Queries);
            this.enquiry.IncidentId = this.currentIncident;
            this.enquiry.Remarks = '';
            this.enquiry.CreatedBy = +this.credential.UserId;
            this.demands = new Array<DemandModel>();
            let communicationlogs = this.SetCommunicationLog(GlobalConstants.RequesterTypeEnquiry, GlobalConstants.InteractionDetailsTypeEnquiry);
            if (!this.isCallrecieved) {

                if (this.enquiryType == 1 || this.enquiryType == 2 || this.enquiryType == 3) {
                    this.enquiry.CommunicationLogs = communicationlogs;
                    this.enquiry.CommunicationLogs[0].Queries = this.enquiry.Queries;
                }
                this.externalInput.deleteAttributes();
                this.externalInput.IsCallRecieved = true;
                this.externalInput.ExternalInputId = this.callid;
                if (this.enquiryType == 1 && this.consolidatedCopassengers.length > 0) {
                    let enquiryModelsToSave: EnquiryModel[] = [];
                    enquiryModelsToSave = this.setenquiryModelforCopassangers(this.enquiry);
                    enquiryModelsToSave.push(this.enquiry);
                    let pdaenquirytoupdate: PDAEnquiryModel = new PDAEnquiryModel();
                    pdaenquirytoupdate.deleteAttributes();
                    pdaenquirytoupdate.AffectedPersonId = this.enquiry.AffectedPersonId;
                    //  this.enquiriesCopassangerscreate(enquiryModelsToSave, this.enquiry.AffectedPersonId);
                    this.enquiryService.CreateBulk(enquiryModelsToSave)
                        .flatMap(_ => this.returncopassangerservice(this.enquiry.AffectedPersonId))
                        .flatMap(_ => this.callcenteronlypageservice.Update(this.externalInput, this.callid))
                        .flatMap(_ => this.callcenteronlypageservice.updatepdaenquiry(pdaenquirytoupdate, this.pdaenquiryid))
                        .subscribe(() => {
                            this.toastrService.success('Enquiry Saved successfully.', 'Success', this.toastrConfig);
                            let num = UtilityService.UUID();
                            this.globalState.NotifyDataChanged('CallRecieved', num);
                            if (this.selectedCoPassangers.length > 0) {
                                let afftedIdstocreateDemand: number[] = [];
                                this.selectedCoPassangers.map(x => afftedIdstocreateDemand.push(x.AffectedPersonId));
                                //   afftedIdstocreateDemand.push(this.) 
                                this.createDemands(this.affectedId, afftedIdstocreateDemand);
                            }
                            else {
                                this.createDemands(this.affectedId);
                            }
                        });

                }
                else {
                    let pdaenquirytoupdate: PDAEnquiryModel = new PDAEnquiryModel();
                    pdaenquirytoupdate.deleteAttributes();
                    if (this.enquiryType != 1 && this.enquiryType != 3) {
                        delete this.enquiry.AffectedPersonId;
                    }
                    if (this.enquiryType != 2) {
                        delete this.enquiry.AffectedObjectId;
                    }
                    pdaenquirytoupdate.AffectedPersonId = this.enquiry.AffectedPersonId;
                    this.enquiryService.Create(this.enquiry)
                        .flatMap(_ => this.callcenteronlypageservice.Update(this.externalInput, this.callid))
                        .flatMap(_ => {
                            if (this.enquiryType == 1) {
                                return this.callcenteronlypageservice.updatepdaenquiry(pdaenquirytoupdate, this.pdaenquiryid)
                            }
                            else {
                                return Observable.of(new PDAEnquiryModel());
                            }
                        })
                        .subscribe(() => {
                            this.form = this.formInitialization();
                            this.toastrService.success('Enquiry Saved successfully.', 'Success', this.toastrConfig);
                            let num = UtilityService.UUID();
                            this.globalState.NotifyDataChanged('CallRecieved', num);
                            this.dataExchange.Publish('clearAutoCompleteInput', '');
                            this.createDemands(this.affectedId);
                        }, (error: any) => {
                            console.log(`Error: ${error}`);
                        });
                }

            }
            else {
                this.enquiryToUpdate.Queries = this.enquiry.Queries;
                if (this.enquiry.AffectedPersonId == null) {
                    this.enquiry.AffectedPersonId = this.initialvalue.Value;
                }
                if (this.enquiryType == 2 || this.enquiryType == 3) {
                    let communicationlogToDeactivate = new CommunicationLogModel();
                    communicationlogToDeactivate.deleteAttributes();
                    communicationlogToDeactivate.InteractionDetailsId = this.communicationlogstoupdateId[0];
                    communicationlogToDeactivate.ActiveFlag = 'InActive';
                    if (this.enquiry.AffectedPersonId && this.enquiry.AffectedPersonId != 0) {
                        this.enquiryToUpdate.AffectedPersonId = this.enquiry.AffectedPersonId;
                        communicationlogs[0].AffectedPersonId = this.enquiry.AffectedPersonId;
                        delete communicationlogs[0].AffectedObjectId;
                    }
                    if (this.enquiry.AffectedObjectId && this.enquiry.AffectedObjectId != 0) {
                        this.enquiryToUpdate.AffectedObjectId = this.enquiry.AffectedObjectId;
                        communicationlogs[0].AffectedObjectId = this.enquiry.AffectedObjectId;
                        delete communicationlogs[0].AffectedPersonId;
                    }
                    delete this.enquiryToUpdate.CommunicationLogs;
                    communicationlogs[0].Queries = this.enquiryToUpdate.Queries;
                    communicationlogs[0].EnquiryId = this.enquiryToUpdate.EnquiryId;
                    this.pdaenquery.AffectedPersonId
                    this.enquiryService.Update(this.enquiryToUpdate, this.enquiryToUpdate.EnquiryId)
                        .flatMap(() => this.communicationlogservice.Update(communicationlogToDeactivate, this.communicationlogstoupdateId[0]))
                        .flatMap(() => this.communicationlogservice.Create(communicationlogs[0]))
                        .flatMap(() => this.demandService.UpdateBulkToDeactivateFromCallId(this.caller.CallerId))
                        .subscribe(() => {
                            this.form = this.formInitialization();
                            this.toastrService.success('Enquiry updated successfully.', 'Success', this.toastrConfig);
                            let num = UtilityService.UUID();
                            this.globalState.NotifyDataChanged('CallRecieved', num);
                            this.createDemands(this.affectedId);

                        })
                }
                else if ((this.enquiryType == 1)) {
                    this.consolidatedCopassengers.length == 0;
                    let enquiryModelsToSave: EnquiryModel[] = [];
                    enquiryModelsToSave = this.setenquiryModelforCopassangers(this.enquiry);
                    this.enquiry.CommunicationLogs = communicationlogs;
                    enquiryModelsToSave.push(this.enquiry);
                    let pdaenquirytoupdate: PDAEnquiryModel = new PDAEnquiryModel();
                    pdaenquirytoupdate.deleteAttributes();
                    pdaenquirytoupdate.AffectedPersonId = this.enquiry.AffectedPersonId;
                    this.enquiryService.UpdateBulkToDeactivateFromExternalId(this.callid)
                        .flatMap(_ => this.demandService.UpdateBulkToDeactivateFromCallId(this.caller.CallerId))
                        .flatMap(_ => this.enquiryService.CreateBulk(enquiryModelsToSave))
                        .flatMap(_ => {
                            if (this.consolidatedCopassengers.length > 0) {
                                return this.returncopassangerservice(this.enquiry.AffectedPersonId);
                            }
                            else if (this.consolidatedCopassengers.length == 0 && this.initialgroupId != 0) {
                                return this.passangerService.deleteoldgroups(this.initialgroupId);
                            }
                            else {
                                return Observable.of(new Array<CoPassengerMappingModel>());
                            }
                        })
                        .flatMap(_ => {
                            if (this.pdaenquery.AffectedPersonId != null && this.pdaenquery.AffectedPersonId != this.enquiry.AffectedPersonId) {
                                return this.callcenteronlypageservice.updatepdaenquiry(pdaenquirytoupdate, this.pdaenquiryid);
                            }
                            else {
                                return Observable.of(new PDAEnquiryModel());
                            }
                        })
                        .subscribe(() => {
                            this.toastrService.success('Enquiry Saved successfully.', 'Success', this.toastrConfig);
                            if (this.selectedCoPassangers.length > 0) {
                                let afftedIdstocreateDemand: number[] = [];
                                this.selectedCoPassangers.map(x => afftedIdstocreateDemand.push(x.AffectedPersonId));
                                //   afftedIdstocreateDemand.push(this.) 
                                this.createDemands(this.affectedId, afftedIdstocreateDemand);
                            }
                            else {
                                this.createDemands(this.affectedId);
                            }
                        });
                }
                //  else if (this.enquiryType == 1 && this.consolidatedCopassengers.length > 0) {
                // let externalInputId: number;
                // let enquiryModelsToSave: EnquiryModel[] = [];
                // enquiryModelsToSave = this.setenquiryModelforCopassangers(this.enquiry);
                // this.enquiry.CommunicationLogs = communicationlogs;
                // enquiryModelsToSave.push(this.enquiry);
                // let copassangerModels: CoPassengerMappingModel[] = [];
                // this.consolidatedCopassengers.map(x => {
                //     let copssanger: CoPassengerMappingModel = new CoPassengerMappingModel();
                //     copssanger.PassengerId = x.PassengerId;
                //     if (this.groupId > 0) {
                //         copssanger.GroupId = this.groupId
                //     }
                //     copassangerModels.push(copssanger);
                // });
                //     this.enquiryService.UpdateBulkToDeactivateFromExternalId(this.callid)
                //         .flatMap(_ => this.demandService.UpdateBulkToDeactivateFromCallId(this.caller.CallerId))
                //         .flatMap(_ => this.enquiryService.CreateBulk(enquiryModelsToSave))
                //         .flatMap(_ => {
                //             if (this.groupId > 0) {
                //                 return this.passangerService.setcopassangers(copassangerModels)
                //             }
                //             else
                //                 return this.passangerService.updatecopassangers(copassangerModels)
                //         })
                //         .flatMap(_ =>if(this.init))
                //         .subscribe(() => {
                //             this.toastrService.success('Enquiry Saved successfully.', 'Success', this.toastrConfig);
                //             if (this.selectedCoPassangers.length > 0) {
                //                 let afftedIdstocreateDemand: number[] = [];
                //                 this.selectedCoPassangers.map(x => afftedIdstocreateDemand.push(x.AffectedPersonId));
                //                 //   afftedIdstocreateDemand.push(this.) 
                //                 this.createDemands(this.affectedId, afftedIdstocreateDemand);
                //             }
                //             else {
                //                 this.createDemands(this.affectedId);
                //             }
                //         });
                // }
                // else {
                //     this.enquiryService.Update(this.enquiryToUpdate, this.enquiryToUpdate.EnquiryId)
                //         .subscribe(() => {
                //             this.form = this.formInitialization();
                //             this.toastrService.success('Enquiry updated successfully.', 'Success', this.toastrConfig);
                //             let num = UtilityService.UUID();
                //             this.globalState.NotifyDataChanged('CallRecieved', num);
                //         });
                // }
            }

        }

        else {
            this.toastrService.info('Form not valid.');

        }


    }



    //ui-copassanger related functions
    selectCopassengerpnr($event: any, copassenger: AffectedPeopleToView): void {
        copassenger.IsSelected = !copassenger.IsSelected;
        this.selectedcountpnr = this.copassengerlistpnr.filter(x => x.IsSelected == true).length;
        this.consolidatedCopassengers = [];

        if (copassenger.GroupId > 0) {
            this.selectpeoplewithsamegroupid(copassenger.GroupId, copassenger.IsSelected, false);

        }
        this.populateconsolidatedcopassangers();

    }

    showListsamepnr(): void {
        this.list1Selected = !this.list1Selected;
    }
    selectCopassengerfrompassenger($event: any, copassenger: AffectedPeopleToView): void {

        copassenger.IsSelected = !copassenger.IsSelected;
        this.selectedcountpassenger = this.copassengerlistPassengerForMappedPerson.filter(x => x.IsSelected == true).length;
        this.consolidatedCopassengers = [];
        if (copassenger.GroupId > 0) {
            this.selectpeoplewithsamegroupid(copassenger.GroupId, copassenger.IsSelected, false);

        }
        this.populateconsolidatedcopassangers();

    }

    showListPassengers(): void {
        this.list2Selected = !this.list2Selected;
    }

    selectCopassengerAll($event: any, copassenger: AffectedPeopleToView): void {
        copassenger.IsSelected = !copassenger.IsSelected;
        this.selectedCoPassangers.push(copassenger);
        this.totalcount = this.consolidatedCopassengers.filter(x => x.IsSelected == true).length;
    }

    showListall(): void {
        this.totallistselected = !this.totallistselected;
    }

}