import { Component, OnInit } from "@angular/core";
import { Experience } from "../models/Experience";
import { HttpErrorResponse } from "@angular/common/http";
import { ProfileService } from "../profile.service";
import { Alert } from "../models/Alert";
import { Profile } from "../models/Profile";

@Component({
  selector: "app-add-experience",
  templateUrl: "./add-experience.component.html",
  styleUrls: ["./add-experience.component.css"]
})
export class AddExperienceComponent implements OnInit {
  experience = new Experience("", "", null, "", null, false, "");

  isCurrent: boolean = false;
  displayToDate: boolean = true;

  alerts: Alert[] = [];

  constructor(private profileService: ProfileService) {}

  ngOnInit() {}

  toggleCurrent() {
    this.isCurrent = !this.isCurrent;
    if (this.isCurrent) {
      this.displayToDate = false;
    } else {
      this.displayToDate = true;
    }
  }

  submitExperience() {
    this.profileService.addExperience(this.experience).subscribe(
      res => {
        this.alerts.push({
          alertType: "success",
          alertMessage: "Experience is added"
        });

        setTimeout(() => {
          this.alerts = this.alerts.filter(
            alert => alert.alertMessage !== "Experience is added"
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
