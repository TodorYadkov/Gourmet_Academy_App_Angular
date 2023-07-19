import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ManagerSessionService } from '../services/users/manager-session.service';

@Injectable()
export class AddHeaderInterceptor implements HttpInterceptor {

  constructor(private managerSession: ManagerSessionService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.managerSession.getSessionToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          'X-Authorization': token.accessToken,
        }
      });
    }

    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
      }
    });

    return next.handle(request);
  }
}
