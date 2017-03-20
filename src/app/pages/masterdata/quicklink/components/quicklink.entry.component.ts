import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import {
    FormGroup,
    FormControl,
    FormBuilder,
    AbstractControl,
    Validators,
    ReactiveFormsModule
} from '@angular/forms';

import { QuickLinkModel } from './quicklink.model';
import { QuickLinkService } from './quicklink.service';
import { ResponseModel, DataExchangeService } from '../../../../shared';

@Component({
    selector: 'quicklink-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/quicklink.entry.view.html'
})
export class QuickLinkEntryComponent implements OnInit, OnDestroy {
    public form: FormGroup;

    quickLinkModel: QuickLinkModel = null;
    quickLinkModelEdit: QuickLinkModel = null;
    date: Date = new Date();
    quickLinks: QuickLinkModel[] = [];
    showAdd: Boolean = true;
    buttonValue: String = "";

    constructor(formBuilder: FormBuilder, private quickLinkService: QuickLinkService,
        private dataExchange: DataExchangeService<QuickLinkModel>) {
        this.showAdd = false;
        this.buttonValue = "Add QuickLink";
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            QuickLinkId: new FormControl(0),
            QuickLinkName: new FormControl('', [Validators.required, Validators.minLength(5)]),
            QuickLinkURL: new FormControl('', [Validators.required, Validators.minLength(12)])
        });

        this.initiateQuickLinkModel();
        this.dataExchange.Subscribe("quickLinkModelEdited", model => this.onQuickLinkEditSuccess(model));
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("quickLinkModelEdited");
    }

    initiateQuickLinkModel(): void {
        this.quickLinkModel = new QuickLinkModel();
        this.quickLinkModel.ActiveFlag = 'Active';
        this.quickLinkModel.CreatedBy = 1;
        this.quickLinkModel.CreatedOn = this.date;
    }

    onSubmit(values: Object): void {
        if (this.quickLinkModel.QuickLinkId == 0) {//ADD REGION
            this.quickLinkModel.QuickLinkName = this.form.controls['QuickLinkName'].value;
            this.quickLinkModel.QuickLinkURL = this.form.controls['QuickLinkURL'].value;
            this.quickLinkService.Create(this.quickLinkModel)
                .subscribe((response: QuickLinkModel) => {
                    this.dataExchange.Publish("quickLinkModelSaved", response);
                    this.initiateQuickLinkModel();
                }, (error: any) => {
                    console.log("Error");
                });
        }
        else {//EDIT REGION
            if (this.form.dirty) {
                this.formControlDirtyCheck();
                this.quickLinkService.Update(this.quickLinkModelEdit)
                    .subscribe((response: QuickLinkModel) => {
                        this.initiateQuickLinkModel();
                        this.form = new FormGroup({
                            QuickLinkId: new FormControl(this.quickLinkModel.QuickLinkId),
                            QuickLinkName: new FormControl(this.quickLinkModel.QuickLinkName, 
                                [Validators.required, Validators.minLength(5)]),
                            QuickLinkURL: new FormControl(this.quickLinkModel.QuickLinkURL, 
                                [Validators.required, Validators.minLength(12)])
                        });
                        this.showAddRegion(true);
                    }, (error: any) => {
                        console.log("Error");
                    });
            }
        }
    }

    cancel(): void {
        console.log("HELLO");
        this.initiateQuickLinkModel();
        this.form = new FormGroup({
            QuickLinkId: new FormControl(0),
            QuickLinkName: new FormControl(this.quickLinkModel.QuickLinkName, 
                [Validators.required, Validators.minLength(5)]),
            QuickLinkURL: new FormControl(this.quickLinkModel.QuickLinkURL, 
                [Validators.required, Validators.minLength(12)])
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
        this.showAddRegion(false);
        this.initiateQuickLinkModel();
        this.quickLinkModel = data;

        this.form = new FormGroup({
            QuickLinkId: new FormControl(this.quickLinkModel.QuickLinkId),
            QuickLinkName: new FormControl(this.quickLinkModel.QuickLinkName, 
                [Validators.required, Validators.minLength(5)]),
            QuickLinkURL: new FormControl(this.quickLinkModel.QuickLinkURL, 
                [Validators.required, Validators.minLength(12)])
        });
    }

    showAddRegion(ShowAdd: Boolean): void {
        if (ShowAdd) {
            this.showAdd = false;
            this.buttonValue = "Show Add QuickLink";
        }
        else {
            this.showAdd = true;
            this.buttonValue = "Hide Add QuickLink";
        }
        console.log("Add Quick Region is Show " + ShowAdd);
    }
}