import { Component } from "@angular/core";
import { NotificationService } from "../../services/notification.service";

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.css'
})
export class NotificationComponent{
    constructor(protected notificationService: NotificationService){}
}
