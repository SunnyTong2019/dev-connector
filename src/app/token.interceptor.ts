import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("token");
    let newHeaders = req.headers;
    if (token) {
      newHeaders = newHeaders.append("x-access-token", token);
    }
    const authReq = req.clone({ headers: newHeaders });
    return next.handle(authReq);
  }
}
