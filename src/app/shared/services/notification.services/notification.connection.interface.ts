import { Observable } from 'rxjs/Observable';
import { ConnectionStatus } from './notification.model';
import { BroadcastEventListener } from './broadcast.event.listener';

export interface INotificationConnection {
    readonly status: Observable<ConnectionStatus>;
    readonly errors: Observable<any>;
    readonly id: string;

    start(): Promise<any>;
    invoke(method: string, ...parameters: any[]): Promise<any>;
    listen<T>(listener: BroadcastEventListener<T>): void;
    listenFor<T>(listener: string): BroadcastEventListener<T>;
    stop(): void;
}