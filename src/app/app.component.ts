import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Routes } from '@angular/router';

import {
    GlobalStateService,
    ImageLoaderService,
    ThemeSpinnerService,
    ThemePreloaderService,
    SideMenuService
} from './shared/services';
import { MENU } from './app.memu';
import { LayoutPaths } from './shared/constants';

import 'style-loader!./app.style.scss';
import 'style-loader!./theme/initial.scss';

@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './app.view.html'
})
export class AppComponent implements OnInit {
    isMenuCollapsed: boolean = false;

    constructor(private globalState: GlobalStateService,
        private imageLoader: ImageLoaderService,
        private spinner: ThemeSpinnerService,
        private menuService: SideMenuService,
    ) {
        this.menuService.updateMenuByRoutes(<Routes>MENU);
        this.LoadImages();

        this.globalState.Subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });
    }

    public ngOnInit(): void {
        console.log('Initial App State');
    }

    public ngAfterViewInit(): void {
        // hide spinner once all loaders are completed
        ThemePreloaderService.Load()
            .then((values) => {
                console.log(values);
                // this._spinner.Hide();
            }).catch((error) => {
                console.log(error);
            });
    }

    private LoadImages(): void {
        // register some loaders
        ThemePreloaderService.RegisterLoader(this.imageLoader
            .Load(LayoutPaths.images.root + 'sky-bg.jpg'));
    }
}