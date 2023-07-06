import {NotificationTypeRecipient} from '../notification-type-recipient/notification-type-recipient.model';

export class NotificationType {
public id: number = null;
public title: string = null;
public query: string = null;
public entity: string = null;
public active: boolean = false;
public withAlert: boolean = false;
public centralNotice: boolean = false;

public notificationTypeRecipients: NotificationTypeRecipient[] = [];
}
