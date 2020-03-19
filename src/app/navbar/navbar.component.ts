import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  isAuthed: boolean = false;

  constructor(private authService: AuthService) {
    this.authService.isAuthed.subscribe(
      boolValue => (this.isAuthed = boolValue)
    );
  }

  ngOnInit() {}
}
