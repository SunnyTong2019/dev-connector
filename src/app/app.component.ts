import { Component } from "@angular/core";
import { AuthService } from "./auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "dev-connector";
  isAuthed: boolean = false;

  constructor(private authService: AuthService) {}

  updateNavbar() {
    if (this.authService.isAuthenticated()) {
      this.isAuthed = true;
    } else {
      this.isAuthed = false;
    }
  }
}
