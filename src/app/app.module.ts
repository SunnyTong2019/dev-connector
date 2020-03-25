import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";

import { TokenInterceptor } from "./token.interceptor";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { AppComponent } from "./app.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { LandingComponent } from "./landing/landing.component";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { AlertComponent } from "./alert/alert.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { CreateProfileComponent } from "./create-profile/create-profile.component";
import { AddExperienceComponent } from "./add-experience/add-experience.component";
import { AddEducationComponent } from "./add-education/add-education.component";
import { DevelopersComponent } from "./developers/developers.component";
import { DeveloperComponent } from "./developer/developer.component";

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
    AddExperienceComponent,
    AddEducationComponent,
    DevelopersComponent,
    DeveloperComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
