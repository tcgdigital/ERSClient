import { Observable, Subject } from 'rxjs/Rx';
import { NgZone } from '@angular/core';
import { ConnectionStatus } from './notification.model';
import { INotificationConnection } from './notification.connection.interface';
import { BroadcastEventListener } from './broadcast.event.listener';

export class NotificationConnection implements INotificationConnection {
    private _status: Observable<ConnectionStatus>;
    private _errors: Observable<any>;
    private _jConnection: any;
    private _jProxy: any;
    private _zone: NgZone;

    /**
     * Creates an instance of NotificationConnection.
     * @param {*} jConnection
     * @param {*} jProxy
     * @param {NgZone} zone
     *
     * @memberOf NotificationConnection
     */
    constructor(jConnection: any, jProxy: any, zone: NgZone) {
        this._jProxy = jProxy;
        this._jConnection = jConnection;
        this._zone = zone;
        this._errors = this.wireUpErrorsAsObservable();
        this._status = this.wireUpStatusEventsAsObservable();
    }

    public get status(): Observable<ConnectionStatus> {
        return this._status;
    }

    public get errors(): Observable<any> {
        return this._errors;
    }

    public get id(): string {
        return this._jConnection.id;
    }

    public start(): Promise<any> {
        const $promise: Promise<any> = new Promise<any>((resolve, reject) => {
            this._jConnection.start()
                .done((...results: any[]) => {
                    resolve(results);
                })
                .fail((error: any) => {
                    reject(error);
                });
        });

        return $promise;
    }

    public invoke(method: string, ...parameters: any[]): Promise<any> {
        if (method == null)
            throw new Error('SignalRConnection: Failed to invoke. Argument \'method\' can not be null');

        this.log(`SignalRConnection. Start invoking \'${method}\'...`);

        const $promise: Promise<any> = new Promise<any>((resolve, reject) => {
            this._jProxy.invoke(method, ...parameters)
                .done((result: any) => {
                    this.log(`\'${method}\' invoked succesfully. Resolving promise...`);
                    resolve(result);
                    this.log(`Promise resolved.`);
                })
                .fail((err: any) => {
                    console.log(`Invoking \'${method}\' failed. Rejecting promise...`);
                    reject(err);
                    console.log(`Promise rejected.`);
                });
        });

        return $promise;
    }

    public listen<T>(listener: BroadcastEventListener<T>): void {
        if (listener == null)
            throw new Error('Failed to listen. Argument \'listener\' can not be null');

        this.log(`SignalRConnection: Starting to listen to server event with name ${listener.event}`);
        this._jProxy.on(listener.event, (...args: any[]) => {
            this._zone.run(() => {
                let casted: T = null;
                if (args.length === 0) {
                    return;
                }
                casted = args[0] as T;
                this.log('SignalRConnection.proxy.on invoked. Calling listener next() ...');

                listener.next(casted);
                this.log('listener next() called.');
            });
        });
    }

    public listenFor<T>(event: string): BroadcastEventListener<T> {
        if (event == null || event === '')
            throw new Error('Failed to listen. Argument \'event\' can not be empty');

        const listener = new BroadcastEventListener<T>(event);
        this.listen(listener);
        return listener;
    }

    public stop(): void {
        this._jConnection.stop();
    }

    private wireUpErrorsAsObservable(): Observable<any> {
        const sError = new Subject<any>();

        this._jConnection.error((error: any) => {
            this._zone.run(() => {
                sError.next(error);
            });
        });
        return sError;
    }

    private wireUpStatusEventsAsObservable(): Observable<ConnectionStatus> {
        const sStatus = new Subject<ConnectionStatus>();
        const connStatusNames = ['starting', 'received', 'connectionSlow', 'reconnecting', 'reconnected', 'stateChanged', 'disconnected'];
        // aggregate all signalr connection status handlers into 1 observable.
        connStatusNames.forEach((statusName) => {
            // handler wire up, for signalr connection status callback.
            this._jConnection[statusName]((...args: any[]) => {
                this._zone.run(() => {
                    sStatus.next(new ConnectionStatus(statusName));
                });
            });
        });
        return sStatus;
    }

    private log(...args: any[]) {
        if (this._jConnection.logging === false) {
            return;
        }
        console.log(args.join(', '));
    }
}