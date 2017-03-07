import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { UtilityService } from '../common.service';

@Injectable()
export class FileUploadService {
    private progressObservable: Observable<number>;
    private progressObserver: Observer<number>;
    private progress: number;

    /**
     * Creates an instance of FileUploadService.
     * 
     * @memberOf FileUploadService
     */
    constructor() {
        this.progressObservable = new Observable((observer: Observer<number>) => {
            this.progressObserver = observer;
        })
    }

    /**
     * Get file upload progress observable;
     * 
     * @returns {Observable<number>} 
     * 
     * @memberOf FileUploadService
     */
    public getProgressObservable(): Observable<number> {
        return this.progressObservable;
    }

    /**
     * File uploading service request
     * 
     * @template T 
     * @param {string} url 
     * @param {File[]} files 
     * @param {string} [fieldName=''] 
     * @returns {Observable<T>} 
     * 
     * @memberOf FileUploadService
     */
    public uploadFiles<T>(url: string, files: Array<File>, fieldName: string = ''): Observable<T> {
        //return Observable.fromPromise(
        if (files.length > 0) {


            let fileUploadPromise: Promise<T> = new Promise((resolve, reject) => {
                let formData: FormData = new FormData(),
                    xhr: XMLHttpRequest = new XMLHttpRequest();

                for (var i = 0; i < files.length; i++) {
                    formData.append("uploads[]", files[i], files[i].name);
                }
                

                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve(<T>JSON.parse(xhr.response));
                        } else {
                            reject(xhr.response);
                        }
                    }
                };

                //FileUploadService.setUploadUpdateInterval(500);

                xhr.upload.onprogress = (event: ProgressEvent) => {
                    this.progress = Math.round(event.loaded / event.total * 100);
                    //this.progressObserver.next(this.progress);
                };

                xhr.upload.ontimeout = (event: ProgressEvent) => {
                    this.progressObserver.error('Upload timed out');
                }

                xhr.open('POST', url, true);
                xhr.send(formData);
            });

            return Observable.fromPromise(fileUploadPromise);
        }
    }

    /**
     * Set interval for frequency with which Observable inside Promise will share data with subscribers.
     * 
     * @private
     * @static
     * @param {number} interval 
     * 
     * @memberOf FileUploadService
     */
    private static setUploadUpdateInterval(interval: number): void {
        setInterval(() => { }, interval);
    }
}