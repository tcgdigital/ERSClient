import {
    Component, OnInit, Input, OnDestroy,
    ViewEncapsulation, ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {
    FormGroup, FormControl, FormBuilder, Validators,
    ReactiveFormsModule
} from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { ArchiveDocumentTypeService } from '../archive.report.widget/archive.doument.type.service';
import { ArchiveDocumentTypeModel } from '../archive.upload.widget/archive.upload.widget.model';
import {
    DataServiceFactory, DataExchangeService, ResponseModel, FileUploadService, UtilityService,
    TextAccordionModel, GlobalStateService, KeyValue, GlobalConstants, IUploadDocuments
} from '../../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'archive-upload-widget',
    templateUrl: './archive.upload.widget.view.html',
    styleUrls: ['./archive.upload.widget.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ArchiveUploadWidgetComponent implements OnInit, OnDestroy {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;

    @ViewChild('myFileInput') myInputVariable: any;
    public form: FormGroup;
    filesToUpload: File[];
    filepathWithLinks: string = null;
    fileName: string = null;
    uploadDocuments: IUploadDocuments[];
    archiveDocumentType: ArchiveDocumentTypeModel;
    constructor(private formBuilder: FormBuilder,
        private UtilityService: UtilityService,
        private fileUploadService: FileUploadService,
        private globalState: GlobalStateService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private archiveDocumentTypeService: ArchiveDocumentTypeService) { }

    public ngOnInit(): void {
        this.uploadDocuments = GlobalConstants.UploadDocuments;
        this.form = new FormGroup({
            uploadDocumentControl: new FormControl(0)
        });
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    public upload() {
        let dropdownselected: string = this.form.controls['uploadDocumentControl'].value;
        if (dropdownselected === '0') {
            this.toastrService.error('Please select document type and then upload.', 'Document Upload', this.toastrConfig);
            return false;
        }
        if (this.filesToUpload !== undefined) {
            const baseUrl = GlobalConstants.EXTERNAL_URL;
            this.fileUploadService.uploadFiles<string>(baseUrl + 'api/fileUpload/upload', this.filesToUpload)
                .subscribe((result: string) => {
                    this.filepathWithLinks = `${GlobalConstants.EXTERNAL_URL}UploadFiles/${result.replace(/^.*[\\\/]/, '')}`;
                    const extension = result.replace(/^.*[\\\/]/, '').split('.').pop();
                    if (dropdownselected === '1') {
                        this.fileName = 'View_Lessons_Learnt' + `.${extension}`;
                    }
                    else if (dropdownselected === '2') {
                        this.fileName = 'View_Audit_Report' + `.${extension}`;
                    }
                    this.OnDocumentUploaded(dropdownselected);

                }, (error) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
            this.toastrService.error('Please select alteast one file to upload.', 'Document Upload', this.toastrConfig);
            return false;
        }
    }

    public OnDocumentUploaded(dropdownselected: string): void {

        this.archiveDocumentTypeService.GetByIncident(this.incidentId)
            .subscribe((returnResult: ResponseModel<ArchiveDocumentTypeModel>) => {
                if (returnResult.Records.length === 0) {
                    this.archiveDocumentType = new ArchiveDocumentTypeModel();
                    this.archiveDocumentType.ArchieveDocumentTypeId = 0;
                    this.archiveDocumentType.IncidentId = this.incidentId;
                    this.archiveDocumentType.DocumentType = dropdownselected;
                    this.archiveDocumentType.DocumentUploadPath = this.filepathWithLinks;
                    this.archiveDocumentType.ActiveFlag = 'Active';
                    this.archiveDocumentType.CreatedBy = +UtilityService.GetFromSession('CurrentUserId');
                    this.archiveDocumentType.CreatedOn = new Date();

                    this.archiveDocumentTypeService.CreateArchiveDocumentType(this.archiveDocumentType)
                        .subscribe((data: ArchiveDocumentTypeModel) => {
                            this.toastrService.success('Document added succesfully.', 'Document Upload', this.toastrConfig);
                            this.myInputVariable.nativeElement.value = '';
                            this.filepathWithLinks = null;
                            this.fileName = null;
                            this.filesToUpload = null;
                            return false;
                        });
                }
                else {
                    let filteredArchiveDocumentType: ArchiveDocumentTypeModel[] = returnResult.Records.filter((item: ArchiveDocumentTypeModel) => {
                        return item.DocumentType === dropdownselected;
                    });
                    if (filteredArchiveDocumentType.length > 0) {
                        this.archiveDocumentType = new ArchiveDocumentTypeModel();
                        this.archiveDocumentType.ArchieveDocumentTypeId = filteredArchiveDocumentType[0].ArchieveDocumentTypeId;
                        this.archiveDocumentType.IncidentId = this.incidentId;
                        this.archiveDocumentType.DocumentType = dropdownselected;
                        this.archiveDocumentType.DocumentUploadPath = this.filepathWithLinks;
                        this.archiveDocumentType.ActiveFlag = 'Active';
                        this.archiveDocumentType.CreatedBy = +UtilityService.GetFromSession('CurrentUserId');
                        this.archiveDocumentType.CreatedOn = new Date();

                        this.archiveDocumentTypeService.UpdateArchiveDocumentType(this.archiveDocumentType)
                            .subscribe((data: ArchiveDocumentTypeModel) => {
                                this.toastrService.success('Document updated succesfully.', 'Document Upload', this.toastrConfig);
                                this.myInputVariable.nativeElement.value = '';
                                this.filepathWithLinks = null;
                                this.fileName = null;
                                this.filesToUpload = null;
                                return false;
                            });
                    }
                    else {
                        this.archiveDocumentType = new ArchiveDocumentTypeModel();
                        this.archiveDocumentType.ArchieveDocumentTypeId = 0;
                        this.archiveDocumentType.IncidentId = this.incidentId;
                        this.archiveDocumentType.DocumentType = dropdownselected;
                        this.archiveDocumentType.DocumentUploadPath = this.filepathWithLinks;
                        this.archiveDocumentType.ActiveFlag = 'Active';
                        this.archiveDocumentType.CreatedBy = +UtilityService.GetFromSession('CurrentUserId');
                        this.archiveDocumentType.CreatedOn = new Date();

                        this.archiveDocumentTypeService.CreateArchiveDocumentType(this.archiveDocumentType)
                            .subscribe((data: ArchiveDocumentTypeModel) => {
                                this.toastrService.success('Document added succesfully.', 'Document Upload', this.toastrConfig);
                                this.myInputVariable.nativeElement.value = '';
                                this.filepathWithLinks = null;
                                this.fileName = null;
                                this.filesToUpload = null;
                                return false;
                            });
                    }
                }
            });

    }

    public fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    public clearFileUpload(event: any): void {
        this.myInputVariable.nativeElement.value = '';
        this.filepathWithLinks = null;
        this.fileName = null;
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
}
