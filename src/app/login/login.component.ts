import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { Alert } from "../models/Alert";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  email: string = "";
  password: string = "";
  alerts: Alert[] = [];

  constructor(private _auth: AuthService, private router: Router) {}

  ngOnInit() {}

  // handle user login
  login() {
    this._auth.login({ email: this.email, password: this.password }).subscribe(
      res => {
        // if login successes, save the token received to localStorage and redirect user to dashboard page
        localStorage.setItem("token", res.toString());
        this.router.navigate(["/dashboard"]);
      },
      (err: HttpErrorResponse) => {
        // if login fails, display an alert for each error
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
