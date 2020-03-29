import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../profile.service";
import { AuthService } from "../auth.service";
import { Experience } from "../models/Experience";
import { Education } from "../models/Education";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

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
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getUserByToken().subscribe(
      res => {
        this.userName = res["name"];
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );

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
        } else {
          console.log(err);
        }
      }
    );
  }

  deleteExperience(expID) {
    this.profileService.deleteExperience(expID).subscribe(
      res => {
        //after the experience is deleted from database, now delete it from UI
        this.experience = this.experience.filter(exp => exp["_id"] !== expID);
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
  }

  deleteEducation(eduID) {
    this.profileService.deleteEducation(eduID).subscribe(
      res => {
        this.education = this.education.filter(edu => edu["_id"] !== eduID);
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
  }

  deleteAccount() {
    this.profileService.deleteAccount().subscribe(
      res => {
        localStorage.removeItem("token");
        this.router.navigate(["/login"]); // when we redirect here, updateNavbar() from app.component.ts will get called which then will update navbar automatically
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
  }
}
