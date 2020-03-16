import { Component, OnInit, NO_ERRORS_SCHEMA } from "@angular/core";
import { AuthService } from "../auth.service";
import { Alert } from "../models/Alert";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  name: string = "";
  email: string = "";
  password: string = "";
  password2: string = "";
  alerts: Alert[] = [];

  constructor(private _auth: AuthService) {}

  ngOnInit() {}

  register() {
    if (this.password !== this.password2) {
      this.alerts.push({
        alertType: "danger",
        alertMessage: "Passwords do not match!"
      });

      setTimeout(() => {
        this.alerts = this.alerts.filter(
          alert => alert.alertMessage !== "Passwords do not match!"
        );
      }, 5000);
    }

    this._auth
      .register({ name: this.name, email: this.email, password: this.password })
      .subscribe(
        res => {
          console.log(res);
        },
        (err: HttpErrorResponse) => {
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
