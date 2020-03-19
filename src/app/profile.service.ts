import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  headers = new HttpHeaders({
    "x-access-token": localStorage.getItem("token")
  });

  constructor(private _http: HttpClient) {}

  public createProfile(profile) {
    return this._http.post("/api/profile", profile, { headers: this.headers });
  }
}
