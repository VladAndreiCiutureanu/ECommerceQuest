export interface LoginRequest{
    emailOrUsername: string;
    password: string;
}

export interface LoginResponse{
    token: string;
    fullName: string;
}

export interface RegisterRequest{
    email: string;
    username: string;
    fullName: string;
    password: string;
}