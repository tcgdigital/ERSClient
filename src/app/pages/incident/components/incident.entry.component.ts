import { Component, ViewEncapsulation, Input, OnInit, OnDestroy, ViewChild, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import {
    FormGroup, FormControl, FormBuilder, Validators
} from '@angular/forms';
import * as moment from 'moment/moment';
import { IncidentModel } from './incident.model';
import { EmergencyTypeModel, EmergencyTypeService } from '../../masterdata';
import { DateTimePickerSelectEventArgs } from '../../../shared/directives/datetimepicker';
import { EmergencyLocationService, EmergencyLocationModel } from '../../masterdata/emergencylocation';
import { IncidentService } from './incident.service';
import {
    OrganizationModel,
    OrganizationService,
    AircraftTypeModel,
    AircraftTypeService
} from '../../shared.components';
import { AffectedModel } from '../../shared.components/affected';
import {
    ResponseModel,
    GlobalStateService,
    GlobalConstants,
    Severity,
    KeyValue,
    KeyVal,
    IncidentStatus,
    InvolvedPartyType,
    UtilityService,
    LocationService,
    Location,
    DateTimePickerOptions,
    DateTimePickerDirective
} from '../../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FlightModel, InvolvePartyModel } from '../../shared.components';
import { IncidentDataExchangeModel } from './incidentDataExchange.model';

@Component({
    selector: 'incident-entry',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../styles/incident.style.scss'],
    templateUrl: '../views/incident.entry.html'
})
export class IncidentEntryComponent implements OnInit, OnDestroy {
    @ViewChild('childModalViewIncident') public childModalViewIncident: ModalDirective;
    @ViewChild('childModalViewWeatherLocation') public childModalViewWeatherLocation: ModalDirective;
    @ViewChild('departuredatepicker') public departuredatepicker: DateTimePickerDirective;
    @ViewChild('arrivaldatepicker') public arrivaldatepicker: DateTimePickerDirective;

    incident: IncidentModel;
    lat: number = 51.678418;
    lng: number = 7.809007;
    zoom: number = 8;
    public submitted: boolean = false;
    public submittedFlight: boolean = false;
    public isBorrowedIncidentPopup: boolean = true;
    currentDepartmentId: number;
    location: Location;
    datePickerOption: any = {
        timepicker: true,
        format12h: true,
        fullDays: false,
        language: 'en',
        hourStep: 1,
        minuteStep: 1
    };
    datepickerOptionED: DateTimePickerOptions = new DateTimePickerOptions();
    datepickerOptionFLT: DateTimePickerOptions = new DateTimePickerOptions();
    datepickerOptionDeparture: DateTimePickerOptions = new DateTimePickerOptions();
    datepickerOptionArrival: DateTimePickerOptions = new DateTimePickerOptions();

    disableIsDrill: boolean;
    disableIsDrillPopup: boolean;
    isFlightRelated: boolean = false;
    isFlightRelatedPopup: boolean = false;
    isOffsite: boolean = false;
    isOffSitePopup: boolean = false;
    buttonValue: string = '';
    incidentModel: IncidentModel = null;
    involvePartyModel: InvolvePartyModel = null;
    incidentDataExchangeModel: IncidentDataExchangeModel = null;
    flightModel: FlightModel = null;
    affectedModel: AffectedModel = null;
    date: Date = new Date();
    activeEmergencyTypes: EmergencyTypeModel[] = [];
    activeOrganizations: OrganizationModel[] = [];
    activeAircraftTypes: AircraftTypeModel[] = [];
    incidentsToPickForReplication: IncidentModel[] = [];
    severities: KeyValue[] = [];
    incidentStatuses: KeyValue[] = [];
    affectedStations: EmergencyLocationModel[] = [];

    public form: FormGroup;
    public formFlight: FormGroup;
    public formPopup: FormGroup;
    public flightClass: {};
    public EmergencyDateCompare: Date;
    public ArrivalDate: Date;
    public DepartureDate: Date;
    public ArrivalDateCompare: Date;
    public DepartureDateCompare: Date;
    public globalStateProxy: GlobalStateService;
    public IsDrillPopup: boolean;
    public isBorrowed: boolean;
    public EmergencyDateLocal: Date;
    public ReportedDateLocal: Date;
    public ScheduleDepartureLocal: Date;
    public ScheduleArrivalLocal: Date;
    public lastCount: string = GlobalConstants.LAST_INCIDENT_PICK_COUNT;
    public EmergencyCountry: string = '';

    /**
     * Creates an instance of IncidentEntryComponent.
     * @param {FormBuilder} formBuilder
     * @param {EmergencyTypeService} emergencyTypeService
     * @param {DataExchangeService<IncidentDataExchangeModel>} dataExchange
     * @param {DataExchangeService<Boolean>} dataExchangeDecision
     *
     * @memberOf IncidentEntryComponent
     */
    constructor(formBuilder: FormBuilder,
        private router: Router,
        private incidentService: IncidentService,
        private emergencyTypeService: EmergencyTypeService,
        private injector: Injector,
        private emergencyLocationService: EmergencyLocationService,
        private locationService: LocationService,
        private toastrConfig: ToastrConfig,
        private toastrService: ToastrService,
        private organizationService: OrganizationService,
        private aircraftTypeService: AircraftTypeService) {
        this.severities = UtilityService.GetKeyValues(Severity);
        this.incidentStatuses = UtilityService.GetKeyValues(IncidentStatus);
        this.affectedStations = [];


        this.datepickerOptionED = new DateTimePickerOptions();
        this.datepickerOptionFLT = new DateTimePickerOptions();

        this.datepickerOptionDeparture = new DateTimePickerOptions();
        this.datepickerOptionArrival = new DateTimePickerOptions();
        // This proxy is created for not create the GlobalStateService in constructor level and reuse the 
        // GlobalStateService.
        this.globalStateProxy = injector.get(GlobalStateService);
    }

    ngOnInit(): void {
        this.submitted = false;
        this.EmergencyDateLocal = new Date();
        this.submittedFlight = false;
        this.flightClass = { 'is-disabled': false };
        this.isBorrowed = false;
        this.datepickerOptionED.maxDate = new Date();
        this.datepickerOptionFLT.position = 'top left';

        this.datepickerOptionDeparture.position = 'top left';
        this.datepickerOptionArrival.position = 'top left';
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.isFlightRelated = false;
        this.disableIsDrill = true;
        this.disableIsDrillPopup = true;
        this.IsDrillPopup = false;
        this.isOffsite = false;
        let d = new Date();
        let tomorrowDate = d.getDate() + 1000;
        d.setDate(tomorrowDate);
        this.EmergencyDateCompare = new Date(d);
        this.ArrivalDateCompare = new Date(d);
        this.DepartureDateCompare = new Date(d);
        this.initiateIncidentModel();
        this.getAllActiveEmergencyTypes();
        this.getAllActiveOrganizations();
        this.getAllActiveAircraftTypes();
        this.resetIncidentForm();
        this.resetFlightForm();
        this.resetIncidentViewForm();

        this.emergencyLocationService.GetAllActiveEmergencyLocations()
            .subscribe((result: ResponseModel<EmergencyLocationModel>) => {
                result.Records.forEach((item: EmergencyLocationModel) => {
                    const emergencyLocationModel: EmergencyLocationModel = new EmergencyLocationModel();
                    emergencyLocationModel.IATA = item.IATA;
                    emergencyLocationModel.AirportName = item.AirportName;
                    emergencyLocationModel.Country = item.Country;
                    this.affectedStations.push(emergencyLocationModel);
                });
            });

    }

    initiateIncidentModel(): void {
        this.incidentModel = new IncidentModel();
        this.incidentModel.IncidentStatus = UtilityService.GetKeyValues(IncidentStatus)[0].Key;
        this.incidentModel.Severity = UtilityService.GetKeyValues(Severity)[0].Key;
    }

    getAllActiveEmergencyTypes(): void {
        this.emergencyTypeService.GetAllActive()
            .subscribe((response: ResponseModel<EmergencyTypeModel>) => {
                this.activeEmergencyTypes = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
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

    getIncidentsToPickForReplication(isFlightRelated: boolean, emergencyTypeId: string): boolean {
        if (emergencyTypeId === '') {
            this.incidentsToPickForReplication = [];
            this.isBorrowed = false;
            return false;
        }
        this.incidentService.GetLastConfiguredCountIncidents()
            .subscribe((response: ResponseModel<IncidentModel>) => {
                this.incidentsToPickForReplication = [];

                let internalCount: number = 0;
                this.isBorrowed = false;
                if (response.Count > 0) {
                    this.isBorrowed = true;
                }
                for (let i: number = 0; internalCount < +this.lastCount; i++) {
                    if (response.Records[i].InvolvedParties.length > 0) {
                        if (isFlightRelated) {
                            if (response.Records[i].InvolvedParties[0].InvolvedPartyType === 'Flight') {
                                this.incidentsToPickForReplication.push(response.Records[i]);
                                internalCount++;
                            }
                        }
                        else {
                            if (response.Records[i].InvolvedParties[0].InvolvedPartyType === 'NonFlight') {
                                this.incidentsToPickForReplication.push(response.Records[i]);
                                internalCount++;
                            }
                        }
                    }
                }

                this.incidentsToPickForReplication.map((item: IncidentModel) => {
                    if (item.ClosedOn != null) {
                        item.EmergencyName = item.EmergencyName + ' (closed)';
                    }
                });
                this.incidentModel.BorrowedIncident = 0;
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

    emergencyTypeChange(emergencyTypeId: string, emergencyTypes: EmergencyTypeModel[]): void {
        const emergencyType: EmergencyTypeModel = emergencyTypes
            .find((x: EmergencyTypeModel) => x.EmergencyTypeId === +emergencyTypeId);
        this.submittedFlight = false;
        if (emergencyType !== undefined && emergencyType.EmergencyCategory === 'FlightRelated') {
            this.isFlightRelated = true;
        }
        else {
            this.isFlightRelated = false;
        }
        this.getIncidentsToPickForReplication(this.isFlightRelated, emergencyTypeId);
    }

    affectedStationChange(IATAVal: string, affectedStations: EmergencyLocationModel[]): void {
        this.EmergencyCountry = '';
        if (IATAVal === 'Offsite') {
            this.isOffsite = true;
            this.EmergencyCountry = '';
            this.form.controls['AffectedCountry'].reset({ value: '', disabled: false });
        }
        else {
            this.isOffsite = false;
            const list: EmergencyLocationModel[] = affectedStations
                .filter((item: EmergencyLocationModel) => item.IATA === IATAVal);
            if (list.length > 0) {
                this.EmergencyCountry = list[0].Country;
                this.form.controls['AffectedCountry'].reset({ value: this.EmergencyCountry, disabled: false });
            }
        }
    }

    organizationChange(organizationId: string, activeOrganizations: OrganizationModel[]): void {
        const activeOrganization: OrganizationModel = activeOrganizations
            .find((x: OrganizationModel) => x.OrganizationId === +organizationId);
    }

    aircraftTypeChange(activeAircraftTypeId: string, activeAircraftTypes: AircraftTypeModel[]): void {
        const activeAircraftType: AircraftTypeModel = activeAircraftTypes
            .find((x: AircraftTypeModel) => x.AircraftTypeId === +activeAircraftTypeId);
    }

    incidentsToPickForReplicationChange(incidentId: string, incidentsToPickForReplication: IncidentModel[]): void {
        if (this.isFlightRelated) {
            this.submittedFlight = false;
            if (incidentId !== '0') {
                this.ResetFlightFields();

                const incidentToPickForReplication: IncidentModel = incidentsToPickForReplication
                    .find((x: IncidentModel) => x.IncidentId === +incidentId);
                this.incidentService.GetFlightInfoFromIncident(+incidentId)
                    .subscribe((itemFlight: FlightModel) => {
                        this.FillFlightFields(itemFlight);
                        jQuery('#Scheduleddeparture, #Scheduledarrival').attr('data-disable', 'true');
                        this.departuredatepicker.toggleControl();
                        this.arrivaldatepicker.toggleControl();
                        this.isBorrowedIncidentPopup = true;
                    });
            }
            else {
                this.ResetFlightFields();
                jQuery('#Scheduleddeparture, #Scheduledarrival').removeAttr('data-disable');
                this.departuredatepicker.toggleControl();
                this.arrivaldatepicker.toggleControl();
            }
        }
    }

    public ResetFlightFields(): void {
        this.flightClass = { 'is-disabled': false };
        this.formFlight = new FormGroup({
            FlightNumber: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            Origin: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            Destination: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            Scheduleddeparture: new FormControl('', [Validators.required]),
            Scheduledarrival: new FormControl('', [Validators.required]),
            FlightTailNumber: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            AircraftTypeId: new FormControl('', [Validators.required]),
            ScheduleddepartureLOC: new FormControl(''),
            ScheduledarrivalLOC: new FormControl('')
        });
    }

    public FillFlightFields(itemFlight: FlightModel): void {
        this.flightClass = { 'is-disabled': true };
        this.ScheduleDepartureLocal = new Date(new Date(itemFlight.DepartureDate).toLocaleString() + ' UTC');
        this.ScheduleArrivalLocal = new Date(new Date(itemFlight.ArrivalDate).toLocaleString() + ' UTC');
        this.formFlight = new FormGroup({
            FlightNumber: new FormControl(itemFlight.FlightNo),
            Origin: new FormControl(itemFlight.OriginCode),
            Destination: new FormControl(itemFlight.DestinationCode),
            Scheduleddeparture: new FormControl(moment(itemFlight.DepartureDate).format('DD-MMM-YYYY hh:mm A')),
            Scheduledarrival: new FormControl(moment(itemFlight.ArrivalDate).format('DD-MMM-YYYY hh:mm A')),
            FlightTailNumber: new FormControl(itemFlight.FlightTaleNumber),
            AircraftTypeId: new FormControl(itemFlight.AircraftTypeId),
            ScheduleddepartureLOC: new FormControl(moment(this.ScheduleDepartureLocal).format('DD-MMM-YYYY hh:mm A')),
            ScheduledarrivalLOC: new FormControl(moment(this.ScheduleArrivalLocal).format('DD-MMM-YYYY hh:mm A'))
        });
    }

    public IsDrill(event: any): void {
        console.log(event.checked);
    }

    checkBoxMouseDown(event: any): void {
        event.stopPropagation();
    }

    ngOnDestroy() { }

    ShowWeatherLocation(): void {
        this.childModalViewWeatherLocation.show();
    }

    hideViewWeatherLocation(): void {
        this.childModalViewWeatherLocation.hide();
    }

    onIncidentViewPreCheck(isInsertShow: boolean): void { }

    resetIncidentForm(): void {
        this.isOffsite = false;
        this.form = new FormGroup({
            IncidentId: new FormControl(0),
            IsDrill: new FormControl(false),
            EmergencyTypeId: new FormControl('', [Validators.required]),
            AffectedStationId: new FormControl('', [Validators.required]),
            AffectedCountry: new FormControl('', [Validators.required]),
            OffsiteDetails: new FormControl(''),
            EmergencyName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            WhatHappened: new FormControl('', [Validators.required]),
            WhereHappened: new FormControl(''),
            OtherConfirmationInformation: new FormControl(''),
            ReportedDate: new FormControl('', [Validators.required]),
            ReportedDateLocal: new FormControl(''),
            Description: new FormControl('', [Validators.required]),
            EmergencyDate: new FormControl('', [Validators.required]),
            Severity: new FormControl(''),
            OrganizationId: new FormControl('', [Validators.required]),
            SourceInformation: new FormControl('', [Validators.maxLength(100)]),
            ReportedByName: new FormControl('', [Validators.maxLength(100)]),
            ReportedByAddress: new FormControl(''),
            ContactOfWitness: new FormControl('', [Validators.maxLength(50)]),
            SenderOfCrisisInformation: new FormControl('', [Validators.maxLength(100)]),
            BorrowedIncident: new FormControl(0),
            EmergencyDateLocal: new FormControl(''),
            IncidentsToPickForReplication: new FormControl('')
        });
    }

    resetFlightForm(): void {
        this.formFlight = new FormGroup({
            FlightNumber: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            Origin: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            Destination: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            Scheduleddeparture: new FormControl('', [Validators.required]),
            Scheduledarrival: new FormControl('', [Validators.required]),
            FlightTailNumber: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            AircraftTypeId: new FormControl('', [Validators.required]),
            ScheduleddepartureLOC: new FormControl(''),
            ScheduledarrivalLOC: new FormControl('')
        });
    }
    cancel(): void {
        this.submitted = false;
        this.resetIncidentForm();
        if (this.isFlightRelated) {
            this.submittedFlight = false;
            this.ResetFlightFields();
        }
    }
    onSubmit(): void {
        this.submitted = true;
        this.submittedFlight = true;
        if (this.form.valid && this.isFlightRelated === false) {
            this.submitted = false;
            this.submittedFlight = false;
            this.proceed();
        }
        else if (this.form.valid && this.formFlight.valid && this.isFlightRelated) {
            this.submitted = false;
            this.submittedFlight = false;
            this.proceed();
        }
    }

    proceed() {
        this.isFlightRelatedPopup = false;
        this.isFlightRelatedPopup = this.isFlightRelated;
        this.createIncidentModel();
        if (this.isFlightRelated) {
            this.createInvolvepartyAndFlight();
        }

        this.fillIncidentDataExchangeModelData(this.incidentModel, this.involvePartyModel,
            this.flightModel, this.affectedModel);
        this.childModalViewIncident.show();
        this.loadDataIncidentViewPopup();
    }

    createInvolvepartyAndFlight() {
        this.createInvolvePartyModel(this.isFlightRelated);
        this.createFlightModel();
        this.createAffectedModel();
    }

    onPOPUPSubmit(values: object): void {
        console.log('Incident Created.');
        console.log(this.incidentDataExchangeModel);
        if (this.incidentDataExchangeModel.IncidentModel.EmergencyLocation === 'Offsite') {
            this.incidentDataExchangeModel.IncidentModel.EmergencyLocation = this.incidentDataExchangeModel.IncidentModel.OffSetLocation;
            delete this.incidentDataExchangeModel.IncidentModel.OffSetLocation;
        }
        this.incidentService.CreateIncident(this.incidentDataExchangeModel.IncidentModel,
            this.incidentDataExchangeModel.IsFlightRelated,
            this.incidentDataExchangeModel.InvolvedPartyModel, this.incidentDataExchangeModel.FLightModel,
            this.incidentDataExchangeModel.AffectedModel)
            .subscribe((response: IncidentModel) => {
                console.log(response);
                UtilityService.SetToSession({ CurrentIncidentId: response.IncidentId });
                console.log('Success');
                this.globalStateProxy.NotifyDataChanged('incidentCreate', response.IncidentId);
                console.log('Success');
                this.router.navigate(['pages/dashboard']);
            }, (error: any) => {
                console.log('Error');
            });
    }

    fillIncidentDataExchangeModelData(incidentModel: IncidentModel,
        involvedPartyModel?: InvolvePartyModel, flightModel?: FlightModel, affectedModel?: AffectedModel): void {
        this.incidentDataExchangeModel = new IncidentDataExchangeModel();
        this.incidentDataExchangeModel.IncidentModel = incidentModel;
        this.incidentDataExchangeModel.InvolvedPartyModel = involvedPartyModel;
        this.incidentDataExchangeModel.FLightModel = flightModel;
        this.incidentDataExchangeModel.AffectedModel = affectedModel;
        this.incidentDataExchangeModel.IsFlightRelated = this.isFlightRelated;
        console.log('Going to the View page.........................');
    }

    resetIncidentViewForm(): void {
        this.formPopup = new FormGroup({
            IncidentId: new FormControl(0),
            IsDrill: new FormControl(false),
            EmergencyTypeIdPopup: new FormControl('0'),
            AffectedStationIdPopup: new FormControl(''),
            AffectedCountryPopup: new FormControl(''),
            EmergencyNamePopup: new FormControl(''),
            WhatHappenedPopup: new FormControl(''),
            WhereHappenedPopup: new FormControl(''),
            OtherConfirmationInformationPopup: new FormControl(''),
            ReportedDatePopup: new FormControl(''),
            ReportedDateLocalPopup: new FormControl(''),
            DescriptionPopup: new FormControl(''),
            EmergencyDatePopup: new FormControl(''),
            SeverityPopup: new FormControl('0'),
            OrganizationIdPopup: new FormControl(''),
            SourceInformationPopup: new FormControl(''),
            ReportedByNamePopup: new FormControl(''),
            ReportedByAddressPopup: new FormControl(''),
            ContactOfWitnessPopup: new FormControl(''),
            SenderOfCrisisInformationPopup: new FormControl(''),
            BorrowedIncidentPopup: new FormControl(''),
            EmergencyDateLocalPopup: new FormControl(''),
            IncidentsToPickForReplication: new FormControl(''),
            FlightNumberPopup: new FormControl(''),
            OriginPopup: new FormControl(''),
            DestinationPopup: new FormControl(''),
            ScheduleddeparturePopup: new FormControl(''),
            ScheduledarrivalPopup: new FormControl(''),
            FlightTailNumberPopup: new FormControl(''),
            AircraftTypeIdPopup: new FormControl(''),
            ScheduleddepartureLOCPopup: new FormControl(''),
            ScheduledarrivalLOCPopup: new FormControl('')
        });
        this.IsDrillPopup = false;
    }

    loadDataIncidentViewPopup() {
        this.disableIsDrill = true;
        this.isOffSitePopup = false;
        if (this.incidentDataExchangeModel.IncidentModel.EmergencyLocation === 'Offsite') {
            this.isOffSitePopup = true;
        }
        this.formPopup = new FormGroup({
            IncidentId: new FormControl(this.incidentDataExchangeModel.IncidentModel.IncidentId),
            EmergencyTypeIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyTypeId),
            AffectedStationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyLocation),
            AffectedCountryPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyCountry),
            OffsiteDetailsPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OffSetLocation),
            EmergencyNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyName),
            WhatHappenedPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhatHappend),
            WhereHappenedPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhereHappend),
            OtherConfirmationInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OtherConfirmationInformation),
            ReportedDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.ReportedDate).format('DD-MMM-YYYY hh:mm a')),
            ReportedDateLocalPopup: new FormControl(moment(this.ReportedDateLocal).format('DD-MMM-YYYY hh:mm a')),
            DescriptionPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Description),
            EmergencyDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).format('DD-MMM-YYYY hh:mm a')),
            EmergencyDateLocalPopup: new FormControl(moment(this.EmergencyDateLocal).format('DD-MMM-YYYY hh:mm a')),
            SeverityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Severity),
            OrganizationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OrganizationId),
            SourceInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SourceInformation),
            ReportedByNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByName),
            ReportedByAddressPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByAddress),
            ContactOfWitnessPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ContactOfWitness),
            SenderOfCrisisInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SenderOfCrisisInformation),
            BorrowedIncidentPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.BorrowedIncident === 0 ? '' : this.incidentDataExchangeModel.IncidentModel.BorrowedIncident)
        });
        this.IsDrillPopup = this.incidentDataExchangeModel.IncidentModel.IsDrill;
        this.isFlightRelatedPopup = false;

        if (this.incidentDataExchangeModel.IsFlightRelated === true) {
            this.formPopup = new FormGroup({
                IncidentId: new FormControl(this.incidentDataExchangeModel.IncidentModel.IncidentId),
                EmergencyTypeIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyTypeId),
                AffectedStationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyLocation),
                AffectedCountryPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyCountry),
                OffsiteDetailsPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OffSetLocation),
                EmergencyNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyName),
                WhatHappenedPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhatHappend),
                WhereHappenedPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhereHappend),
                OtherConfirmationInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OtherConfirmationInformation),
                ReportedDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.ReportedDate).format('DD-MMM-YYYY hh:mm a')),
                ReportedDateLocalPopup: new FormControl(moment(this.ReportedDateLocal).format('DD-MMM-YYYY hh:mm a')),
                DescriptionPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Description),
                EmergencyDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).format('DD-MMM-YYYY hh:mm a')),
                EmergencyDateLocalPopup: new FormControl(moment(this.EmergencyDateLocal).format('DD-MMM-YYYY hh:mm a')),
                SeverityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Severity),
                OrganizationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OrganizationId),
                SourceInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SourceInformation),
                ReportedByNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByName),
                ReportedByAddressPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByAddress),
                ContactOfWitnessPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ContactOfWitness),
                SenderOfCrisisInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SenderOfCrisisInformation),
                BorrowedIncidentPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.BorrowedIncident),
                FlightNumberPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.FlightNo),
                OriginPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.OriginCode),
                DestinationPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.DestinationCode),
                ScheduleddeparturePopup: new FormControl(moment(this.incidentDataExchangeModel.FLightModel.DepartureDate).format('DD-MMM-YYYY hh:mm a')),
                ScheduledarrivalPopup: new FormControl(moment(this.incidentDataExchangeModel.FLightModel.ArrivalDate).format('DD-MMM-YYYY hh:mm a')),
                FlightTailNumberPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.FlightTaleNumber),
                AircraftTypeIdPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.AircraftTypeId),
                ScheduleddepartureLOCPopup: new FormControl(moment(this.ScheduleDepartureLocal).format('DD-MMM-YYYY hh:mm a')),
                ScheduledarrivalLOCPopup: new FormControl(moment(this.ScheduleArrivalLocal).format('DD-MMM-YYYY hh:mm a'))
            });
            this.IsDrillPopup = this.incidentDataExchangeModel.IncidentModel.IsDrill;
            this.isFlightRelatedPopup = true;
        }
        if (this.isBorrowedIncidentPopup) {
            const id: number = +this.formPopup.controls['BorrowedIncidentPopup'].value;
            if (id) {
                const selectedIncident: IncidentModel = this.incidentsToPickForReplication
                    .find((item: IncidentModel) => {
                        return item.IncidentId === id;
                    });

                this.formPopup.controls['BorrowedIncidentPopup'].setValue(selectedIncident.EmergencyName);
            }
        }
    }

    createInvolvePartyModel(isFlightRelated: boolean): void {
        this.involvePartyModel = new InvolvePartyModel();
        this.involvePartyModel.InvolvedPartyId = 0;
        this.involvePartyModel.IncidentId = 0;
        if (isFlightRelated) {
            this.involvePartyModel.InvolvedPartyDesc = 'FlightRelated';
            this.involvePartyModel.InvolvedPartyType = UtilityService.GetKeyValues(InvolvedPartyType)[0].Key;
        }
        else {
            this.involvePartyModel.InvolvedPartyDesc = 'NonFlightRelated';
            this.involvePartyModel.InvolvedPartyType = UtilityService.GetKeyValues(InvolvedPartyType)[1].Key;
        }
        this.involvePartyModel.ActiveFlag = 'Active';
        this.involvePartyModel.CreatedBy = 1;
        this.involvePartyModel.CreatedOn = this.date;
    }

    createAffectedModel(): void {
        this.affectedModel = new AffectedModel();
        this.affectedModel.AffectedId = 0;
        this.affectedModel.InvolvedPartyId = 0;
        this.affectedModel.Severity = this.form.controls['Severity'].value === '' ? null : this.form.controls['Severity'].value;
        this.affectedModel.ActiveFlag = 'Active';
        this.flightModel.CreatedBy = 1;
        this.flightModel.CreatedOn = this.date;
    }

    createFlightModel(): void {
        this.flightModel = new FlightModel();
        this.flightModel.FlightId = 0;
        this.flightModel.InvolvedPartyId = 0;
        this.flightModel.FlightNo = this.formFlight.controls['FlightNumber'].value;
        this.flightModel.OriginCode = this.formFlight.controls['Origin'].value;
        this.flightModel.DestinationCode = this.formFlight.controls['Destination'].value;
        this.flightModel.FlightTaleNumber = this.formFlight.controls['FlightTailNumber'].value;
        this.flightModel.AircraftTypeId = this.formFlight.controls['AircraftTypeId'].value;
        this.flightModel.LoadAndTrimInfo = null;
        this.flightModel.ActiveFlag = 'Active';
        this.flightModel.CreatedBy = 1;
        this.flightModel.CreatedOn = this.date;
    }

    createIncidentModel(): void {
        this.initiateIncidentModel();
        this.incidentModel.IsDrill = this.form.controls['IsDrill'].value;
        this.incidentModel.EmergencyTypeId = Number(this.form.controls['EmergencyTypeId'].value);
        this.incidentModel.IncidentStatus = UtilityService.GetKeyValues(IncidentStatus)[0].Key;
        this.incidentModel.EmergencyName = this.form.controls['EmergencyName'].value;
        this.incidentModel.WhatHappend = this.form.controls['WhatHappened'].value;
        this.incidentModel.WhereHappend = this.form.controls['WhereHappened'].value;
        this.incidentModel.OtherConfirmationInformation = this.form.controls['OtherConfirmationInformation'].value;
        this.incidentModel.ReportedDate = new Date(this.form.controls['ReportedDate'].value);

        this.incidentModel.Description = this.form.controls['Description'].value;
        this.incidentModel.EmergencyDate = new Date(this.form.controls['EmergencyDate'].value);
        this.incidentModel.Severity = this.form.controls['Severity'].value === '' ? null : this.form.controls['Severity'].value;
        if (this.form.controls['AffectedStationId'].value !== 'Offsite') {
            this.incidentModel.EmergencyLocation = this.form.controls['AffectedStationId'].value;
        }
        else {
            this.incidentModel.EmergencyLocation = this.form.controls['AffectedStationId'].value;
            this.incidentModel.OffSetLocation = this.form.controls['OffsiteDetails'].value;
        }
        this.incidentModel.EmergencyCountry = this.form.controls['AffectedCountry'].value;
        this.incidentModel.OrganizationId = +this.form.controls['OrganizationId'].value;
        this.incidentModel.SourceInformation = this.form.controls['SourceInformation'].value;
        this.incidentModel.ReportedByName = this.form.controls['ReportedByName'].value;
        this.incidentModel.ReportedByAddress = this.form.controls['ReportedByAddress'].value;
        this.incidentModel.ContactOfWitness = this.form.controls['ContactOfWitness'].value;
        this.incidentModel.SenderOfCrisisInformation = this.form.controls['SenderOfCrisisInformation'].value;
        if (+this.form.controls['BorrowedIncident'].value !== 0) {
            this.incidentModel.BorrowedIncident = +this.form.controls['BorrowedIncident'].value;
        }
        else {
            this.incidentModel.BorrowedIncident = null;
        }

        this.incidentModel.IsSubmitted = false;
        this.incidentModel.IsSaved = false;
        this.incidentModel.DepartmentId = Number(this.currentDepartmentId);
        this.incidentModel.ClosedBy = null;
        this.incidentModel.ClosedOn = null;
        this.incidentModel.ReOpenBy = null;
        this.incidentModel.ReOpenOn = null;
        this.incidentModel.ReClosedBy = null;
        this.incidentModel.ReClosedOn = null;
        this.incidentModel.SubmittedBy = null;
        this.incidentModel.SubmittedOn = null;
        this.incidentModel.SavedBy = null;
        this.incidentModel.SavedOn = null;
        this.incidentModel.ActiveFlag = 'Active';
        this.incidentModel.CreatedBy = 1;
        this.incidentModel.CreatedOn = this.date;
    }

    hideIncidentView(): void {
        this.childModalViewIncident.hide();
    }

    public dateTimeSet(date: DateTimePickerSelectEventArgs, controlName: string): void {
        if (controlName === 'EmergencyDate') {
            this.form.get('EmergencyDate')
                .setValue(moment(date.SelectedDate).format('DD-MMM-YYYY hh:mm A'));
            this.EmergencyDateLocal = new Date(date.SelectedDate.toLocaleString() + ' UTC');
            this.form.get('EmergencyDateLocal')
                .setValue(moment(this.EmergencyDateLocal).format('DD-MMM-YYYY hh:mm A'));
        }
        else if (controlName === 'ReportedDate') {
            this.form.get('ReportedDate')
                .setValue(moment(date.SelectedDate).format('DD-MMM-YYYY hh:mm A'));
            this.ReportedDateLocal = new Date(date.SelectedDate.toLocaleString() + ' UTC');
            this.form.get('ReportedDateLocal')
                .setValue(moment(this.ReportedDateLocal).format('DD-MMM-YYYY hh:mm A'));
        }
        else if (controlName === 'Scheduleddeparture') {
            this.formFlight.get('Scheduleddeparture')
                .setValue(moment(date.SelectedDate).format('DD-MMM-YYYY hh:mm A'));
            this.ScheduleDepartureLocal = new Date(date.SelectedDate.toLocaleString() + ' UTC');
            this.formFlight.get('ScheduleddepartureLOC')
                .setValue(moment(this.ScheduleDepartureLocal).format('DD-MMM-YYYY hh:mm A'));
            this.arrivaldatepicker.updateConfig({
                minDate: new Date(date.SelectedDate.toLocaleString())
            });
        }
        else if (controlName === 'Scheduledarrival') {
            this.formFlight.get('Scheduledarrival')
                .setValue(moment(date.SelectedDate).format('DD-MMM-YYYY hh:mm A'));
            this.ScheduleArrivalLocal = new Date(date.SelectedDate.toLocaleString() + ' UTC');
            this.formFlight.get('ScheduledarrivalLOC')
                .setValue(moment(this.ScheduleArrivalLocal).format('DD-MMM-YYYY hh:mm A'));
        }
    }
}