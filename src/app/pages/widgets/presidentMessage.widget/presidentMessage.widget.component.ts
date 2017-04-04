import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { PresidentMessageWidgetModel } from './presidentMessage.widget.model';
import { PresidentMessageWidgetService } from './presidentMessage.widget.service'
import { DataServiceFactory, DataExchangeService } from '../../../shared'
import { ModalDirective } from 'ng2-bootstrap/modal';

@Component({
    selector: 'presidentMessage-widget',
    templateUrl: './presidentMessage.widget.view.html',
    styleUrls: ['./presidentMessage.widget.style.scss']
})
export class PresidentMessageWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;
    @ViewChild('childModalPresidentMsg') public childModal:ModalDirective;

    isHidden: boolean = true;

    presidentMessages: Observable<PresidentMessageWidgetModel[]>; 
    AllPresidentMessages: Observable<PresidentMessageWidgetModel[]>;   

    constructor(private presidentMessagewidgetService: PresidentMessageWidgetService,
        private dataExchange: DataExchangeService<PresidentMessageWidgetModel>) { }

    ngOnInit() {
        this.getLatestPresidentsMessages();
        this.getAllPresidentsMessages();
    }

    getLatestPresidentsMessages(): void {
        let data: PresidentMessageWidgetModel[] = [];
        this.presidentMessagewidgetService
            .GetAllPresidentMessageByIncident(this.incidentId)
            .flatMap(x=>x)
            .take(2)
            .subscribe(x => {
                data.push(x);
            },(error: any)=>{},
            ()=>this.presidentMessages = Observable.of(data));
    }

    getAllPresidentsMessages(callback?: Function): void {
        let data: PresidentMessageWidgetModel[] = [];
        this.presidentMessagewidgetService
            .GetAllPresidentMessageByIncident(this.incidentId)
            .flatMap(x=>x)
            .subscribe(x => {
                data.push(x);
            },(error: any)=>{},
            ()=>{
                    this.AllPresidentMessages = Observable.of(data);
                    if(callback){
                        callback();
                    }
                });
    }
     openPresidentMessages(): void{
        this.getAllPresidentsMessages(()=>{
            this.childModal.show();
        });       
     }

     hidePresidentMessages(): void{
        this.childModal.hide();
     }
}