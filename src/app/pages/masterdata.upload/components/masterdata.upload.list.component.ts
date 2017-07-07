import {
    Component, ViewEncapsulation, Input,
    OnInit, OnDestroy, AfterContentInit, ViewChild
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators, ReactiveFormsModule
} from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

import {
    ResponseModel, DataExchangeService,
    UtilityService, GlobalConstants,
    FileUploadService, KeyValue, GlobalStateService
} from '../../../shared';
import { FileData } from '../../../shared/models';

@Component({
    selector: 'masterdatauploadlist-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/masterdata.upload.list.view.html'
})

export class MasterDataUploadListComponent implements OnInit, OnDestroy {
    @Input() DepartmentId: number;
    @Input() IncidentId: number;
    @Input() CreatedBy: string;
    @ViewChild('inputFilePax') inputFilePax: any;
    @ViewChild('inputFileCrew') inputFileCrew: any;
    @ViewChild('inputFileCargo') inputFileCargo: any;

    @ViewChild('validPassengersModal') public validPassengersModal: ModalDirective;
    @ViewChild('validCargoModal') public validCargoModal: ModalDirective;
    @ViewChild('validCrewModal') public validCrewModal: ModalDirective;
    @ViewChild('invalidCrewModal') public invalidCrewModal: ModalDirective;
    @ViewChild('invalidPassengersModal') public invalidPassengersModal: ModalDirective;
    @ViewChild('invalidCargoModal') public invalidCargoModal: ModalDirective;

    passengerTemplatePath: string = './assets/static-content/Passengers.xlsx';
    cargoTemplatePath: string = './assets/static-content/Cargo.xlsx';
    crewTemplatePath: string = './assets/static-content/Crews.xlsx';

    filesToUpload: FileData[];
    objFileData: FileData;
    form: FormGroup;
    disableUploadButton: boolean;


    constructor(formBuilder: FormBuilder,
        private fileUploadService: FileUploadService,
        private dataExchange: DataExchangeService<boolean>,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private globalState: GlobalStateService) {
        this.filesToUpload = [];
    }

    public ngOnInit(): void {
        this.disableUploadButton = true;
        this.filesToUpload = [];
        this.initiateForm();
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    public ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }

    reset(): void {
        this.inputFilePax.nativeElement.value = '';
        this.inputFileCrew.nativeElement.value = '';
        this.inputFileCargo.nativeElement.value = '';
    }

    uploadFiles(): void {
        if (this.inputFilePax.nativeElement.value !== '' || this.inputFileCrew.nativeElement.value !== '' || this.inputFileCargo.nativeElement.value !== '') {
            this.disableUploadButton = false;
            const baseUrl = GlobalConstants.EXTERNAL_URL;
            const param = 'IncidentId=' + this.IncidentId + '&CreatedBy=' + this.CreatedBy;

            this.fileUploadService.uploadFiles<string>(baseUrl + './api/MasterDataUploadBatch?' + param, this.filesToUpload)
                .subscribe((result: any) => {
                    console.log('success');
                    this.filesToUpload = [];
                    this.toastrService.success('Uploaded Data is processed successfully.' + '\n'
                        + 'To check any invalid records, please refer \'View Invalid Records\' link for the current timestamp.', 'Success', this.toastrConfig);

                    this.form.reset();
                    this.disableUploadButton = true;

                }, (error) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
            this.disableUploadButton = true;
        }
    }



    getFileDetails(e: any, type: string): void {
        this.disableUploadButton = false;

        for (let i = 0; i < e.target.files.length; i++) {
            const extension = e.target.files[i].name.split('.').pop();

            if (extension.toLowerCase() === 'xls' || extension.toLowerCase() === 'xlsx') {
                this.objFileData = new FileData();
                this.objFileData.field = type;
                this.objFileData.file = e.target.files[i];
                this.filesToUpload.push(this.objFileData);
            }
            else {
                this.toastrService.error('Invalid File Format!', 'Error', this.toastrConfig);
                this.inputFileCargo.nativeElement.value = '';
                this.inputFileCrew.nativeElement.value = '';
                this.inputFilePax.nativeElement.value = '';
                this.disableUploadButton = true;
            }
        }
    }

    openPassenger(): void {
        this.validPassengersModal.show();
        this.dataExchange.Publish('OpenPassengers', true);
    }
    closePassenger(): void {
        this.validPassengersModal.hide();
    }

    openCrew(): void {
        this.validCrewModal.show();
        this.dataExchange.Publish('OpenCrews', true);
    }
    closeCrew(): void {
        this.validCrewModal.hide();
    }

    openCargo(): void {
        this.validCargoModal.show();
        this.dataExchange.Publish('OpenCargoes', true);
    }
    closeCargo(): void {
        this.validCargoModal.hide();
    }

    openInvalidPax(): void {
        this.invalidPassengersModal.show();
        this.dataExchange.Publish('OpenInvalidPassengers', true);
    }
    closeInvalidPax(): void {
        this.invalidPassengersModal.hide();
    }

    openInvalidCrew(): void {
        this.invalidCrewModal.show();
        this.dataExchange.Publish('OpenInvalidCrews', true);
    }
    closeInvalidCrew(): void {
        this.invalidCrewModal.hide();
    }

    openInvalidCargo(): void {
        this.invalidCargoModal.show();
        this.dataExchange.Publish('OpenInvalidCargoes', true);
    }
    closeInvalidCargo(): void {
        this.invalidCargoModal.hide();
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.IncidentId = incident.Value;
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.DepartmentId = department.Value;
    }

    private initiateForm(): void {
        this.form = new FormGroup({
            filePax: new FormControl(),
            fileCrew: new FormControl(),
            fileCargo: new FormControl()
        });
    }
}