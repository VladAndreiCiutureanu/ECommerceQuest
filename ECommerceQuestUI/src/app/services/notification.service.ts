import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class NotificationService{
    readonly message = signal<string | null>(null);
    private timeoutId?: ReturnType<typeof setTimeout>;

    show(message: string, durationMs: number = 2500): void{
        clearTimeout(this.timeoutId);
        this.message.set(message);
        this.timeoutId = setTimeout(() => this.message.set(null), durationMs);
    }
}
