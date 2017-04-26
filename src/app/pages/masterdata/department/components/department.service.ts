import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DepartmentModel } from './department.model';
import { IDepartmentService } from './IDepartmentService';
import {
    RequestModel,
    ResponseModel,
    BaseModel,
    WEB_METHOD,
    DataProcessingService,
    DataService,
    DataServiceFactory,
    GlobalConstants,
    IServiceInretface,
    ServiceBase
} from '../../../../shared';

@Injectable()
export class DepartmentService
    extends ServiceBase<DepartmentModel>
    implements IDepartmentService {
    // private _dataService: DataService<DepartmentModel>;
    private _batchDataService: DataService<BaseModel>;

    /**
     * Creates an instance of DepartmentService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf DepartmentService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        // let option: DataProcessingService = new DataProcessingService();
        // this._dataService = this.dataServiceFactory
        //     .CreateServiceWithOptions<DepartmentModel>('Departments', option);
        super(dataServiceFactory, 'Departments');

        let option: DataProcessingService = new DataProcessingService();
        option.EndPoint = GlobalConstants.BATCH;
        this._batchDataService = this.dataServiceFactory
            .CreateServiceWithOptions<DepartmentModel>('', option);
    }

    /**
     * Get all active departments
     * 
     * @returns {Observable<ResponseModel<DepartmentModel>>} 
     * 
     * @memberOf DepartmentService
     */
    GetAll(): Observable<ResponseModel<DepartmentModel>> {
        return this._dataService.Query()
            .Expand('ParentDepartment($select=DepartmentName)', 'UserProfile($select=Name)')
            .Filter('ActiveFlag eq CMS.DataModel.Enum.ActiveFlag\'Active\'')
            .Execute();
    }

    /**
     * Get Departments by filter criteria
     * 
     * @param {string} query 
     * @returns {Observable<ResponseModel<DepartmentModel>>} 
     * 
     * @memberOf DepartmentService
     */
    GetQuery(query: string): Observable<ResponseModel<DepartmentModel>> {
        return this._dataService.Query()
            .Expand('ParentDepartment($select=DepartmentName)', 'UserProfile($select=Name)')
            .Filter(query).Execute();
    }


    /**
     * Initiate Batch operation
     * 
     * @returns {Observable<ResponseModel<BaseModel>>} 
     * 
     * @memberOf DepartmentService
     */
    BatchOperation(): Observable<ResponseModel<BaseModel>> {
        let requests: Array<RequestModel<BaseModel>> = [];
        requests.push(new RequestModel<BaseModel>('/odata/Departments', WEB_METHOD.GET));
        requests.push(new RequestModel<BaseModel>('/odata/EmergencyTypes', WEB_METHOD.GET));

        return this._batchDataService.BatchPost<BaseModel>(requests)
            .Execute();
    }

    GetAllActiveDepartments(): Observable<ResponseModel<DepartmentModel>> {
        return this._dataService.Query()
            .Select('DepartmentId', 'DepartmentName', 'Description', 'ParentDepartmentId')
            .Filter(`ActiveFlag eq 'Active'`)
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    GetAllDepartmentsFromDepartmentIdProjection(departmentIdProjection: string): Observable<ResponseModel<DepartmentModel>> {
        return this._dataService.Query()
            .Select('DepartmentId,DepartmentName')
            .Filter(`${departmentIdProjection}`)
            .OrderBy('CreatedOn desc')
            .Execute();
    }

    GetAllActiveSubDepartments(departmentId: number): Observable<ResponseModel<DepartmentModel>> {
        return this._dataService.Query()
            .Select('DepartmentId', 'DepartmentName', 'Description', 'ParentDepartmentId')
            .Filter(`ActiveFlag eq 'Active' and ParentDepartmentId eq ${departmentId}`)
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    GetAllActiveDepartmentParentDepartmentMatrix(): Observable<ResponseModel<DepartmentModel>> {
        return this._dataService.Query()
            .Select('DepartmentId', 'DepartmentName', 'Description', 'ParentDepartmentId')
            .Expand('ParentDepartment($select=DepartmentId,DepartmentName)')
            .Filter(`ActiveFlag eq 'Active'`)
            .OrderBy("CreatedOn desc")
            .Execute();
    }
    
    GetDepartmentNameIds(): Observable<ResponseModel<DepartmentModel>> {
        return this._dataService.Query()
            .Select('DepartmentId,DepartmentName')
            .Execute();
    }

    GetParentDepartments() : Observable<ResponseModel<DepartmentModel>>{
          return this._dataService.Query()
            .Filter(`ParentDepartmentId ne null`)
            .Expand('ParentDepartment')
            .OrderBy("CreatedOn desc")
            .Execute();
    }
}