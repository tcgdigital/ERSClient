import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {
    DataServiceFactory, DataExchangeService, GlobalStateService,
    KeyValue, UtilityService, TextAccordionModel, GlobalConstants
} from '../../../shared';
import { MediaReleaseWidgetModel } from './mediaRelease.widget.model';
import { MediaModel } from '../../shared.components';
import { MediaReleaseWidgetService } from './mediaRelease.widget.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'mediaRelease-widget',
    templateUrl: './mediaRelease.widget.view.html',
    styleUrls: ['./mediaRelease.widget.style.scss']
})
export class MediaReleaseWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;
    @ViewChild('childModalMediaRelease') public childModal: ModalDirective;

    mediaReleases: Observable<TextAccordionModel[]>;
    AllMediaReleases: Observable<MediaReleaseWidgetModel[]>;
    currentDepartmentId: number;
    currentIncidentId: number;
    currentMediaRelaseModel: MediaReleaseWidgetModel = new MediaReleaseWidgetModel();
    downloadPath: string;

    /**
     * Creates an instance of MediaReleaseWidgetComponent.
     * @param {MediaReleaseWidgetService} mediaReleaseWidgetService
     * @param {DataExchangeService<MediaReleaseWidgetModel>} dataExchange
     *
     * @memberOf MediaReleaseWidgetComponent
     */
    constructor(private mediaReleaseWidgetService: MediaReleaseWidgetService,
        private dataExchange: DataExchangeService<MediaReleaseWidgetModel>, private globalState: GlobalStateService) { }

    public ngOnInit(): void {
        // this.incidentId= +UtilityService.GetFromSession("CurrentDepartmentId");
        // this.departmentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.departmentId;
        this.downloadPath = GlobalConstants.EXTERNAL_URL + 'api/Report/GenerateMediareleaseReport/Media/' + this.currentIncidentId + '/';
        this.getLatestMediaReleases(this.currentIncidentId);
        this.getAllMediaReleases();
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('MediaReleasePublished', (model) => this.onMediaReleasePublish(model));
    }

    public getLatestMediaReleases(incidentId): void {
        let data: MediaReleaseWidgetModel[] = [];
        this.mediaReleaseWidgetService
            .GetAllMediaReleaseByIncident(incidentId)
            .flatMap((x) => x)
            .take(2)
            .subscribe((x: MediaReleaseWidgetModel) => {
                data.push(x);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            },
            () => {
                this.mediaReleases = Observable.of(data
                    .map((x: MediaReleaseWidgetModel) => new TextAccordionModel(x.MediaReleaseType, x.PublishedOn,
                        this.downloadPath + x.MediaqueryId)));
                console.log(this.mediaReleases);
            });
    }

    public getAllMediaReleases(callback?: Function): void {
        let data: MediaReleaseWidgetModel[] = [];
        this.mediaReleaseWidgetService
            .GetAllMediaReleaseByIncident(this.currentIncidentId)
            .flatMap((x) => x)
            .subscribe((x) => {
                data.push(x);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            },
            () => {
                this.AllMediaReleases = Observable.of(data);
                if (callback) {
                    callback();
                }
            });
    }

    public openMediaReleases(): void {
        this.getAllMediaReleases(() => {
            this.childModal.show();
        });
    }

    public hideMediaReleases(): void {
        this.childModal.hide();
    }

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('MediaReleasePublished');
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.downloadPath = GlobalConstants.EXTERNAL_URL + 'api/Report/GenerateMediareleaseReport/Media/' + this.currentIncidentId + '/';
        this.getLatestMediaReleases(this.currentIncidentId);
        this.getAllMediaReleases();
    }

    private onMediaReleasePublish(mediaRelease: MediaModel): void {
        if (mediaRelease.IsPublished) {
            this.getLatestMediaReleases(this.currentIncidentId);
        }
    }
}
