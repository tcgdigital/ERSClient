import {
    Component, ViewEncapsulation,
    OnInit, SimpleChange, OnDestroy, ViewChild
} from '@angular/core';
import * as moment from 'moment/moment';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { EmergencyTypeModel, EmergencyTypeService } from '../masterdata';
import { EmergencyLocationService, EmergencyLocationModel } from '../masterdata/emergencylocation';
import { IncidentModel, IncidentService, IncidentDataExchangeModel } from '../incident';
import {
    FlightModel,
    FlightService,
    InvolvePartyModel,
    InvolvePartyService,
    OrganizationModel,
    OrganizationService,
    AircraftTypeModel,
    AircraftTypeService
} from '../shared.components';
import {
    FormGroup, FormControl, FormBuilder, Validators,
    ReactiveFormsModule
} from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import {
    ITabLinkInterface, GlobalStateService, UtilityService, KeyValue, ResponseModel, Severity,
    KeyVal,
    IncidentStatus,
    InvolvedPartyType,
    DataExchangeService,
    LocationService,
    Location,
    DateTimePickerOptions
} from '../../shared';
import { ArchiveListService } from './archive.dashboard.list.service';

@Component({
    selector: 'archive-dashboard-list',
    styleUrls: ['./archive.dashboard.list.style.scss'],
    templateUrl: './archive.dashboard.list.view.html',
    encapsulation: ViewEncapsulation.None,
})
export class ArchiveDashboardListComponent implements OnInit, OnDestroy {
    @ViewChild('childModalViewClosedIncident') public childModalViewClosedIncident: ModalDirective;

    public closedCrisises: any[];
    activeEmergencyTypes: EmergencyTypeModel[] = [];
    affectedStations: EmergencyLocationModel[] = [];
    public formPopup: FormGroup;
    disableIsDrillPopup: boolean;
    severities: KeyValue[] = [];
    isOffSetPopup: boolean = false;
    incidentModel: IncidentModel = null;
    isFlightRelated: boolean = false;
    isFlightRelatedPopup: boolean = false;
    incidentDataExchangeModel: IncidentDataExchangeModel = null;
    currentIncidentId: number;
    public IsDrillPopup: boolean;
    activeOrganizations: OrganizationModel[] = [];
    activeAircraftTypes: AircraftTypeModel[] = [];
    incidentsToPickForReplication: IncidentModel[] = [];
    public useLink: boolean;
    public EmergencyDateLocal: Date;
    public ReportedDateLocal: Date;
    public ScheduleDepartureLocal: Date;
    public ScheduleArrivalLocal: Date;
    public BorrowedIncidentName: string;

    constructor(formBuilder: FormBuilder,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private archiveListService: ArchiveListService,
        private emergencyTypeService: EmergencyTypeService,
        private dataExchange: DataExchangeService<IncidentDataExchangeModel>,
        private emergencyLocationService: EmergencyLocationService,
        private incidentService: IncidentService,
        private involvePartyService: InvolvePartyService,
        private flightService: FlightService,
        private globalState: GlobalStateService,
        private organizationService: OrganizationService,
        private aircraftTypeService: AircraftTypeService,
        private router: Router) {
        this.closedCrisises = [];
        this.affectedStations = [];
        this.severities = UtilityService.GetKeyValues(Severity);
    }

    public ngOnInit(): void {
        this.useLink = false;
        this.getAllActiveEmergencyTypes();
        this.getAllActiveOrganizations();
        this.getAllActiveAircraftTypes();
        this.isFlightRelated = false;
        this.disableIsDrillPopup = true;
        this.isOffSetPopup = false;
        this.resetIncidentViewForm();
        this.GetAllClosedIncidents();
        this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
    }

    public IsReopenCheckedChange(event: any, closedCrisis: IncidentModel): void {
        closedCrisis.isReopen = event.checked;
    }

    public GetAllClosedIncidents(): void {
        this.archiveListService.GetAllClosedIncidents()
            .subscribe((closedIncident: ResponseModel<IncidentModel>) => {
                closedIncident.Records.forEach((itemIncident: IncidentModel) => {
                    if (itemIncident.ReOpenBy != null && itemIncident.ReOpenOn != null
                        && itemIncident.ReClosedBy == null && itemIncident.ReClosedOn == null) {
                        itemIncident.isReopen = true;
                    }
                    else {
                        itemIncident.isReopen = false;
                    }

                    const editIncident: KeyValue = { Key: itemIncident.EmergencyName, Value: itemIncident.IncidentId };
                    itemIncident['IncidentView'] = editIncident;
                    this.closedCrisises.push(itemIncident);
                });
            });
    }

    public hideIncidentView(): void {
        this.childModalViewClosedIncident.hide();
    }

