import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { TemplateModel } from './template.model';
import {
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService,
    IServiceInretface
} from '../../../../shared';

@Injectable()
export class TemplateService implements IServiceInretface<TemplateModel> {
    private _dataService: DataService<TemplateModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<TemplateModel>('Templates', option);
    }

    GetAll(): Observable<ResponseModel<TemplateModel>> {
        let templates: ResponseModel<TemplateModel>;
        return this._dataService.Query()
            .Expand("EmergencySituation")
            .OrderBy("CreatedOn desc")
            .Execute().map((data: ResponseModel<TemplateModel>) => {
                templates = data;
                for (var x of templates.Records) {
                    if (x.ActiveFlag == 'Active') {
                        x.Active = true;
                    }
                    else {
                        x.Active = false;
                    }

                }

                return templates;
            });
    }

    Get(id: string | number): Observable<TemplateModel> {
        return this._dataService.Get(id.toString()).Execute();
    }

    Create(entity: TemplateModel): Observable<TemplateModel> {
        return this._dataService.Post(entity).Execute();
    }

    CreateBulk(entities: TemplateModel[]): Observable<TemplateModel[]> {
        return Observable.of(entities);
    }

    Update(entity: TemplateModel): Observable<TemplateModel> {
        let key: string = entity.TemplateId.toString()
        return this._dataService.Patch(entity, key).Execute();
    }

    Delete(entity: TemplateModel): void {
    }

    GetQuery(query: string): Observable<ResponseModel<TemplateModel>> {
        return this._dataService.Query()
            .Expand('EmergencySituation')
            .Filter(query).Execute();
    }
}