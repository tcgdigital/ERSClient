import {
    Component, OnInit, Input, OnDestroy,
    ViewEncapsulation, ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ArchiveDocumentTypeService } from './archive.doument.type.service';
import { DepartmentClosureService } from './department.closure.service';
import { OtherReportModel, DepartmentClosureModel } from './archive.report.widget.model';
import { ArchiveDocumentTypeModel } from '../../widgets/archive.upload.widget';
import {
    DataServiceFactory, DataExchangeService, ResponseModel,
    TextAccordionModel, GlobalStateService, KeyValue, GlobalConstants
} from '../../../shared';
import { ArchiveReportWidgetModel } from './archive.report.widget.model';
import { ArchiveReportWidgetService } from './archive.report.widget.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'archive-report-widget',
    templateUrl: './archive.report.widget.view.html',
    styleUrls: ['./archive.report.widget.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ArchiveReportWidgetComponent implements OnInit, OnDestroy {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;
    @ViewChild('childModalDepartmentWiseCloseReport') public childModalDepartmentWiseCloseReport: ModalDirective;
    @ViewChild('childModalOtherReport') public childModalOtherReport: ModalDirective;

    public downloadUrl: string = '';
    public otherReports: OtherReportModel[];
    public departmentWiseClosureReports: DepartmentClosureModel[];


    constructor(private archiveReportWidgetService: ArchiveReportWidgetService,
        private archiveDocumentTypeService: ArchiveDocumentTypeService,
        private departmentClosureService: DepartmentClosureService,
        private dataExchange: DataExchangeService<ArchiveReportWidgetModel>,
        private globalState: GlobalStateService) { }

    public ngOnInit(): void {
        this.otherReports = [];
        this.departmentWiseClosureReports = [];
        this.downloadUrl = `${GlobalConstants.EXTERNAL_URL}${GlobalConstants.API}/Report/GenerateReport/${this.incidentId}`;

        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    public GetArchiveDocumentTypeData(incidentId: number, callback?: Function): void {
        this.archiveDocumentTypeService.GetByIncident(incidentId)
            .subscribe((result: ResponseModel<ArchiveDocumentTypeModel>) => {
                this.otherReports = [];
                result.Records.forEach((item: ArchiveDocumentTypeModel) => {
                    let otherReport: OtherReportModel = new OtherReportModel();
                    otherReport.FilePathWithName = `${GlobalConstants.EXTERNAL_URL}UploadFiles/` + item.DocumentUploadPath.replace(/^.*[\\\/]/, '');
                    otherReport.Extension = item.DocumentUploadPath.replace(/^.*[\\\/]/, '').split('.').pop();
                    otherReport.DocumentType = item.DocumentType;
                    if (item.DocumentType === '1') {
                        otherReport.FileName = 'View_Lessons_Learnt.' + otherReport.Extension;
                    }
                    else if (item.DocumentType === '2') {
                        otherReport.FileName = 'View_Audit_Report.' + otherReport.Extension;
                    }
                    this.otherReports.push(otherReport);
                });
                if (callback) {
                    callback();
                }
            });
    }

    public GetDepartmentClosureData(incidentId: number, callback?: Function): void {
        this.departmentClosureService.GetAllByIncident(incidentId)
            .subscribe((result: ResponseModel<DepartmentClosureModel>) => {
                this.otherReports = [];
                this.departmentWiseClosureReports = result.Records;
                if (callback) {
                    callback();
                }
            });
    }

    public openModalOtherReport(): void {
        this.GetArchiveDocumentTypeData(this.incidentId, () => {
            this.childModalOtherReport.show();
        });
    }

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.incidentId = incident.Value;
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.departmentId = department.Value;
    }

    private openModalDepartmentWiseCloseReport(): void {
        this.GetDepartmentClosureData(this.incidentId, () => {
            this.childModalDepartmentWiseCloseReport.show();
        });
    }

    private hideModalDepartmentWiseCloseReport(): void {
        this.childModalDepartmentWiseCloseReport.hide();
    }

    private hideModalOtherReport(): void {
        this.childModalOtherReport.hide();
    }
}
