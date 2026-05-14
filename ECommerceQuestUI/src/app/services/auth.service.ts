import { Injectable, computed, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { LoginRequest, LoginResponse, RegisterRequest } from "../models/auth.models";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class AuthService{
    private apiUrl = `${environment.apiUrl}/auth`;

    private _token = signal<string | null>(localStorage.getItem('token'));
    private _fullName = signal<string | null>(localStorage.getItem('fullName'));

    readonly token = this._token.asReadonly();
    readonly fullName = this._fullName.asReadonly();
    readonly isLoggedIn = computed(() => this._token() !== null);

    constructor(private http: HttpClient){}

    register(request: RegisterRequest): Observable<any>{
        return this.http.post(`${this.apiUrl}/register`, request, { responseType: 'text' });
    }

    login(request: LoginRequest): Observable<LoginResponse>{
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
            tap(response => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('fullName', response.fullName);
                this._token.set(response.token);
                this._fullName.set(response.fullName);
            })
        );
    }

    logout():void{
        localStorage.removeItem('token');
        localStorage.removeItem('fullName');
        this._token.set(null);
        this._fullName.set(null);
    }

    getToken(): string | null{
        return this._token();
    }
}
