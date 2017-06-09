import { Component, ViewEncapsulation, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

import { EmergencyLocationService } from './emergencylocation.service';
import { EmergencyLocationModel } from './emergencylocation.model';

import { ResponseModel, DataExchangeService, FileUploadService,
    GlobalConstants, UtilityService, AuthModel } from '../../../../shared';

@Component({
    selector: 'emergencylocation-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/emergencylocation.entry.view.html'
})
export class EmergencyLocationEntryComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    mailAddress: FormControl;
    emergencyLocation: EmergencyLocationModel = new EmergencyLocationModel();
    date: Date = new Date();
    emergencyLocations: EmergencyLocationModel[] = [];
    Action: string;
    numaricRegex = "/^[0-9]{10,10}$/";
    showAdd: boolean;
    credential: AuthModel;
    filesToUpload: File[];
    isDisabledUpload = true;
    isInvalidForm: boolean = false;
    airportStationTemplatePath: string = './assets/static-content/AirportStation.xlsx';
    @ViewChild('inputFileStations') inputFileStations: any

    constructor(private emergencyLocationService: EmergencyLocationService,
        private dataExchange: DataExchangeService<EmergencyLocationModel>,
        private builder: FormBuilder, private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private fileUploadService: FileUploadService,) {
    }

    ngOnInit(): void{
        this.showAdd = false;
        this.isInvalidForm = false;
        this.initiateForm();
        this.credential = UtilityService.getCredentialDetails();
        this.dataExchange.Subscribe("OnEmergencyLocationUpdate", model => {
            this.emergencyLocation = model;
            if(model.ActiveFlag === 'Active')
                this.emergencyLocation.Active = true;
            else
                this.emergencyLocation.Active = false;
            this.Action = "Edit";
            this.showAdd = true;
        });
    }
    
    ngOnDestroy(): void{
        this.dataExchange.Unsubscribe("OnEmergencyLocationUpdate");
    }

     getFileDetails(e: any): void {
        this.filesToUpload = []; 
        this.isDisabledUpload = false;       
        for (var i = 0; i < e.target.files.length; i++) {
            var extension = e.target.files[i].name.split('.').pop();

            if (extension.toLowerCase() == "xls" || extension.toLowerCase() == "xlsx") {                                           
                this.filesToUpload.push(e.target.files[i]);
            }
        }
    }

    Upload(): void{
        if(this.filesToUpload.length)
        {
            let baseUrl = GlobalConstants.EXTERNAL_URL;
            let param = this.credential.UserId;
            this.date = new Date();
            this.fileUploadService.uploadFiles<string>(baseUrl + "./api/MasterDataExportImport/AirportStationUpload/" + param, 
            this.filesToUpload, this.date.toString()).subscribe((result: any) => {
                this.dataExchange.Publish("FileUploadedSuccessfully", new EmergencyLocationModel());
                this.toastrService.success("File Uploaded successfully.", "Success", this.toastrConfig);
                this.initiateForm();
                this.isDisabledUpload = true;
            });

        }

        else
        {
            this.toastrService.error("Invalid File Format!", "Error", this.toastrConfig);     
            this.initiateForm();    
            this.isDisabledUpload = true;   
        }
    }

    onSubmit() {
        delete this.emergencyLocation.Active;        
        if (this.form.valid) {
            this.isInvalidForm = false;
            if (this.emergencyLocation.EmergencyLocationId == 0) {
                this.emergencyLocation.CreatedBy = +this.credential.UserId;
                UtilityService.setModelFromFormGroup<EmergencyLocationModel>(this.emergencyLocation, this.form,
                    x => x.EmergencyLocationId, x => x.IATA, x => x.AirportName, x => x.City);
                   
                if (this.form.controls["isActive"].value != false)
                    this.emergencyLocation.ActiveFlag = "Active";
                else
                    this.emergencyLocation.ActiveFlag = "InActive";

                this.emergencyLocationService.Create(this.emergencyLocation)
                    .subscribe((response: EmergencyLocationModel) => {
                        this.toastrService.success('Emergency Location is created Successfully.', 'Success', this.toastrConfig);
                        this.dataExchange.Publish("EmergencyLocationModelSaved", response);
                        this.initiateForm();
                        this.showAdd = false;
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            }
            else {
                if (this.form.controls["isActive"].value != false)
                    this.emergencyLocation.ActiveFlag = "Active";
                else
                    this.emergencyLocation.ActiveFlag = "InActive";
                this.emergencyLocationService.Update(this.emergencyLocation)
                    .subscribe((response: EmergencyLocationModel) => {
                        this.toastrService.success('Emergency Location is updated Successfully.', 'Success', this.toastrConfig);
                        this.dataExchange.Publish("EmergencyLocationModelUpdated", response);
                        this.initiateForm();
                        this.showAdd = false;
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            }
        }
        else{
            this.isInvalidForm = true
        }
    }

     private initiateForm(): void {
        this.emergencyLocation = new EmergencyLocationModel();
        this.Action = "Save";

        this.form = new FormGroup({
            EmergencyLocationId: new FormControl(0),
            IATA: new FormControl('', [Validators.required]),
            AirportName: new FormControl('', Validators.required),
            City: new FormControl('', Validators.required),
            fileStation: new FormControl(),           
            isActive: new FormControl(false)
        })
    }

    showAddRegion() {
        this.showAdd = true;
        this.initiateForm();

    }
    cancel(): void {
        this.initiateForm();
        this.showAdd = false;
        this.isInvalidForm = false;
    }
}