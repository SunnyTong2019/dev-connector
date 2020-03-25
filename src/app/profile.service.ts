import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  constructor(private _http: HttpClient) {}

  // token will be attached to each request's headers by token.interceptor.ts
  public createProfile(profile) {
    return this._http.post("/api/profile", profile);
  }

  public getCurrentProfile() {
    return this._http.get("api/profile/me");
  }

  public addExperience(exp) {
    return this._http.put("/api/profile/experience", exp);
  }

  public addEducation(edu) {
    return this._http.put("/api/profile/education", edu);
  }

  public deleteExperience(expID) {
    return this._http.delete(`/api/profile/experience/${expID}`);
  }

  public deleteEducation(eduID) {
    return this._http.delete("/api/profile/education/" + eduID);
  }

  public getAllProfiles() {
    return this._http.get("/api/profile");
  }

  public getProfileByUserid(userID) {
    return this._http.get("api/profile/user/" + userID);
  }

  public getGithubRepos(username) {
    return this._http.get("api/profile/github/" + username);
  }
}
