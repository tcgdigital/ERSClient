import { Component, ViewEncapsulation } from '@angular/core';
import { TemplateModel } from './components/template.model';

@Component({
    
    selector: 'template-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/template.view.html'
})
export class TemplateComponent {
    public template: TemplateModel;
}