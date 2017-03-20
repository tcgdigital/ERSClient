import {
    Component, ViewEncapsulation,
    ElementRef, Input, Output,
    EventEmitter, HostListener, OnDestroy, OnInit
} from '@angular/core';
import { KeyValue } from '../../models';
import { DataExchangeService } from '../../services/data.exchange';

@Component({
    selector: 'autocomplete',
    host: {
        '(document:click)': 'onDocunentClick($event)',
    },
    templateUrl: './autocomplete.view.html'
})
export class AutocompleteComponent implements OnInit {
    @Input('items') Items: Array<KeyValue> = [];
    @Output() notify: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();
    @Output('InvokeAutoCompleteReset') InvokeAutoCompleteReset: EventEmitter<any> = new EventEmitter();
    // public query = '';
    // public filteredList;
    public elementRef;
    public filteredList: Array<KeyValue> = [];
    public query: string = '';

    constructor(public myElement: ElementRef, private dataExchange: DataExchangeService<string>) {
        this.elementRef = myElement;
        this.filteredList = this.Items;
    }

    filter(): void {
        if (this.query !== null) {
            this.filteredList = this.Items.filter(function (el: KeyValue) {
                return el.Key.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
            }.bind(this));
        } else {
            this.filteredList = this.Items;
        }
    }

    clear(): void {
        this.filteredList = [];
        this.query = '';
        this.InvokeAutoCompleteReset.emit();
    }
    showClose(): boolean {
        if (this.filteredList.length > 0 || this.query != '') {
            return true;
        }
        return false;
    }
    select(item: KeyValue) {
        this.query = item.Key;
        this.filteredList = [];
        this.notify.emit(item);
    }

    // @HostListener('document:click', ['$event'])
    onDocunentClick(event) {
        var clickedComponent = event.target;
        var inside = false;
        do {
            if (clickedComponent === this.elementRef.nativeElement) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
        if (!inside) {
            this.filteredList = [];
        }

    }
    ngOnInit() {
        this.dataExchange.Subscribe("clearAutoCompleteInput", model => this.query = model);
    };
    ngOnDestroy() {
        this.dataExchange.Unsubscribe("clearAutoCompleteInput");
    };
}

