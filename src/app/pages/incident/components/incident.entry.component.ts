import { Component, ViewEncapsulation, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, AbstractControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { IncidentModel } from './incident.model';
import { EmergencyTypeModel, EmergencyTypeService } from '../../masterdata/emergencytype';

import { 
    ResponseModel,
    DataExchangeService,
    Severity, 
    KeyValue, 
    IncidentStatus, 
    InvolvedPartyType,
    UtilityService 
} from '../../../shared';
import { InvolvedPartyModel } from '../../masterdata/involvedParty';
import { FlightModel } from '../../masterdata/flight';
import { IncidentDataExchangeModel } from './incidentDataExchange.model';

@Component({
    selector: 'incident-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/incident.entry.html'
})
export class IncidentEntryComponent implements OnInit {
    @Input() DepartmentId: any;
    showInsert: boolean = null;
    isFlightRelated: boolean = false;
    buttonValue: String = "";
    incidentModel: IncidentModel = null;
    involvedPartyModel: InvolvedPartyModel = null;
    incidentDataExchangeModel: IncidentDataExchangeModel = null;
    flightModel: FlightModel = null;
    date: Date = new Date();
    activeEmergencyTypes: EmergencyTypeModel[] = [];
    severities: KeyValue[] = [];
    incidentStatuses: KeyValue[] = [];
    public form: FormGroup;
    
    constructor(formBuilder: FormBuilder,
        private emergencyTypeService: EmergencyTypeService,
        private dataExchange: DataExchangeService<IncidentDataExchangeModel>,
        private dataExchangeDecision: DataExchangeService<Boolean>) {
        this.showInsert = true;
        this.severities = UtilityService.GetKeyValues(Severity);
        this.incidentStatuses = UtilityService.GetKeyValues(IncidentStatus);
    }

    initiateIncidentModel(): void {
        this.incidentModel = new IncidentModel();
        this.incidentModel.IncidentStatus = UtilityService.GetKeyValues(IncidentStatus)[0].Key;
        this.incidentModel.Severity = UtilityService.GetKeyValues(Severity)[0].Key;

        this.incidentModel.ActiveFlag = 'Active';
        this.incidentModel.CreatedBy = 1;
        this.incidentModel.CreatedOn = this.date;
    }

    getAllActiveEmergencyTypes(): void {
        this.emergencyTypeService.GetAll()
            .subscribe((response: ResponseModel<EmergencyTypeModel>) => {
                this.activeEmergencyTypes = response.Records;
                console.log(this.activeEmergencyTypes);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }
    
    emergencyTypeChange(emergencyTypeId: string, emergencyTypes: EmergencyTypeModel[]): void {
        console.log(emergencyTypeId);

        let emergencyType: EmergencyTypeModel = emergencyTypes
            .find((x: EmergencyTypeModel) => x.EmergencyTypeId === +emergencyTypeId);
        console.log(emergencyType);
        this.isFlightRelated = false;
        if (emergencyType != undefined && emergencyType.EmergencyCategory == 'FlightRelated') {
            this.isFlightRelated = true;
        }

    }

    IsDrill(event: any): void {
        console.log(event.checked);
    }

    ngOnInit(): any {
        console.log('Hello ' + this.DepartmentId);
        //this.showAdd = true;
        this.initiateIncidentModel();
        console.log(this.severities);
        console.log(this.incidentStatuses);
        this.getAllActiveEmergencyTypes();
        this.resetIncidentForm();
        this.dataExchangeDecision.Subscribe("incidentViewPreCheck", model => this.onIncidentViewPreCheck(model));
    }

    onIncidentViewPreCheck(isInsertShow: Boolean): void {

        this.showInsert = true;

    }

    resetIncidentForm(): void {
        console.log(this.activeEmergencyTypes);
        this.form = new FormGroup({
            IncidentId: new FormControl(0),
            IsDrill: new FormControl(false),
            EmergencyTypeId: new FormControl('0'),
            //IncidentStatus: new FormControl(this.incidentStatuses[0].Value),
            EmergencyName: new FormControl(''),
            AlertMessage: new FormControl(''),
            Description: new FormControl(''),
            ClosureNote: new FormControl(''),
            //EmergencyDate: new FormControl(''),
            Severity: new FormControl('0'),
            EmergencyLocation: new FormControl(''),
            Remarks: new FormControl(''),
            FlightNumber: new FormControl(''),
            Origin: new FormControl(''),
            Destination: new FormControl(''),
            Scheduleddeparture: new FormControl(''),
            Scheduledarrival: new FormControl(''),
            FlightTailNumber: new FormControl('')
        });
    }

    onSubmit(values: Object): void {
        if (this.form.controls['EmergencyTypeId'].value != '0' && this.form.controls['Severity'].value != '0') {
            this.createIncidentModel();
            console.log(this.incidentModel);
            if (this.isFlightRelated) {
                this.createInvolvedPartyModel(this.isFlightRelated);
                console.log(this.involvedPartyModel);
                this.createFlightModel();
                console.log(this.flightModel);
            }
            console.log('filling the incident and involved party and flight records.....');
            this.showInsert = false;
            this.fillIncidentDataExchangeModelData(this.incidentModel, this.involvedPartyModel, this.flightModel);
        }
        else {
            if (this.form.controls['EmergencyTypeId'].value == '0') {
                console.log('Please select Emergency type');
            }
            if (this.form.controls['Severity'].value == '0') {
                console.log('Please select Severity');
            }
        }

    }
    cancel(): void {
        this.resetIncidentForm();

    }

    fillIncidentDataExchangeModelData(incidentModel: IncidentModel,
        involvedPartyModel?: InvolvedPartyModel, flightModel?: FlightModel): void {
        this.incidentDataExchangeModel = new IncidentDataExchangeModel();
        this.incidentDataExchangeModel.IncidentModel = incidentModel;
        this.incidentDataExchangeModel.InvolvedPartyModel = involvedPartyModel;
        this.incidentDataExchangeModel.FLightModel = flightModel;
        this.incidentDataExchangeModel.IsFlightRelated = this.isFlightRelated;
        console.log('Going to the View page.........................');
        this.dataExchangeDecision.Publish("instructionToCloseInsertOpenViewCommand", true);
        this.dataExchange.Publish("incidentCreatedPreCheck", this.incidentDataExchangeModel);
    }

    createInvolvedPartyModel(isFlightRelated: boolean): void {
        this.involvedPartyModel = new InvolvedPartyModel();
        this.involvedPartyModel.InvolvedPartyId = 0;
        this.involvedPartyModel.IncidentId = 0;
        if (isFlightRelated) {
            this.involvedPartyModel.InvolvedPartyDesc = 'FlightRelated';
            this.involvedPartyModel.InvolvedPartyType = UtilityService.GetKeyValues(InvolvedPartyType)[0].Key;
        }
        else {
            this.involvedPartyModel.InvolvedPartyDesc = 'NonFlightRelated';
            this.involvedPartyModel.InvolvedPartyType = UtilityService.GetKeyValues(InvolvedPartyType)[1].Key;
        }
        this.involvedPartyModel.ActiveFlag = 'Active';
        this.involvedPartyModel.CreatedBy = 1;
        this.involvedPartyModel.CreatedOn = this.date;
    }

    createFlightModel(): void {
        this.flightModel = new FlightModel();
        this.flightModel.FlightId = 0;
        this.flightModel.InvolvedPartyId = 0;
        this.flightModel.FlightNo = this.form.controls['FlightNumber'].value;

        this.flightModel.OriginCode = this.form.controls['Origin'].value;
        this.flightModel.DestinationCode = this.form.controls['Destination'].value;
        this.flightModel.DepartureDate = this.date;
        this.flightModel.ArrivalDate = this.date;
        this.flightModel.FlightTaleNumber = this.form.controls['FlightTailNumber'].value;
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
        this.incidentModel.AlertMessage = this.form.controls['AlertMessage'].value;
        this.incidentModel.Description = this.form.controls['Description'].value;
        this.incidentModel.ClosureNote = this.form.controls['ClosureNote'].value;
        this.incidentModel.EmergencyDate = this.date;
        this.incidentModel.Severity = this.form.controls['Severity'].value;
        this.incidentModel.EmergencyLocation = this.form.controls['EmergencyLocation'].value;
        this.incidentModel.IsSubmitted = true;
        this.incidentModel.IsSaved = true;
        this.incidentModel.Remarks = this.form.controls['Remarks'].value;
        this.incidentModel.DepartmentId = Number(this.DepartmentId);
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
}