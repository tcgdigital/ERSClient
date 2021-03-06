import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import {
    FormGroup,
    FormControl,
    FormBuilder,
    AbstractControl,
    Validators,
    ReactiveFormsModule
} from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';


import { QuickLinkModel } from './quicklink.model';
import { QuickLinkService } from './quicklink.service';
import { ResponseModel, DataExchangeService, AuthModel, UtilityService, URLValidator } from '../../../../shared';

@Component({
    selector: 'quicklink-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/quicklink.entry.view.html'
})
export class QuickLinkEntryComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public submitted: boolean;

    quickLinkModel: QuickLinkModel = null;
    quickLinkModelEdit: QuickLinkModel = null;
    date: Date = new Date();
    quickLinks: QuickLinkModel[] = [];
    showAdd: Boolean = true;
    buttonValue: String = "";
    credential: AuthModel;

    constructor(formBuilder: FormBuilder, private quickLinkService: QuickLinkService,
        private dataExchange: DataExchangeService<QuickLinkModel>, private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) {
        this.showAdd = false;
        this.buttonValue = "Add QuickLink";
    }

    ngOnInit(): void {
        this.submitted = false;
        this.credential = UtilityService.getCredentialDetails();
        this.initializeInputForm();
        this.initiateQuickLinkModel();
        this.dataExchange.Subscribe("quickLinkModelEdited", model => this.onQuickLinkEditSuccess(model));
    }

    initializeInputForm(): void {
        this.form = new FormGroup({
            QuickLinkId: new FormControl(0),
            QuickLinkName: new FormControl('', [Validators.required]),
            QuickLinkURL: new FormControl('', [Validators.required, URLValidator.validate])
        });
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("quickLinkModelEdited");
    }

    initiateQuickLinkModel(): void {
        this.quickLinkModel = new QuickLinkModel();
        this.quickLinkModel.ActiveFlag = 'Active';
        this.quickLinkModel.CreatedBy = +this.credential.UserId;
        this.quickLinkModel.CreatedOn = this.date;
    }

    onSubmit(values: Object): void {
        this.submitted = true;
        if (this.form.valid) {
            if (this.quickLinkModel.QuickLinkId == 0) {//ADD REGION
                delete this.quickLinkModel.Active;
                this.quickLinkModel.QuickLinkName = this.form.controls['QuickLinkName'].value;
                this.quickLinkModel.QuickLinkURL = this.form.controls['QuickLinkURL'].value;
                this.quickLinkService.Create(this.quickLinkModel)
                    .subscribe((response: QuickLinkModel) => {
                        this.initializeInputForm();
                        this.toastrService.success('Quick link saved Successfully.', 'Success', this.toastrConfig);
                        this.dataExchange.Publish("quickLinkModelSaved", response);
                        this.showAdd = false;
                        this.initiateQuickLinkModel();
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            }
            else {//EDIT REGION
                if (this.form.dirty) {
                    this.formControlDirtyCheck();
                    delete this.quickLinkModelEdit.Active;
                    this.quickLinkModelEdit.deleteAttributes();
                    this.quickLinkService.Update(this.quickLinkModelEdit)
                        .subscribe((response: QuickLinkModel) => {
                            this.toastrService.success('Quick link edited Successfully.', 'Success', this.toastrConfig);
                            this.initializeInputForm();
                            this.initiateQuickLinkModel();
                            this.form = new FormGroup({
                                QuickLinkId: new FormControl(this.quickLinkModel.QuickLinkId),
                                QuickLinkName: new FormControl(this.quickLinkModel.QuickLinkName,
                                    [Validators.required, Validators.minLength(5)]),
                                QuickLinkURL: new FormControl(this.quickLinkModel.QuickLinkURL,
                                    [Validators.required, Validators.minLength(12)])
                            });
                            this.showAdd = false;
                        }, (error: any) => {
                            console.log(`Error: ${error}`);
                        });
                }
            }
        }
    }

    cancel(): void {
        this.submitted = false;
        this.initiateQuickLinkModel();
        this.showAdd = false;
        this.form = new FormGroup({
            QuickLinkId: new FormControl(0),
            QuickLinkName: new FormControl(this.quickLinkModel.QuickLinkName,
                [Validators.required]),
            QuickLinkURL: new FormControl(this.quickLinkModel.QuickLinkURL,
                [Validators.required, URLValidator.validate])
        });
    }

    formControlDirtyCheck() {
        this.quickLinkModelEdit = new QuickLinkModel();
        this.quickLinkModelEdit.QuickLinkId = this.form.controls['QuickLinkId'].value;
        this.quickLinkModel.QuickLinkId = this.form.controls['QuickLinkId'].value;

        if (this.form.controls['QuickLinkName'].touched) {
            this.quickLinkModelEdit.QuickLinkName = this.form.controls['QuickLinkName'].value;
            this.quickLinkModel.QuickLinkName = this.form.controls['QuickLinkName'].value;
        }
        if (this.form.controls['QuickLinkURL'].touched) {
            this.quickLinkModelEdit.QuickLinkURL = this.form.controls['QuickLinkURL'].value;
            this.quickLinkModel.QuickLinkURL = this.form.controls['QuickLinkURL'].value;
        }
    }

    onQuickLinkEditSuccess(data: QuickLinkModel): void {
        this.showAddRegion();
        this.showAdd = true;
        this.initiateQuickLinkModel();
        this.quickLinkModel = data;

        this.form = new FormGroup({
            QuickLinkId: new FormControl(this.quickLinkModel.QuickLinkId),
            QuickLinkName: new FormControl(this.quickLinkModel.QuickLinkName,
                [Validators.required]),
            QuickLinkURL: new FormControl(this.quickLinkModel.QuickLinkURL,
                [Validators.required, URLValidator.validate])
        });
    }

    showAddRegion(): void {
        this.showAdd = true;
    }
}