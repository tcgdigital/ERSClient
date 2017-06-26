import {
    Component, Output, ViewEncapsulation,
    OnInit, AfterViewInit, EventEmitter, ElementRef
} from '@angular/core';
import {
    FormGroup, FormBuilder,
    FormControl, Validators
} from '@angular/forms';
import { ChangePasswordModel } from './auth.model';
import { AccountResponse } from '../../../shared/models';
import { GlobalConstants } from '../../../shared/constants';
import { ChangePasswordService } from './change.password.service';
import { Router } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

@Component({
    selector: 'change-password',
    encapsulation: ViewEncapsulation.None,
    providers: [ChangePasswordService],
    templateUrl: '../views/change.password.view.html',
    styleUrls: ['../styles/login.style.scss']
})
export class ChangePasswordComponent implements OnInit, AfterViewInit {
    @Output() closeHandler: EventEmitter<any> = new EventEmitter<any>();
    @Output() successMessageInvoker: EventEmitter<any> = new EventEmitter<any>();

    public changePasswordForm: FormGroup;
    public submitted: boolean = false;
    public errorMessage: string = '';

    constructor(private formBuilder: FormBuilder,
        private elementRef: ElementRef,
        private router: Router,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
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
        this.router.navigate(['login']);
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
                            this.toastrService.success('Password has been changed successfully. Redirecting to login for sign in again',
                                'Sign In', this.toastrConfig);
                            this.router.navigate(['login']);
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
            SecurityQuestion: new FormControl(changePasswordModel ? changePasswordModel.SecurityQuestion : '', [Validators.required]),
            SecurityAnswer: new FormControl(changePasswordModel ? changePasswordModel.SecurityAnswer : '', [Validators.required]),
            OldPassword: new FormControl(changePasswordModel ? changePasswordModel.OldPassword : '', [Validators.required]),
            NewPassword: new FormControl(changePasswordModel ? changePasswordModel.NewPassword : '',
                [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(GlobalConstants.PASSWORD_PATTERN)]),
            ConfirmPassword: new FormControl(changePasswordModel ? changePasswordModel.ConfirmPassword : '', [Validators.required, this.compareValidator]),
        });
        return formGroup;
    }
}