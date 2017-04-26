import { Observable } from 'rxjs/Rx';
import { DepartmentClosureModel } from './department.closure.model';
import { InvolvePartyModel } from '../../shared.components';
import { IServiceInretface, ResponseModel } from '../../../shared';

export interface IDepartmentClosureService extends IServiceInretface<DepartmentClosureModel> {

    GetAllByIncident(incidentId: number,departmentId:number): Observable<ResponseModel<DepartmentClosureModel>>;

    getAllbyIncidentandDepartment(incidentId, departmentId): Observable<ResponseModel<DepartmentClosureModel>>;
}