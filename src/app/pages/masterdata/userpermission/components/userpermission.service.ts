import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DepartmentModel, DepartmentService } from '../../department';
import { UserPermissionModel, DepartmentsToView } from './userpermission.model';
import { NotifyPeopleModel } from "../../../notifypeople/components/notifypeople.model";
import { IUserPermissionService } from './IUserPermissionService';
import {
    ResponseModel,
    DataService, DataServiceFactory,
    DataProcessingService,
    ServiceBase,
} from '../../../../shared';


@Injectable()
export class UserPermissionService
    extends ServiceBase<UserPermissionModel>
    implements IUserPermissionService {

    private _bulkDataService: DataService<UserPermissionModel>;
    private departmentsToViewConstant: DepartmentsToView[] = [];
    public parentDepartmentUserPermission: ResponseModel<UserPermissionModel>;
    public childrenDepartmentUserPermission: ResponseModel<UserPermissionModel>;

    /**
     * Creates an instance of UserPermissionService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf UserPermissionService
     */
    constructor(private dataServiceFactory: DataServiceFactory, private departmentService: DepartmentService) {
        super(dataServiceFactory, 'UserPermissions');

        let option: DataProcessingService = new DataProcessingService();
        this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<UserPermissionModel>
            ('UserPermissionBatch', 'BatchPostAsync', option);


    }

    public GetFilterByUsers(userId: number): Observable<ResponseModel<UserPermissionModel>> {
        return this._dataService.Query()
            .Filter(`UserId eq ${userId}`)
            .Execute();
    }

    public CreateBulk(entities: UserPermissionModel[]): Observable<UserPermissionModel[]> {
        console.log(entities.length);
        return this._bulkDataService.BulkPost(entities).Execute();
    }

    public CreateDefaultDepartmentList(departments: DepartmentModel[]): DepartmentsToView[] {
        this.departmentsToViewConstant = [];
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


    public GetAllUserPermissions(): Observable<ResponseModel<UserPermissionModel>> {
        return this._dataService.Query()
            .Expand('Department($select=DepartmentId,DepartmentName),User($select=Email,UserProfileId,UserId)')
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    public GetAllDepartmentUsers(departmentId: number): Observable<ResponseModel<UserPermissionModel>> {

        let allChildDepartmentIdsProjection: string = '';
        let count: number = 1;
        return this._dataService.Query()
            .Expand('Department($select=DepartmentId,DepartmentName),User($select=Email,UserProfileId,UserId)')
            .Filter(`DepartmentId eq ${departmentId}`)
            .OrderBy('CreatedOn desc')
            .Execute();

    }

    public GetAllDepartmentUsersFromDepartmentIdProjection(departmentIdProjection: string): Observable<ResponseModel<UserPermissionModel>> {

        return this._dataService.Query()
            .Expand('Department($select=DepartmentId,DepartmentName),User($select=Email,Name,MainContact,AlternateContact,UserProfileId,UserId)')
            .Filter(`${departmentIdProjection}`)
            .OrderBy('CreatedOn desc')
            .Execute();

    }
    public GetAllDepartmentsFromDepartmentIdProjection(departmentIdProjection: string): Observable<ResponseModel<DepartmentModel>> {
        return this.departmentService.GetAllDepartmentsFromDepartmentIdProjection(departmentIdProjection);
    }

    public GetAllSubDepartments(departmentId: number): Observable<ResponseModel<DepartmentModel>> {
        return this.departmentService.GetAllActiveSubDepartments(departmentId);
    }

    public GetAllDepartmentMatrix(): Observable<ResponseModel<DepartmentModel>> {
        return this.departmentService.GetAllActiveDepartmentParentDepartmentMatrix();
    }



    public GetUserPermissionFromDepartments(allChildDepartmentIdsProjection: string): Observable<ResponseModel<UserPermissionModel>> {
        return this._dataService.Query()
            .Expand('Department($select=DepartmentId,DepartmentName),User($select=Email,UserProfileId,UserId)')
            .Filter(`${allChildDepartmentIdsProjection}`)
            .OrderBy("CreatedOn desc")
            .Execute()
    }
}