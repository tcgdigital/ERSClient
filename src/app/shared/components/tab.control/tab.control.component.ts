import {
    Component, OnInit, Input,
    ViewEncapsulation, AfterViewInit,
    ElementRef
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ITabLinkInterface } from './tab.control.interface';

@Component({
    selector: '[tab-control]',
    templateUrl: 'tab.control.view.html',
    styleUrls: ['./tab.control.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TabControlComponent implements OnInit, AfterViewInit {
    @Input() tabLinks: ITabLinkInterface[];

    protected allowedTabLinks: ITabLinkInterface[];
    protected _onRouteChange: Subscription;

    private $rootContainer: JQuery;
    private $rootItems: JQuery;
    private $tabItems: JQuery;
    private $slider: JQuery;

    /**
     * Creates an instance of TabControlComponent.
     * @param {ElementRef} elementRef
     * @param {Router} router
     *
     * @memberOf TabControlComponent
     */
    constructor(private elementRef: ElementRef, private router: Router) {
    }

    public ngOnInit(): void {
        this.allowedTabLinks = this.tabLinks;
        this._onRouteChange = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.selectSpecificTabs(event.url);
            }
        });
    }

    public ngAfterViewInit(): void {
        this.$rootContainer = jQuery(this.elementRef.nativeElement);
        this.$rootItems = this.$rootContainer.find('ul.tab-column');
        this.$tabItems = this.$rootItems.children('li.tab-item');
        this.$slider = this.$rootItems.find('li.slider');

        this.$rootItems.css('width', `${this.$tabItems.eq(0).width() * this.$tabItems.length}px`);

        this.$rootContainer.hover(
            ($event: JQueryEventObject) => {
                const $itemWrapper: JQuery = jQuery($event.currentTarget);
                const $navigation = $itemWrapper.find('.tab-nav');
                const $tabColumns = $itemWrapper.find('.tab-column');

                this.updateNavigation($navigation, $itemWrapper, $tabColumns);
                this.$slider.show();
            },
            ($event: JQueryEventObject) => {
                const $itemWrapper: JQuery = jQuery($event.currentTarget);
                const $navigation = $itemWrapper.find('.tab-nav');
                this.hideNavigation($navigation);
                this.$slider.hide();
            }
        );
    }

    public onTabLinkClick($event, index: number): void {
        $event.preventDefault();
        const $self: JQuery = jQuery($event.currentTarget);
        const $currentItem: JQuery = $self.parent('li.tab-item');

        this.resetSelection();
        this.setSelection($currentItem, $event.pageX, $event.pageY);
        this.$slider.hide();
    }

    public onTabItemClick($event, index: number): void {
        const $self: JQuery = jQuery($event.currentTarget);
        this.resetSelection();
        this.setSelection($self, $event.pageX, $event.pageY);
        this.$slider.hide();
    }

    public onTabLinkMouseEnter($event, index: number): void {
        const $self: JQuery = jQuery($event.currentTarget);
        this.moveSliderOnFocus($self, index);
        // if ($self.hasClass('active'))
        //     this.$slider.hide();
    }

    public onTabLinkMouseLeave($event, index: number): void {
        const $self: JQuery = jQuery($event.currentTarget);
        this.moveSliderOnFocus($self, index);
        // this.$slider.hide();
    }

    public gotoPrevious($event): void {
        const $self: JQuery = jQuery($event.currentTarget);
        this.updateSlider($self, false);
    }

    public gotoNext($event): void {
        const $self: JQuery = jQuery($event.currentTarget);
        this.updateSlider($self, true);
    }

    public onContainerMouseEnter($event): void {
        // let $itemWrapper: JQuery = jQuery($event.currentTarget);
        // let $navigation = $itemWrapper.siblings('.tab-nav');
        // let $tabColumns = $itemWrapper.find('.tab-column');

        // this.updateNavigation($navigation, $itemWrapper, $tabColumns);
        // this.$slider.show();
    }

    public onContainerMouseLeave($event): void {
        // let $itemWrapper: JQuery = jQuery($event.currentTarget);
        // let $navigation = $itemWrapper.siblings('.tab-nav');
        // this.hideNavigation($navigation);
        // this.$slider.hide();
    }

    private updateSlider($currentElm, bool): void {
        const $navigation = $currentElm.closest('.tab-nav');
        const $itemWrapper = $navigation.siblings('.tab-link');
        const $tabColumns = $itemWrapper.children('.tab-column');
        const $tabItems = $tabColumns.children('li.tab-item');
        const tabWidth = $tabItems.eq(0).width();

        $tabColumns.css('width', (tabWidth * $tabItems.length) + 'px');

        let scrollLeftPos = $itemWrapper.scrollLeft();
        scrollLeftPos = isNaN(scrollLeftPos) ? 0 : scrollLeftPos;

        scrollLeftPos = (bool) ? scrollLeftPos + tabWidth : scrollLeftPos - tabWidth;
        if (scrollLeftPos < 0) scrollLeftPos = 0;
        if (scrollLeftPos > $tabColumns.outerWidth(true) - $itemWrapper.width())
            scrollLeftPos = $tabColumns.outerWidth(true) - $itemWrapper.width();

        $itemWrapper.animate({ scrollLeft: scrollLeftPos }, {
                duration: 'slow',
                easing: 'easeInSine'
            });
        this.updateNavigation($navigation, $itemWrapper, $tabColumns);
    }

    private updateNavigation($navigation, $container, $tabColumns) {
        const scrollLeft = $container.scrollLeft();
        let isPrevActive = false;
        let isNextActive = false;

        if (($tabColumns.outerWidth(true) - $container.width()) > 0) {
            isPrevActive = (scrollLeft <= 0) ? false : true;
            isNextActive = (scrollLeft === Math.floor($tabColumns.outerWidth(true) - $container.width())) ? false : true;

            isPrevActive = true;
            isNextActive = true;
        }

        (isNextActive) ? $navigation.find('a').eq(1).addClass('visible')
            : $navigation.find('a').eq(1).removeClass('visible');
        (isPrevActive) ? $navigation.find('a').eq(0).addClass('visible')
            : $navigation.find('a').eq(0).removeClass('visible');
    }

    private hideNavigation($navigation) {
        $navigation.find('a').removeClass('visible');
    }

    private resetSelection(): void {
        this.$rootContainer.find('.tab-link li').removeClass('selected');
        this.$rootContainer.find('.ripple').parent('li').removeClass('selected');
        this.$rootContainer.find('.ripple').remove();
    }

    private setSelection($tabItem: JQuery, pageXPos: number, pageYPos: number): void {
        const posX: number = $tabItem.offset().left;
        const posY: number = $tabItem.offset().top;
        const buttonWidth: number = $tabItem.width();
        const buttonHeight: number = $tabItem.height();

        const x: number = pageXPos - posX - buttonWidth / 2;
        const y: number = pageYPos - posY - buttonHeight / 2;

        $tabItem.prepend('<span class="ripple"></span>');
        const $ripple: JQuery = $tabItem.find('.ripple');

        $ripple.css({
            width: buttonWidth,
            height: buttonHeight,
            top: y + 'px',
            left: x + 'px'
        }).addClass('rippleEffect');

        $ripple.parent('li').addClass('selected');
    }

    private moveSliderOnFocus($tabItem: JQuery, tabIndex: number): void {
        const whatTab: number = tabIndex;
        const howFar: number = $tabItem.width() * whatTab;

        // if (!$tabItem.hasClass('active'))
        //     this.$slider.show();
        this.$slider.css({ left: `${howFar}px` });
    }

    private selectSpecificTabs(tabUrl: string): void {
        this.allowedTabLinks.forEach((tab: ITabLinkInterface) => {
            tab.selected = (tabUrl.indexOf(tab.url) !== -1);
        });
    }
}