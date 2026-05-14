import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CheckoutRequest, OrderResponse } from "../models/order.models";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class OrderService{
    private apiUrl = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient){}

    checkout(request: CheckoutRequest): Observable<OrderResponse>{
        return this.http.post<OrderResponse>(`${this.apiUrl}/checkout`, request);
    }
}