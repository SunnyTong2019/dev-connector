import { NgModule } from "@angular/core";
import { Routes, CanActivate, RouterModule } from "@angular/router";
import { LandingComponent } from "./landing/landing.component";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthGuardService } from "./auth-guard.service";
import { CreateProfileComponent } from "./create-profile/create-profile.component";
import { AddExperienceComponent } from "./add-experience/add-experience.component";
import { AddEducationComponent } from "./add-education/add-education.component";
import { DevelopersComponent } from "./developers/developers.component";
import { DeveloperComponent } from "./developer/developer.component";

const routes: Routes = [
  { path: "", component: LandingComponent },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "developers", component: DevelopersComponent },
  { path: "developer/:userid", component: DeveloperComponent },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "create-profile",
    component: CreateProfileComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "add-experience",
    component: AddExperienceComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "add-education",
    component: AddEducationComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
