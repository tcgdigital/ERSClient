import {
    Component, OnInit, ViewEncapsulation,
    AfterViewInit, ElementRef, Output, EventEmitter
} from '@angular/core';
import { ChangePasswordModel } from './components/change.password.model';
import {
    FormGroup, FormControl, Validators,
    FormBuilder, ValidationErrors, AbstractControl
} from '@angular/forms';
import { CompareFieldValidator } from '../../../shared/validators/custom.form.validation';
import { GlobalConstants } from '../../../shared/constants/constants';
import { ChangePasswordService } from './components/change.password.service';
import { AccountResponse } from '../../../shared/models/base.model';

@Component({
    selector: 'change-password',
    encapsulation: ViewEncapsulation.None,
    providers: [ChangePasswordService],
    templateUrl: './views/change.password.view.html',
    styleUrls: ['./styles/change.password.style.scss']
})
export class ChangePasswordComponent implements OnInit, AfterViewInit {
    @Output() closeHandler: EventEmitter<any> = new EventEmitter<any>();
    @Output() successMessageInvoker: EventEmitter<any> = new EventEmitter<any>();

    public changePasswordForm: FormGroup;
    public submitted: boolean = false;
    public errorMessage: string = '';

    constructor(private formBuilder: FormBuilder,
        private elementRef: ElementRef,
        private changePasswordService: ChangePasswordService) { }

    public ngOnInit(): void {
        this.changePasswordForm = this.setChangePasswordForm();
    }

    public ngAfterViewInit(): void {
        const $self: JQuery = jQuery(this.elementRef.nativeElement);
        $self.find('.input-group-addon').on('click', (event) => {
            const $btn: JQuery = $(event.currentTarget);
            const $input: JQuery = $btn.siblings('input');

            if ($input.text() !== 'empty') {
                $btn.find('i').toggleClass('fa-eye fa-eye-slash');
                if ($btn.find('i').hasClass('fa-eye')) {
                    $input.attr('type', 'text');
                } else {
                    $input.attr('type', 'password');
                }
            }
        });
    }

    public onCancelClick($event): void {
        this.changePasswordForm.reset();
        this.closeHandler.emit($event);
    }

    public onSubmit(changePasswordModel: ChangePasswordModel): void {
        this.submitted = true;
        this.errorMessage = '';

        if (this.changePasswordForm.valid) {
            console.log(changePasswordModel);
            this.changePasswordService.ChangePassword(changePasswordModel)
                .subscribe((response: AccountResponse) => {
                    if (response) {
                        if (response.Code === 3001) {
                            this.changePasswordForm.reset();
                            this.successMessageInvoker.emit('Password has been changed successfully. Redirecting to login for sign in again.');
                        } else {
                            this.errorMessage = response.Message;
                        }
                    }
                });
        }
    }

    compareValidator(control: FormControl): any {
        if (this.changePasswordForm) {
            return control.value === this.changePasswordForm.get('NewPassword').value ? null : { notSame: true };
        }
    }

    private setChangePasswordForm(changePasswordModel?: ChangePasswordModel): FormGroup {
        this.compareValidator = this.compareValidator.bind(this);
        const formGroup: FormGroup = new FormGroup({
            OldPassword: new FormControl(changePasswordModel ? changePasswordModel.OldPassword : '', [Validators.required]),
            NewPassword: new FormControl(changePasswordModel ? changePasswordModel.NewPassword : '',
                [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(GlobalConstants.PASSWORD_PATTERN)]),
            ConfirmPassword: new FormControl(changePasswordModel ? changePasswordModel.ConfirmPassword : '', [Validators.required, this.compareValidator]),
        });
        return formGroup;
    }
}