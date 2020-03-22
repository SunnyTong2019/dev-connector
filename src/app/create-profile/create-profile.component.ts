import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../profile.service";
import { Alert } from "../models/Alert";
import { Profile } from "../models/Profile";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-create-profile",
  templateUrl: "./create-profile.component.html",
  styleUrls: ["./create-profile.component.css"]
})
export class CreateProfileComponent implements OnInit {
  statusArray: string[] = [
    "* Select Professional Status",
    "Developer",
    "Junior Developer",
    "Senior Developer",
    "Manager",
    "Student or Learning",
    "Instructor or Teacher",
    "Intern",
    "Other"
  ];

  profile = new Profile(
    this.statusArray[0],
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  );

  displaySocial: boolean = false;
  alerts: Alert[] = [];

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.profileService.getCurrentProfile().subscribe(res => {
      this.profile.status = res["status"];
      this.profile.company = res["company"];
      this.profile.website = res["website"];
      this.profile.location = res["location"];
      this.profile.skills = res["skills"].join(", ");
      this.profile.githubusername = res["githubusername"];
      this.profile.bio = res["bio"];
      this.profile.twitter = res["social"] && res["social"]["twitter"];
      this.profile.facebook = res["social"] && res["social"]["facebook"];
      this.profile.youtube = res["social"] && res["social"]["youtube"];
      this.profile.linkedin = res["social"] && res["social"]["linkedin"];
      this.profile.instagram = res["social"] && res["social"]["instagram"];
    });
  }

  socialToggle() {
    this.displaySocial = !this.displaySocial;
  }

  submitProfile() {
    if (this.profile.status === this.statusArray[0]) {
      this.alerts.push({
        alertType: "danger",
        alertMessage: "Please select professional status"
      });

      setTimeout(() => {
        this.alerts = this.alerts.filter(
          alert => alert.alertMessage !== "Please select professional status"
        );
      }, 5000);
    } else if (this.profile.skills === "") {
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
      this.profileService.createProfile(this.profile).subscribe(
        res => {
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
