import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { AuthenticationService } from './authentication.service';
import { UtilityService } from '../../../shared/services';

@Component({
    selector: 'login',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/login.view.html',
    styleUrls: ['../styles/login.style.scss'],
    providers: [AuthenticationService]
})
export class LoginComponent {
    public form: FormGroup;
    public userId: AbstractControl;
    public password: AbstractControl;
    public submitted: boolean;

    constructor(formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private router: Router) {
        this.form = formBuilder.group({
            userId: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(4)])]
        });

        this.userId = this.form.controls['userId'];
        this.password = this.form.controls['password'];
    }

    Login(userid: string, password: string): void {
        this.authService.Login(userid, password)
            .subscribe((data) => {
                this.router.navigate(['pages/dashboard']);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    onSubmit(values: Object): void {
        this.submitted = true;
        if (!this.form.valid) {
            console.log('Invalid Information');
        }
        else {
            this.Login(this.userId.value, this.password.value);
        }
    }
}