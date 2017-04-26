import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { AppendedTemplateModel } from './appendedtemplate.model';
import { IAppendedTemplateService } from './IAppendedTemplateService';
import {
    ResponseModel,
    DataServiceFactory,
    ServiceBase
} from '../../../../shared';

@Injectable()
export class AppendedTemplateService
    extends ServiceBase<AppendedTemplateModel>
    implements IAppendedTemplateService {

    /**
     * Creates an instance of TemplateService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf TemplateService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'AppendedTemplates');
    }

    GetAll(): Observable<ResponseModel<AppendedTemplateModel>> {
        let templates: ResponseModel<AppendedTemplateModel>;
        return this._dataService.Query()
            .Expand("EmergencySituation")
            .OrderBy("CreatedOn desc")
            .Execute().map((data: ResponseModel<AppendedTemplateModel>) => {
                templates = data;
                templates.Records.forEach(x => x.Active = (x.ActiveFlag == 'Active'));
                return templates;
            });
    }

    GetQuery(query: string): Observable<ResponseModel<AppendedTemplateModel>> {
        return this._dataService.Query()
            .Expand('EmergencySituation')
            .Filter(query).Execute();
    }

    GetByEmergencySituationId(emergencySituationId:number):Observable<ResponseModel<AppendedTemplateModel>>{
        return this._dataService.Query()
        .Filter(`EmergencySituationId eq ${emergencySituationId}`)
        .Execute();
    }


    CreateAppendedTemplate(appendedTemplateModel: AppendedTemplateModel): Observable<AppendedTemplateModel> {
        return this._dataService.Post(appendedTemplateModel)
            .Execute();
            
    }
}