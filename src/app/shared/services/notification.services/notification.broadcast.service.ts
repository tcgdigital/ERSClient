import { Injectable, NgZone } from '@angular/core';
import { IConnectionConfig, ConnectionConfig } from './notification.model';
import { INotificationConnection } from './notification.connection.interface';
import { NotificationConnection } from './notification.connection';

@Injectable()
export class NotificationBroadcastService {

    /**
     * Creates an instance of NotificationBroadcastService.
     * @param {ConnectionConfig} configuration
     * @param {NgZone} zone
     * @param {Function} hubConnectionFn
     *
     * @memberOf NotificationBroadcastService
     */
    constructor(private configuration: ConnectionConfig,
        private zone: NgZone,
        private hubConnectionFn: (url: string) => any) { }

    public connect(config?: IConnectionConfig): Promise<INotificationConnection> {
        const $promise: Promise<INotificationConnection>
            = new Promise<INotificationConnection>((resolve, reject) => {
                const configuration: IConnectionConfig = this.merge(config ? config : {});

                try {
                    const serialized: string = JSON.stringify(configuration.qs);
                    if (configuration.logging) {
                        console.log(`Connecting with...`);
                        console.log(`configuration:[url: '${configuration.url}'] ...`);
                        console.log(`configuration:[hubName: '${configuration.hubName}'] ...`);
                        console.log(`configuration:[qs: '${serialized}'] ...`);
                    }
                } catch (err) {
                    console.log(`Error: ${err}`);
                }

                // create connection object
                const connection = this.hubConnectionFn(configuration.url);
                connection.logging = configuration.logging;
                connection.qs = configuration.qs;

                // create a proxy
                const hubProxy = connection.createHubProxy(configuration.hubName);
                // !!! important. We need to register at least one on function otherwise server callbacks will not work.
                // hubProxy.on('noOp', function () { });

                const hubConnection = new NotificationConnection(connection, hubProxy, this.zone);
                // start the connection
                console.log('Starting SignalR connection ...');

                connection.start({ withCredentials: configuration.withCredentials, jsonp: configuration.jsonp })
                    .done(() => {
                        console.log(`Connection established, ID: ${connection.id}`);
                        console.log(`Connection established, Transport: ${connection.transport.name}`);
                        resolve(hubConnection);
                    })
                    .fail((error: any) => {
                        console.log('Could not connect');
                        reject(`Failed to connect. Error: ${error.message}`); // ex: Error during negotiation request.
                    });
            });

        return $promise;
    }

    private merge(config: IConnectionConfig): ConnectionConfig {
        const merged: ConnectionConfig = new ConnectionConfig();
        merged.hubName = config.hubName || this.configuration.hubName;
        merged.url = config.url || this.configuration.url;
        merged.qs = config.qs || this.configuration.qs;
        merged.logging = this.configuration.logging;
        merged.jsonp = config.jsonp || this.configuration.jsonp;
        merged.withCredentials = config.withCredentials || this.configuration.withCredentials;
        return merged;
    }
}