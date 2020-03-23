import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../profile.service";
import { AuthService } from "../auth.service";
import { Experience } from "../models/Experience";
import { Education } from "../models/Education";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  hasProfile: boolean;
  experience: Experience[];
  education: Education[];
  userName: string = "";

  constructor(
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService
      .getUserByToken()
      .subscribe(res => (this.userName = res["name"]));

    this.profileService.getCurrentProfile().subscribe(
      res => {
        this.hasProfile = true;
        this.experience = res["experience"];
        this.education = res["education"];
      },
      (err: HttpErrorResponse) => {
        let errors = err.error.errors;

        if (errors[0] && errors[0].msg === "Profile not found") {
          this.hasProfile = false;
        }
      }
    );
  }

  deleteExperience(expID) {
    console.log(expID);
    this.profileService
      .deleteExperience(expID)
      .subscribe(res => console.log(res));
  }

  deleteEducation(eduID) {
    console.log(eduID);
    this.profileService
      .deleteEducation(eduID)
      .subscribe(res => console.log(res));
  }
}
