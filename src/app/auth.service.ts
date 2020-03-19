import { Injectable, EventEmitter, Output } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";

const jwtHelper = new JwtHelperService();
@Injectable({
  providedIn: "root"
})
export class AuthService {
  @Output() isAuthed = new EventEmitter();

  constructor(private _http: HttpClient) {}

  public register(user) {
    return this._http.post("/api/auth/register", user);
  }

  public login(user) {
    return this._http.post("/api/auth/login", user);
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem("token");

    // Check whether the token is expired and return true or false
    // isTokenExpired returns true when token is null, so no need to check token existence
    if (!jwtHelper.isTokenExpired(token)) {
      this.isAuthed.emit(true);
      return true;
    } else {
      this.isAuthed.emit(false);
      return false;
    }
  }
}
