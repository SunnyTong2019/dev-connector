import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { LandingComponent } from "./landing/landing.component";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { AlertComponent } from "./alert/alert.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { AddExperienceComponent } from './add-experience/add-experience.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LandingComponent,
    RegisterComponent,
    LoginComponent,
    AlertComponent,
    DashboardComponent,
    CreateProfileComponent,
    AddExperienceComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
