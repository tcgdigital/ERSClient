import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { PageModel } from './department.functionality.model';
import {
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService,
    IServiceInretface
} from '../../../../shared';

@Injectable()
export class PageService implements IServiceInretface<PageModel>{
    private _dataServiceForPage: DataService<PageModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        const option: DataProcessingService = new DataProcessingService();
        this._dataServiceForPage = this.dataServiceFactory
            .CreateServiceWithOptions<PageModel>('Pages', option);
    }

    GetAll(): Observable<ResponseModel<PageModel>> {
        return this._dataServiceForPage.Query().Execute();
    }

    GetFilter(filter: string): Observable<ResponseModel<PageModel>> {
        return this._dataServiceForPage.Query()
            .Filter(filter)
            .Execute();
    }

    Get(id: string | number): Observable<PageModel> {
        const entity: PageModel = new PageModel();
        return Observable.of(entity);
    }

    Create(entity: PageModel): Observable<PageModel> {
        return Observable.of(entity);
    }

    CreateBulk(entities: PageModel[]): Observable<PageModel[]> {
        return Observable.of(entities);
    }

    Update(entity: PageModel): Observable<PageModel> {
        return Observable.of(entity);
    }

    Delete(key: number): void { }

    GetDepartmentsByPageCode(pageCode: string): Observable<ResponseModel<PageModel>> {
        return this._dataServiceForPage.Query()
            .Filter(`PageCode eq '${pageCode}'`)
            .Expand('PagePermissions ($expand = Department)')
            .Execute();
    }
}