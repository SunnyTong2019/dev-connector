import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
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

  constructor(private _auth: AuthService, private router: Router) {}

  ngOnInit() {}

  // handle user register
  register() {
    // if passwords don't match, display an alert which will disapper after 5 seconds
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

    // submit user to register route
    this._auth
      .register({ name: this.name, email: this.email, password: this.password })
      .subscribe(
        res => {
          // if register successes, save the token received to localStorage and redirect user to dashboard page
          localStorage.setItem("token", res.toString());
          this.router.navigate(["/dashboard"]);
        },
        (err: HttpErrorResponse) => {
          // if register fails, display an alert for each error
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
