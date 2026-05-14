import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../models/product.models";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class ProductService{
    private apiUrl = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient){}

    getAllProducts(): Observable<Product[]>{
        return this.http.get<Product[]>(this.apiUrl);
    }
}