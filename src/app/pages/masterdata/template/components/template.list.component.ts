import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { TemplateModel } from './template.model';
import { TemplateService } from './template.service';
import { EmergencySituationService } from '../../emergencysituation';
import {
    ResponseModel, DataExchangeService,
    GlobalConstants, UtilityService,
    SearchTextBox, SearchDropdown,
    NameValue,SearchConfigModel
} from '../../../../shared';

@Component({
    selector: 'template-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/template.list.view.html',
    styleUrls: ['../styles/template.style.scss']
})
export class TemplateListComponent implements OnInit, OnDestroy {
    vari: any = null;
    templates: TemplateModel[] = [];
    searchConfigs: SearchConfigModel<any>[] = [];
    templateModelPatch: TemplateModel = null;
    date: Date = new Date();
    templateMediaTypes: any[] = GlobalConstants.TemplateMediaType;
    constructor(private templateService: TemplateService,
        private emergencySituationService: EmergencySituationService,
        private dataExchange: DataExchangeService<TemplateModel>) {


    }

    initiateQuickLinkModelPatch(): void {
        this.templateModelPatch = new TemplateModel();
        this.templateModelPatch.ActiveFlag = 'Active';
        this.templateModelPatch.CreatedBy = 1;
        this.templateModelPatch.CreatedOn = this.date;
    }

    getTemplates(): void {
        this.templateService.GetAll()
            .subscribe((response: ResponseModel<TemplateModel>) => {
                this.templates = response.Records;
            });
    }

    onTemplateSaveSuccess(data: TemplateModel): void {
        this.templates.unshift(data);
    }

    ngOnInit(): void {
        this.getTemplates();
        //this.dataExchange.Subscribe("quickLinkModelSaved", 
        //model => this.onTemplateSaveSuccess(model));
    }

    ngOnDestroy(): void {
        //this.dataExchange.Unsubscribe("quickLinkModelSaved");
    }

    editQuickLink(editedQuickLink: TemplateModel): void {
        //this.dataExchange.Publish("quickLinkModelEdited", editedQuickLink);
    }

    IsActive(event: any, editedTemplate: TemplateModel): void {
        this.initiateQuickLinkModelPatch();
        this.templateModelPatch.TemplateId = editedTemplate.TemplateId;
        this.templateModelPatch.ActiveFlag = 'Active';
        if (!event.checked) {
            this.templateModelPatch.ActiveFlag = 'InActive';
        }
        this.templateService.Update(this.templateModelPatch)
            .subscribe((response: TemplateModel) => {
                this.getTemplates();
            }, (error: any) => {
                console.log("Error");
            });
    }
    invokeSearch(query: string): void {
        if (query !== '') {
            this.templateService.GetQuery(query)
                .subscribe((response: ResponseModel<TemplateModel>) => {
                    this.templates = response.Records;
                }, ((error: any) => {
                    console.log(error);
                }));
        }
    }
    invokeReset(): void {
        this.getTemplates();
    }
    getMediaName(id: number): string {
        if (id > 0) {
            return this.templateMediaTypes.find(x => x.Key == id).Value;
        }
        return "";
    }
    private initiateSearchConfigurations(): void {
        let status: NameValue<string>[] = [
            new NameValue<string>('Active', 'Active'),
            new NameValue<string>('In-Active', 'In-Active'),
        ]
        this.searchConfigs = [
            new SearchDropdown({
                Name: 'TemplateMediaId',
                Description: 'Template Media',
                PlaceHolder: 'Select Template Media',
                Value: '',
                ListData: GlobalConstants.TemplateMediaType
                    .map(x => x.Records)
                    .map(x => x.map(y => new NameValue<number>(y.value, y.key)))
            }),
            new SearchDropdown({
                Name: 'DepartmentSpoc',
                Description: 'Department SPOC',
                PlaceHolder: 'Select Department SPOC',
                Value: '',
                ListData: this.emergencySituationService.GetAll()
                    .map(x => x.Records)
                    .map(x => x.map(y => new NameValue<number>(y.EmergencySituationName, y.EmergencySituationId)))
            })
        ];

        // console.log(this.searchConfigs);
    }
}