import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DataServiceFactory, DataExchangeService } from '../../../shared'
import { MediaReleaseWidgetModel } from './mediaRelease.widget.model'
import { MediaReleaseWidgetService } from './mediaRelease.widget.service'
import { ModalDirective } from 'ng2-bootstrap/modal';

@Component({
    selector: 'mediaRelease-widget',
    templateUrl: './mediaRelease.widget.view.html',
    styleUrls: ['./mediaRelease.widget.style.scss']
})
export class MediaReleaseWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;
    isHidden: boolean = true;
    @ViewChild('childModalMediaRelease') public childModal:ModalDirective;

    mediaReleases: Observable<MediaReleaseWidgetModel[]>;
    AllMediaReleases: Observable<MediaReleaseWidgetModel[]>;

    /**
     * Creates an instance of MediaReleaseWidgetComponent.
     * @param {MediaReleaseWidgetService} mediaReleaseWidgetService 
     * @param {DataExchangeService<MediaReleaseWidgetModel>} dataExchange 
     * 
     * @memberOf MediaReleaseWidgetComponent
     */
    constructor(private mediaReleaseWidgetService: MediaReleaseWidgetService,
        private dataExchange: DataExchangeService<MediaReleaseWidgetModel>) { }

    public ngOnInit(): void {
        this.getLatestMediaReleases();
        this.getAllMediaReleases();
    }

    public getLatestMediaReleases(): void {
        let data: MediaReleaseWidgetModel[] = [];
        this.mediaReleaseWidgetService
            .GetAllMediaReleaseByIncident(this.incidentId)
            .flatMap(x => x)
            .take(2)
            .subscribe(x => {
                data.push(x);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            },
            () => this.mediaReleases = Observable.of(data));
    }

    public getAllMediaReleases(callback?: Function): void {
        let data: MediaReleaseWidgetModel[] = [];
        this.mediaReleaseWidgetService
            .GetAllMediaReleaseByIncident(this.incidentId)
            .flatMap(x => x)
            .subscribe(x => {
                data.push(x);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            },
            () => {
                    this.AllMediaReleases = Observable.of(data);
                    if(callback){
                        callback();
                    }
                });
    }

    public openMediaReleases(): void {
        this.getAllMediaReleases(()=>{
            this.childModal.show();
        });        
    }

    public hideMediaReleases(): void {
        this.childModal.hide();
    }
}
