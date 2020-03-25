import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../profile.service";
import { Profile } from "../models/Profile";
import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faFacebook,
  faLinkedin,
  faYoutube,
  faInstagram
} from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: "app-developer",
  templateUrl: "./developer.component.html",
  styleUrls: ["./developer.component.css"]
})
export class DeveloperComponent implements OnInit {
  profile: Profile;
  githubRepos: [any];
  faGlobe = faGlobe;
  faTwitter = faTwitter;
  faFacebook = faFacebook;
  faLinkedin = faLinkedin;
  faYoutube = faYoutube;
  faInstagram = faInstagram;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    let userID = this.route.snapshot.paramMap.get("userid");

    this.profileService.getProfileByUserid(userID).subscribe(
      (res: Profile) => {
        this.profile = res;

        if (this.profile.githubusername) {
          this.profileService
            .getGithubRepos(this.profile.githubusername)
            .subscribe(
              (res: [any]) => {
                this.githubRepos = res;
              },
              (err: HttpErrorResponse) => {
                console.log(err);
              }
            );
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
  }
}
