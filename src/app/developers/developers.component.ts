import { Component, OnInit } from "@angular/core";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { ProfileService } from "../profile.service";
import { Profile } from "../models/Profile";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-developers",
  templateUrl: "./developers.component.html",
  styleUrls: ["./developers.component.css"]
})
export class DevelopersComponent implements OnInit {
  faCheck = faCheck;
  profiles: Profile[];

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getAllProfiles().subscribe(
      (res: Profile[]) => {
        this.profiles = res;
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
  }
}
