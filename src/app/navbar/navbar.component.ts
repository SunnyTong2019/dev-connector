import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  isAuthed: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.isAuthed.subscribe(
      boolValue => (this.isAuthed = boolValue)
    );
  }

  ngOnInit() {}

  logout() {
    localStorage.removeItem("token");
    this.isAuthed = false;
    this.router.navigate(["/login"]);
  }
}
