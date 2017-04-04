import {
    Component, ViewEncapsulation, Input,
    OnInit, OnDestroy, AfterContentInit, ViewChild
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators, ReactiveFormsModule
} from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import {
    ResponseModel, DataExchangeService,
    UtilityService, GlobalConstants,
    FileUploadService
} from '../../../shared';
import { FileData } from '../../../shared/models';

@Component({
    selector: 'masterdatauploadlist-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/masterdata.upload.list.view.html'
})

export class MasterDataUploadListComponent implements OnInit{
    @Input() DepartmentId: string;
    @Input() IncidentId: string;
    @Input() CreatedBy: string;
    passengerTemplatePath: string = "../../../DownloadFiles/Passengers.xlsx";
    cargoTemplatePath: string = "../../../DownloadFiles/Cargo.xlsx";
    crewTemplatePath: string = "../../../DownloadFiles/Crews.xlsx";
    isHiddenValidPax: boolean = true;
    isHiddenValidCargo: boolean = true;
    isHiddenValidCrew: boolean = true;
    isHiddenInvalidPax: boolean = true;
    isHiddenInvalidCargo: boolean = true;
    isHiddenInvalidCrew: boolean = true;

    
    filesToUpload: Array<FileData>;
    objFileData: FileData;

     constructor(formBuilder: FormBuilder,
        private fileUploadService: FileUploadService,
        private dataExchange: DataExchangeService<boolean>) {
        this.filesToUpload = [];
    }

    ngOnInit(): void {
    }

    uploadFiles(): void {
        let baseUrl = GlobalConstants.EXTERNAL_URL;
        let param = "IncidentId=" + this.IncidentId + "&CreatedBy=" + this.CreatedBy;
        this.fileUploadService.uploadFiles<string>(baseUrl + "./api/MasterDataUploadBatch?" + param, this.filesToUpload)
            .subscribe((result: any) => {
                    debugger;
                    console.log("success");                    
                    alert("Uploaded Data is processed successfully." + '\n' + "To check any invalid records, please refer \"View Invalid Records\" link for the current timestamp.");
                },(error) => {
                    console.log(`Error: ${error}`);
                });
    }        

    getFileDetails(e: any, type: string): void{
        this.filesToUpload = [];
       
        for(var i = 0; i < e.target.files.length; i++){
            var extension = e.target.files[i].name.split('.').pop();
                       
            if (extension.toLowerCase() == "xls" || extension.toLowerCase() == "xlsx") {
                this.objFileData = new FileData();                
                this.objFileData.field = type;
                this.objFileData.file = e.target.files[i];
                this.filesToUpload.push(this.objFileData); 
                console.log(this.filesToUpload);          

            }
        }        
    }

    openPassenger():void{
        this.isHiddenValidPax = !this.isHiddenValidPax;
        this.dataExchange.Publish("OpenPassengers",true);
    }

    openCrew():void{
        this.isHiddenValidCrew = !this.isHiddenValidCrew;
        this.dataExchange.Publish("OpenCrews", true);
    }

    openCargo():void{
        this.isHiddenValidCargo = !this.isHiddenValidCargo
        this.dataExchange.Publish("OpenCargoes", true);
    } 

    openInvalidPax(): void{
        this.isHiddenInvalidPax = !this.isHiddenInvalidPax;
        this.dataExchange.Publish("OpenInvalidPassengers", true);
    }

    openInvalidCrew(): void{
        this.isHiddenInvalidCrew = !this.isHiddenInvalidCrew;
        this.dataExchange.Publish("OpenInvalidCrews", true);
    }

    openInvalidCargo(): void{
        this.isHiddenInvalidCargo = !this.isHiddenInvalidCargo;
        this.dataExchange.Publish("OpenInvalidCargoes", true);
    }
}