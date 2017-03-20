import { Injectable, Output, EventEmitter } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { DepartmentModel } from '../../department';
import { UserPermissionModel, DepartmentsToView } from './userpermission.model';
import {
    ResponseModel, GlobalConstants,
    DataService, DataServiceFactory,
    DataOperation, DataProcessingService,
    IServiceInretface,
} from '../../../../shared';


@Injectable()
export class UserPermissionService implements IServiceInretface<UserPermissionModel> {
    private _dataService: DataService<UserPermissionModel>;
    private _bulkDataService: DataService<UserPermissionModel>;
    public departmentsToViewConstant: DepartmentsToView[] = [];

    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<UserPermissionModel>('UserPermissions', option);

        this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<UserPermissionModel>
            ('UserPermissionBatch', 'BatchPostAsync', option);
    }


    GetAll(): Observable<ResponseModel<UserPermissionModel>> {
        return this._dataService.Query().Execute();
    }


    GetFilterByUsers(userId: number): Observable<ResponseModel<UserPermissionModel>> {
        return this._dataService.Query()
            .Filter(`UserId eq ${userId}`)
            .Execute();
    }


    Get(id: string | number): Observable<UserPermissionModel> {
        return this._dataService.Get(id.toString()).Execute();
    }


    Create(entity: UserPermissionModel): Observable<UserPermissionModel> {
        return Observable.of(entity);
    }


    CreateBulk(entities: UserPermissionModel[]): Observable<UserPermissionModel[]> {
        console.log(entities.length);
        return this._bulkDataService.BulkPost(entities).Execute();
    }


    Update(entity: UserPermissionModel): Observable<UserPermissionModel> {
        return Observable.of(entity);
    }


    Delete(entity: UserPermissionModel): void {
    }

    public CreateDefaultDepartmentList(departments: DepartmentModel[]): DepartmentsToView[] {
        this.departmentsToViewConstant=[];
        departments.forEach(department => {
            let departmentsToView = new DepartmentsToView();
            departmentsToView.DepartmentId = department.DepartmentId;
            departmentsToView.DepartmentName = department.DepartmentName;
            departmentsToView.IsMemberOf = false;
            departmentsToView.IsHod = false;
            this.departmentsToViewConstant.push(departmentsToView);
        });
        return this.departmentsToViewConstant;
    }
}