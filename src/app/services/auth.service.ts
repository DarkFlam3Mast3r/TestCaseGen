import { User } from './../models/user.model';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment.development";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer:any;

    constructor(private http: HttpClient,private router:Router) {

    }
    signup(email: string, password: string) {
        console.log(email)
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe(catchError(this.handleError),
            tap(resData=>{
                this.handleAuthentication(resData.email,resData.localId,resData.idToken,+resData.expiresIn)
            }))
    }

    logout(){
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer=null;
    }

    autoLogout(expirationDuration:number){
        console.log(expirationDuration)
        this.tokenExpirationTimer=setTimeout(()=>{
            this.logout()
        },expirationDuration);

    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe(catchError(this.handleError),
            tap(resData=>{
                this.handleAuthentication(resData.email,
                    resData.localId,resData.idToken,+resData.expiresIn)
            }))
    }

    private handleAuthentication(email:string,userId:string,token:string,expiresIn:number){
        const expirationDate = new Date(new Date().getTime() + +expiresIn*1000)
        const user = new User(email,userId,token,expirationDate)
        this.user.next(user);
        this.autoLogout(expiresIn*1000);
        localStorage.setItem('userData',JSON.stringify(user));
    }


    autoLogin(){
        const userData:{
            email:string,
            id:string,
            _token:string,
            _tokenExpirationDate:string,
        }=JSON.parse(localStorage.getItem('userData'));
        if(!userData){
            return
        }
        console.log("auto login")
        console.log(userData)
        const loadedUser = new User(userData.email,userData.id,userData._token,new Date(userData._tokenExpirationDate));
        if(loadedUser.token){
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime()-new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    private handleError(errRes: HttpErrorResponse) {
        let errorMessgae = "An unkown error occured"
        console.log(errRes)
        if (!errRes.error || !errRes.error.error) {
            return throwError(errorMessgae)
        }
        switch (errRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessgae = 'This email exists already';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessgae = 'This email not found';
                break;
            case 'INVALID_PASSWORD':
                errorMessgae = 'password is incorrect';
                break;
            case 'INVALID_LOGIN_CREDENTIALS':
                errorMessgae = 'invalid login credentials';
                break;

        }
        return throwError(errorMessgae);
    }
}