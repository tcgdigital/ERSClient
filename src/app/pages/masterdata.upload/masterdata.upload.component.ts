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
} from '../../shared';
import { FileData } from '../../shared/models';

@Component({
    selector: 'masterdataupload-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/masterdata.upload.view.html'
})

export class MasterDataUploadComponent{   
     constructor() { }
     ngOnInit(): void { }
 
}