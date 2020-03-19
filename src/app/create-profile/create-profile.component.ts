import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../profile.service";
import { Alert } from "../models/Alert";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-create-profile",
  templateUrl: "./create-profile.component.html",
  styleUrls: ["./create-profile.component.css"]
})
export class CreateProfileComponent implements OnInit {
  statusArray: string[] = [
    "Developer",
    "Junior Developer",
    "Senior Developer",
    "Manager",
    "Student or Learning",
    "Intern",
    "Other"
  ];

  status: string = "0";
  company: string = "";
  website: string = "";
  location: string = "";
  skills: string = "";
  githubusername: string = "";
  bio: string = "";
  twitter: string = "";
  facebook: string = "";
  youtube: string = "";
  linkedin: string = "";
  instagram: string = "";

  alerts: Alert[] = [];

  constructor(private profileService: ProfileService) {}

  ngOnInit() {}

  submitStatus(value) {
    this.status = value;
  }

  submitProfile() {
    if (this.status === "0") {
      this.alerts.push({
        alertType: "danger",
        alertMessage: "Please select professional status"
      });

      setTimeout(() => {
        this.alerts = this.alerts.filter(
          alert => alert.alertMessage !== "Please select professional status"
        );
      }, 5000);
    } else if (this.skills === "") {
      this.alerts.push({
        alertType: "danger",
        alertMessage: "Please enter skills"
      });

      setTimeout(() => {
        this.alerts = this.alerts.filter(
          alert => alert.alertMessage !== "Please enter skills"
        );
      }, 5000);
    } else {
      this.profileService
        .createProfile({
          status: this.status,
          company: this.company,
          website: this.website,
          location: this.location,
          skills: this.skills,
          githubusername: this.githubusername,
          bio: this.bio,
          twitter: this.twitter,
          facebook: this.facebook,
          youtube: this.youtube,
          linkedin: this.linkedin,
          instagram: this.instagram
        })
        .subscribe(
          res => {
            console.log(res);

            this.alerts.push({
              alertType: "success",
              alertMessage: "Profile is updated"
            });

            setTimeout(() => {
              this.alerts = this.alerts.filter(
                alert => alert.alertMessage !== "Profile is updated"
              );
            }, 5000);
          },

          (err: HttpErrorResponse) => {
            // if fails, display an alert for each error
            let errors = err.error.errors;

            if (errors !== null && errors.length > 0) {
              errors.forEach(error => {
                this.alerts.push({
                  alertType: "danger",
                  alertMessage: error.msg
                });

                setTimeout(() => {
                  this.alerts = this.alerts.filter(
                    alert => alert.alertMessage !== error.msg
                  );
                }, 5000);
              });
            }
          }
        );
    }
  }
}
