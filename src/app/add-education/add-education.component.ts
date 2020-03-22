import { Component, OnInit } from "@angular/core";
import { Education } from "../models/Education";
import { Alert } from "../models/Alert";
import { ProfileService } from "../profile.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-add-education",
  templateUrl: "./add-education.component.html",
  styleUrls: ["./add-education.component.css"]
})
export class AddEducationComponent implements OnInit {
  education = new Education("", "", "", null, null, false, "");

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

  submitEducation() {
    this.profileService.addEducation(this.education).subscribe(
      res => {
        this.alerts.push({
          alertType: "success",
          alertMessage: "Education is added"
        });

        setTimeout(() => {
          this.alerts = this.alerts.filter(
            alert => alert.alertMessage !== "Education is added"
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
