import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  constructor(private _http: HttpClient) {}

  public createProfile(profile) {
    // should have a headers variable inside each method,
    // if only have one headers variable outside under class, if user 1 log in then log out, then user 2 log in, headers will still have
    // user 1's token.
    let headers = new HttpHeaders({
      "x-access-token": localStorage.getItem("token")
    });
    return this._http.post("/api/profile", profile, { headers: headers });
  }

  public getCurrentProfile() {
    let headers = new HttpHeaders({
      "x-access-token": localStorage.getItem("token")
    });
    console.log(headers);
    return this._http.get("api/profile/me", { headers: headers });
  }

  public addExperience(exp) {
    let headers = new HttpHeaders({
      "x-access-token": localStorage.getItem("token")
    });
    return this._http.put("/api/profile/experience", exp, {
      headers: headers
    });
  }

  public addEducation(edu) {
    let headers = new HttpHeaders({
      "x-access-token": localStorage.getItem("token")
    });
    return this._http.put("/api/profile/education", edu, {
      headers: headers
    });
  }

  public deleteExperience(expID) {
    let headers = new HttpHeaders({
      "x-access-token": localStorage.getItem("token")
    });
    console.log(headers);
    return this._http.put(`/api/profile/experience/${expID}`, {
      headers: headers
    });
  }

  public deleteEducation(eduID) {
    let headers = new HttpHeaders({
      "x-access-token": localStorage.getItem("token")
    });
    return this._http.put("/api/profile/education/" + eduID, {
      headers: headers
    });
  }
}
