import { Component, OnInit, ViewEncapsulation, Input, ElementRef } from '@angular/core';
import { ITabLinkInterface } from '../tab.control/tab.control.interface';
import { Router } from '@angular/router';

@Component({
    selector: '[subtab-control]',
    templateUrl: 'subtab.control.view.html',
    styleUrls: ['./subtab.control.style.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SubTabControlComponent implements OnInit {
    @Input() tabLinks: ITabLinkInterface[];
    protected allowedTabLinks: ITabLinkInterface[];

    constructor(private elementRef: ElementRef, private router: Router) {
    }

    public ngOnInit(): void {
        this.allowedTabLinks = this.tabLinks;
    }
}