import { Observable } from 'rxjs/Rx';
import { AppendedTemplateModel } from './appendedtemplate.model';
import { ResponseModel, IServiceInretface } from '../../../../shared';

export interface IAppendedTemplateService extends IServiceInretface<AppendedTemplateModel> {
    GetQuery(query: string): Observable<ResponseModel<AppendedTemplateModel>>;
    CreateAppendedTemplate(appendedTemplateModel: AppendedTemplateModel): Observable<AppendedTemplateModel>;
}