    public loadDataIncidentViewPopup(): void {
        const offsetVal: string = '';
        this.disableIsDrillPopup = true;

        this.EmergencyDateLocal = new Date(new Date(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).toLocaleString() + ' UTC');
        this.ReportedDateLocal = new Date(new Date(this.incidentDataExchangeModel.IncidentModel.ReportedDate).toLocaleString() + ' UTC');


        this.formPopup = new FormGroup({
            IncidentId: new FormControl(this.incidentDataExchangeModel.IncidentModel.IncidentId),
            OrganizationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OrganizationId),
            EmergencyTypeIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyTypeId),
            AffectedStationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyLocation),
            EmergencyDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).format('DD-MM-YYYY h:mm a')),
            EmergencyDateLocalPopup: new FormControl(moment(this.EmergencyDateLocal).format('DD-MM-YYYY h:mm a')),
            EmergencyNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyName),
            DescriptionPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Description),
            WhatHappendPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhatHappend),
            WhereHappendPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhereHappend),
            OtherConfirmationInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OtherConfirmationInformation),
            SourceInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SourceInformation),
            ReportedByNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByName),
            ReportedByAddressPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByAddress),
            ContactOfWitnessPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ContactOfWitness),
            SenderOfCrisisInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SenderOfCrisisInformation),
            ReportedDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.ReportedDate).format('DD-MM-YYYY h:mm a')),
            ReportedDateLocalPopup: new FormControl(moment(this.ReportedDateLocal).format('DD-MM-YYYY h:mm a')),
            SeverityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Severity),
            BorrowedIncidentPopup: new FormControl(this.BorrowedIncidentName),
        });
        this.IsDrillPopup = this.incidentDataExchangeModel.IncidentModel.IsDrill;

        this.isFlightRelatedPopup = false;
        if (this.incidentDataExchangeModel.FLightModel !== undefined) {

            this.ScheduleDepartureLocal = new Date(new Date(this.incidentDataExchangeModel.FLightModel.DepartureDate).toLocaleString() + ' UTC');
            this.ScheduleArrivalLocal = new Date(new Date(this.incidentDataExchangeModel.FLightModel.ArrivalDate).toLocaleString() + ' UTC');


            this.formPopup = new FormGroup({
                IncidentId: new FormControl(this.incidentDataExchangeModel.IncidentModel.IncidentId),
                OrganizationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OrganizationId),
                EmergencyTypeIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyTypeId),
                AffectedStationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyLocation),
                EmergencyDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).format('DD-MM-YYYY h:mm a')),
                EmergencyDateLocalPopup: new FormControl(moment(this.EmergencyDateLocal).format('DD-MM-YYYY h:mm a')),
                EmergencyNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyName),
                DescriptionPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Description),
                WhatHappendPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhatHappend),
                WhereHappendPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhereHappend),
                OtherConfirmationInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OtherConfirmationInformation),
                SourceInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SourceInformation),
                ReportedByNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByName),
                ReportedByAddressPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByAddress),
                ContactOfWitnessPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ContactOfWitness),
                SenderOfCrisisInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SenderOfCrisisInformation),
                ReportedDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.ReportedDate).format('DD-MM-YYYY h:mm a')),
                ReportedDateLocalPopup: new FormControl(moment(this.ReportedDateLocal).format('DD-MM-YYYY h:mm a')),
                SeverityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Severity),
                BorrowedIncidentPopup: new FormControl(this.BorrowedIncidentName),

                FlightNumberPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.FlightNo),
                OriginPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.OriginCode),
                DestinationPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.DestinationCode),
                ScheduleddeparturePopup: new FormControl(moment(this.incidentDataExchangeModel.FLightModel.DepartureDate).format('DD-MM-YYYY h:mm a')),
                ScheduleddepartureLOCPopup: new FormControl(moment(this.ScheduleDepartureLocal).format('DD-MM-YYYY h:mm a')),
                ScheduledarrivalPopup: new FormControl(moment(this.incidentDataExchangeModel.FLightModel.ArrivalDate).format('DD-MM-YYYY h:mm a')),
                ScheduledarrivalLOCPopup: new FormControl(moment(this.ScheduleArrivalLocal).format('DD-MM-YYYY h:mm a')),
                FlightTailNumberPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.FlightTaleNumber),
                AircraftTypeIdPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.AircraftTypeId)
            });
            this.IsDrillPopup = this.incidentDataExchangeModel.IncidentModel.IsDrill;
            this.isFlightRelatedPopup = true;
        }
        this.childModalViewClosedIncident.show();
    }

    getAllActiveEmergencyTypes(): void {
        this.emergencyTypeService.GetAllActive()
            .subscribe((response: ResponseModel<EmergencyTypeModel>) => {
                this.activeEmergencyTypes = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    public resetIncidentViewForm(): void {
        this.formPopup = new FormGroup({
            IncidentId: new FormControl(0),
            OrganizationIdPopup: new FormControl(''),
            EmergencyTypeIdPopup: new FormControl('0'),
            AffectedStationIdPopup: new FormControl('0'),
            EmergencyDatePopup: new FormControl(''),
            EmergencyDateLocalPopup: new FormControl(''),
            EmergencyNamePopup: new FormControl(''),
            DescriptionPopup: new FormControl(''),
            WhatHappendPopup: new FormControl(''),
            WhereHappendPopup: new FormControl(''),
            OtherConfirmationInformationPopup: new FormControl(''),
            SourceInformationPopup: new FormControl(''),
            ReportedByNamePopup: new FormControl(''),
            ReportedByAddressPopup: new FormControl(''),
            ContactOfWitnessPopup: new FormControl(''),
            SenderOfCrisisInformationPopup: new FormControl(''),
            ReportedDatePopup: new FormControl(''),
            ReportedDateLocalPopup: new FormControl(''),
            SeverityPopup: new FormControl('0'),
            BorrowedIncidentPopup: new FormControl(''),

            FlightNumberPopup: new FormControl(''),
            OriginPopup: new FormControl(''),
            DestinationPopup: new FormControl(''),
            ScheduleddeparturePopup: new FormControl(''),
            ScheduleddepartureLOCPopup: new FormControl(''),
            ScheduledarrivalPopup: new FormControl(''),
            ScheduledarrivalLOCPopup: new FormControl(''),
            FlightTailNumberPopup: new FormControl(''),
            AircraftTypeIdPopup: new FormControl(''),
        });
        this.IsDrillPopup = false;
    }

    public onViewIncidentClick(incidentId: number): void {
        this.incidentService.GetIncidentByIncidentId(incidentId)
            .subscribe((item: IncidentModel) => {
                this.incidentDataExchangeModel = new IncidentDataExchangeModel();
                this.incidentDataExchangeModel.IsFlightRelated = false;
                this.incidentDataExchangeModel.IncidentModel = new IncidentModel();
                this.incidentDataExchangeModel.IncidentModel = item;

                if (item.InvolvedParties.length > 0) {
                    this.incidentDataExchangeModel.InvolvedPartyModel = new InvolvePartyModel();
                    this.incidentDataExchangeModel.InvolvedPartyModel = item.InvolvedParties[0];
                    if (item.InvolvedParties[0].Flights.length > 0) {
                        this.incidentDataExchangeModel.IsFlightRelated = true;
                        this.incidentDataExchangeModel.FLightModel = new FlightModel();
                        this.incidentDataExchangeModel.FLightModel = item.InvolvedParties[0].Flights[0];
                    }
                }
                if (this.incidentDataExchangeModel.IncidentModel.BorrowedIncident != null) {
                    this.fetchBorrowedIncident(this.incidentDataExchangeModel.IncidentModel.BorrowedIncident);
                }
                else {
                    this.loadDataIncidentViewPopup();
                }
            });
    }

    public fetchBorrowedIncident(incidentId: number): void {
        this.incidentService.GetIncidentByIncidentId(incidentId)
            .subscribe((item: IncidentModel) => {
                this.BorrowedIncidentName = item.EmergencyName;
                this.loadDataIncidentViewPopup();
            });
    }

    getAllActiveOrganizations(): void {
        this.organizationService.GetAllActiveOrganizations()
            .subscribe((response: ResponseModel<OrganizationModel>) => {
                this.activeOrganizations = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    getAllActiveAircraftTypes(): void {
        this.aircraftTypeService.GetAllActiveAircraftTypes()
            .subscribe((response: ResponseModel<AircraftTypeModel>) => {
                this.activeAircraftTypes = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    public ngOnDestroy(): void { }

    public onSubmitClosedCrisis(closedCrisisList: IncidentModel[]): void {
        // We collect all closed crisis
        const reopenedCrisis = closedCrisisList.filter((item: IncidentModel) => {
            return item.isReopen === true;
        });
        if (reopenedCrisis.length > 0) {
            const objectLiteral: string = JSON.stringify(reopenedCrisis);
            const deepCopyIncident: IncidentModel[] = JSON.parse(objectLiteral);
            const totalReopendCrisis: IncidentModel[] = deepCopyIncident.map((item: IncidentModel) => {
                item.ReOpenBy = +UtilityService.GetFromSession('CurrentUserId');
                item.ReOpenOn = new Date();
                item.EmergencyType = null;
                item.ReClosedBy = null;
                item.ReClosedOn = null;
                return item;
            });
            // Again call to the database for update the reopened one.
            this.archiveListService.CreateBulkInsertClosedIncident(totalReopendCrisis)
                .subscribe((result: IncidentModel[]) => {
                    this.toastrService.success('Incident status updated successfully.', 'Archieve Crisis', this.toastrConfig);
                });
        }
    }

    private onArchivedIncidentClick(incidentId: number): void {
        UtilityService.SetToSession({ ArchieveIncidentId: incidentId });
        this.router.navigate(['pages/archivedashboard']);
    }
}
