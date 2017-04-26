import { Observable } from 'rxjs/Rx';
import { DepartmentModel } from './department.model';
import { IServiceInretface, ResponseModel, BaseModel } from '../../../../shared';

export interface IDepartmentService extends IServiceInretface<DepartmentModel> {
    GetQuery(query: string): Observable<ResponseModel<DepartmentModel>>;

    BatchOperation(): Observable<ResponseModel<BaseModel>>;

    GetParentDepartments(): Observable<ResponseModel<DepartmentModel>>;

    GetAllDepartmentsFromDepartmentIdProjection(departmentIdProjection: string): Observable<ResponseModel<DepartmentModel>>;
}